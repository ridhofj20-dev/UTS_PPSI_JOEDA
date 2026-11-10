use crate::errors::AppError;
use crate::middleware::AuthUser;
use crate::models::{
    AssignComplaintDto, Complaint, ComplaintDetailDto, ComplaintStatus, CreateComplaintDto,
    RejectComplaintDto, UpdateStatusDto, UserRole, VerifyComplaintDto,
};
use crate::repositories::{ComplaintRepo, MasterRepo};
use crate::services::StateMachine;
use axum::{
    extract::{Path, State},
    Json,
};
use serde_json::json;
use sqlx::PgPool;
use uuid::Uuid;

pub async fn create_complaint(
    State(pool): State<PgPool>,
    auth: AuthUser,
    Json(dto): Json<CreateComplaintDto>,
) -> Result<Json<Complaint>, AppError> {
    // Hanya Warga (atau Super Admin) yang dapat membuat laporan
    auth.require_role(&[UserRole::Citizen, UserRole::SuperAdmin])?;

    // Validasi Koordinat Latitude & Longitude
    if dto.latitude < -90.0 || dto.latitude > 90.0 {
        return Err(AppError::BadRequest(
            "Nilai latitude di luar rentang valid (-90 hingga 90)".to_string(),
        ));
    }
    if dto.longitude < -180.0 || dto.longitude > 180.0 {
        return Err(AppError::BadRequest(
            "Nilai longitude di luar rentang valid (-180 hingga 180)".to_string(),
        ));
    }

    if dto.title.trim().is_empty() || dto.description.trim().is_empty() {
        return Err(AppError::BadRequest(
            "Judul dan kronologi laporan tidak boleh kosong".to_string(),
        ));
    }

    let complaint = ComplaintRepo::create_complaint(&pool, auth.0.sub, dto).await?;

    // Catat ke Audit Log
    let _ = MasterRepo::record_audit_log(
        &pool,
        Some(auth.0.sub),
        "CREATE_COMPLAINT",
        "COMPLAINT",
        Some(&complaint.id.to_string()),
        json!({ "ticket_number": complaint.ticket_number }),
    )
    .await;

    Ok(Json(complaint))
}

pub async fn list_mine(
    State(pool): State<PgPool>,
    auth: AuthUser,
) -> Result<Json<Vec<Complaint>>, AppError> {
    let list = ComplaintRepo::list_mine(&pool, auth.0.sub).await?;
    Ok(Json(list))
}

pub async fn get_detail(
    State(pool): State<PgPool>,
    auth: AuthUser,
    Path(id): Path<Uuid>,
) -> Result<Json<ComplaintDetailDto>, AppError> {
    let mut detail = ComplaintRepo::get_detail(&pool, id)
        .await?
        .ok_or_else(|| AppError::NotFound("Pengaduan tidak ditemukan".to_string()))?;

    let user_role = auth.role().unwrap_or(UserRole::Citizen);

    // Jika diakses oleh warga biasa yang bukan pelapor aslinya, samarkan nama pelapor
    if user_role == UserRole::Citizen {
        // Cek apakah pemilik tiket
        let is_owner = sqlx::query_scalar::<_, bool>(
            r#"SELECT EXISTS(SELECT 1 FROM complaints WHERE id = $1 AND user_id = $2)"#,
        )
        .bind(id)
        .bind(auth.0.sub)
        .fetch_one(&pool)
        .await
        .unwrap_or(false);

        if !is_owner {
            detail.complainant_name = Some("Warga Kota Bandar Lampung (Disamarkan)".to_string());
        }
    }

    // Jika diakses oleh Admin Instansi, periksa yurisdiksi dinas
    if user_role == UserRole::AgencyAdmin {
        auth.require_agency(detail.agency_id)?;
    }

    Ok(Json(detail))
}

pub async fn verify_complaint(
    State(pool): State<PgPool>,
    auth: AuthUser,
    Path(id): Path<Uuid>,
    Json(dto): Json<VerifyComplaintDto>,
) -> Result<Json<serde_json::Value>, AppError> {
    // Hanya Admin Instansi atau Super Admin
    auth.require_role(&[UserRole::AgencyAdmin, UserRole::SuperAdmin])?;

    // Ambil status saat ini dan agency_id
    let current = sqlx::query_as::<_, (String, Uuid)>(
        r#"
        SELECT c.status, cat.agency_id 
        FROM complaints c
        JOIN categories cat ON c.category_id = cat.id
        WHERE c.id = $1
        "#,
    )
    .bind(id)
    .fetch_optional(&pool)
    .await?
    .ok_or_else(|| AppError::NotFound("Pengaduan tidak ditemukan".to_string()))?;

    // Validasi kewenangan instansi
    auth.require_agency(current.1)?;

    let current_status = ComplaintStatus::from_str(&current.0)
        .ok_or_else(|| AppError::InternalServerError("Status saat ini tidak valid".to_string()))?;

    // Validasi via State Machine: SUBMITTED / UNDER_REVIEW -> VERIFIED
    let role = auth.role().unwrap_or(UserRole::AgencyAdmin);
    StateMachine::validate_transition(&current_status, &ComplaintStatus::Verified, &role)?;

    let notes = dto.notes.as_deref().unwrap_or("Laporan diverifikasi oleh Admin Instansi");
    ComplaintRepo::update_status(&pool, id, "VERIFIED", auth.0.sub, Some(notes), None).await?;

    // Catat ke Audit Log
    let _ = MasterRepo::record_audit_log(
        &pool,
        Some(auth.0.sub),
        "VERIFY_COMPLAINT",
        "COMPLAINT",
        Some(&id.to_string()),
        json!({ "new_status": "VERIFIED" }),
    )
    .await;

    Ok(Json(json!({
        "success": true,
        "message": "Pengaduan berhasil diverifikasi"
    })))
}

pub async fn reject_complaint(
    State(pool): State<PgPool>,
    auth: AuthUser,
    Path(id): Path<Uuid>,
    Json(dto): Json<RejectComplaintDto>,
) -> Result<Json<serde_json::Value>, AppError> {
    auth.require_role(&[UserRole::AgencyAdmin, UserRole::SuperAdmin])?;

    if dto.reason.trim().is_empty() {
        return Err(AppError::BadRequest("Alasan penolakan pengaduan wajib diisi".to_string()));
    }

    let current = sqlx::query_as::<_, (String, Uuid)>(
        r#"
        SELECT c.status, cat.agency_id 
        FROM complaints c
        JOIN categories cat ON c.category_id = cat.id
        WHERE c.id = $1
        "#,
    )
    .bind(id)
    .fetch_optional(&pool)
    .await?
    .ok_or_else(|| AppError::NotFound("Pengaduan tidak ditemukan".to_string()))?;

    auth.require_agency(current.1)?;

    let current_status = ComplaintStatus::from_str(&current.0)
        .ok_or_else(|| AppError::InternalServerError("Status saat ini tidak valid".to_string()))?;

    let role = auth.role().unwrap_or(UserRole::AgencyAdmin);
    StateMachine::validate_transition(&current_status, &ComplaintStatus::Rejected, &role)?;

    ComplaintRepo::update_status(
        &pool,
        id,
        "REJECTED",
        auth.0.sub,
        Some(&format!("Ditolak: {}", dto.reason)),
        Some(&dto.reason),
    )
    .await?;

    let _ = MasterRepo::record_audit_log(
        &pool,
        Some(auth.0.sub),
        "REJECT_COMPLAINT",
        "COMPLAINT",
        Some(&id.to_string()),
        json!({ "reason": dto.reason }),
    )
    .await;

    Ok(Json(json!({
        "success": true,
        "message": "Pengaduan ditolak dengan alasan tercatat"
    })))
}

pub async fn assign_complaint(
    State(pool): State<PgPool>,
    auth: AuthUser,
    Path(id): Path<Uuid>,
    Json(dto): Json<AssignComplaintDto>,
) -> Result<Json<serde_json::Value>, AppError> {
    auth.require_role(&[UserRole::AgencyAdmin, UserRole::SuperAdmin])?;

    let current = sqlx::query_as::<_, (String, Uuid)>(
        r#"
        SELECT c.status, cat.agency_id 
        FROM complaints c
        JOIN categories cat ON c.category_id = cat.id
        WHERE c.id = $1
        "#,
    )
    .bind(id)
    .fetch_optional(&pool)
    .await?
    .ok_or_else(|| AppError::NotFound("Pengaduan tidak ditemukan".to_string()))?;

    auth.require_agency(current.1)?;

    let current_status = ComplaintStatus::from_str(&current.0)
        .ok_or_else(|| AppError::InternalServerError("Status saat ini tidak valid".to_string()))?;

    let role = auth.role().unwrap_or(UserRole::AgencyAdmin);
    StateMachine::validate_transition(&current_status, &ComplaintStatus::Assigned, &role)?;

    ComplaintRepo::assign_officer(&pool, id, dto.officer_id, auth.0.sub, dto.notes.as_deref()).await?;

    let _ = MasterRepo::record_audit_log(
        &pool,
        Some(auth.0.sub),
        "ASSIGN_OFFICER",
        "COMPLAINT",
        Some(&id.to_string()),
        json!({ "officer_id": dto.officer_id }),
    )
    .await;

    Ok(Json(json!({
        "success": true,
        "message": "Petugas lapangan berhasil ditugaskan"
    })))
}

pub async fn update_status(
    State(pool): State<PgPool>,
    auth: AuthUser,
    Path(id): Path<Uuid>,
    Json(dto): Json<UpdateStatusDto>,
) -> Result<Json<serde_json::Value>, AppError> {
    // Petugas Lapangan, Admin Instansi, atau Super Admin
    auth.require_role(&[UserRole::Officer, UserRole::AgencyAdmin, UserRole::SuperAdmin])?;

    let current = sqlx::query_as::<_, (String, Uuid)>(
        r#"
        SELECT c.status, cat.agency_id 
        FROM complaints c
        JOIN categories cat ON c.category_id = cat.id
        WHERE c.id = $1
        "#,
    )
    .bind(id)
    .fetch_optional(&pool)
    .await?
    .ok_or_else(|| AppError::NotFound("Pengaduan tidak ditemukan".to_string()))?;

    let target_status = ComplaintStatus::from_str(&dto.to_status)
        .ok_or_else(|| AppError::BadRequest("Target status tidak valid".to_string()))?;

    let current_status = ComplaintStatus::from_str(&current.0)
        .ok_or_else(|| AppError::InternalServerError("Status saat ini tidak valid".to_string()))?;

    let role = auth.role().unwrap_or(UserRole::Officer);
    StateMachine::validate_transition(&current_status, &target_status, &role)?;

    ComplaintRepo::update_status(
        &pool,
        id,
        target_status.as_str(),
        auth.0.sub,
        dto.notes.as_deref(),
        None,
    )
    .await?;

    let _ = MasterRepo::record_audit_log(
        &pool,
        Some(auth.0.sub),
        "UPDATE_STATUS",
        "COMPLAINT",
        Some(&id.to_string()),
        json!({ "from": current_status.as_str(), "to": target_status.as_str() }),
    )
    .await;

    Ok(Json(json!({
        "success": true,
        "message": format!("Status pengaduan berhasil diperbarui menjadi {}", target_status.as_str())
    })))
}

