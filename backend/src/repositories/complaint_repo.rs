use crate::errors::AppError;
use crate::models::{
    Complaint, ComplaintDetailDto, CreateComplaintDto, PublicComplaintDto, StatusHistoryDto,
};
use chrono::Utc;
use sqlx::PgPool;
use uuid::Uuid;

pub struct ComplaintRepo;

impl ComplaintRepo {
    /// Menghasilkan nomor tiket unik format: TKT-YYYYMMDD-XXXXX
    pub async fn generate_ticket_number(pool: &PgPool) -> Result<String, AppError> {
        let today = Utc::now().format("%Y%m%d").to_string();
        let prefix = format!("TKT-{}-", today);

        let count: (i64,) = sqlx::query_as(
            r#"SELECT COUNT(*) FROM complaints WHERE ticket_number LIKE $1"#,
        )
        .bind(format!("{}%", prefix))
        .fetch_one(pool)
        .await
        .map_err(|e| AppError::DatabaseError(format!("Gagal menghitung nomor tiket: {}", e)))?;

        let sequence = count.0 + 1;
        Ok(format!("TKT-{}-{:05}", today, sequence))
    }

    /// Membuat laporan baru dalam transaksi aman
    pub async fn create_complaint(
        pool: &PgPool,
        user_id: Uuid,
        dto: CreateComplaintDto,
    ) -> Result<Complaint, AppError> {
        let ticket_number = Self::generate_ticket_number(pool).await?;
        let visibility = dto.visibility.unwrap_or_else(|| "PUBLIC".to_string());

        let mut tx = pool
            .begin()
            .await
            .map_err(|e| AppError::DatabaseError(format!("Gagal memulai transaksi: {}", e)))?;

        let complaint = sqlx::query_as::<_, Complaint>(
            r#"
            INSERT INTO complaints (
                ticket_number, user_id, category_id, region_id,
                title, description, address_detail, latitude, longitude,
                status, priority, visibility
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'SUBMITTED', 'MEDIUM', $10)
            RETURNING id, ticket_number, user_id, category_id, region_id,
                      title, description, address_detail, latitude, longitude,
                      status, priority, visibility, rejection_reason, created_at, updated_at
            "#,
        )
        .bind(&ticket_number)
        .bind(user_id)
        .bind(dto.category_id)
        .bind(dto.region_id)
        .bind(&dto.title)
        .bind(&dto.description)
        .bind(&dto.address_detail)
        .bind(dto.latitude)
        .bind(dto.longitude)
        .bind(&visibility)
        .fetch_one(&mut *tx)
        .await
        .map_err(|e| AppError::DatabaseError(format!("Gagal menyimpan pengaduan: {}", e)))?;

        // Catat ke riwayat status awal
        sqlx::query(
            r#"
            INSERT INTO complaint_status_history (complaint_id, from_status, to_status, changed_by, notes)
            VALUES ($1, NULL, 'SUBMITTED', $2, 'Laporan dibuat oleh warga')
            "#,
        )
        .bind(complaint.id)
        .bind(user_id)
        .execute(&mut *tx)
        .await
        .map_err(|e| AppError::DatabaseError(format!("Gagal mencatat riwayat awal: {}", e)))?;

        tx.commit()
            .await
            .map_err(|e| AppError::DatabaseError(format!("Gagal commit transaksi: {}", e)))?;

        Ok(complaint)
    }

    /// Laporan publik terverifikasi (PRIVACY PRESERVED - Tidak mengekspos identitas pelapor)
    pub async fn list_public(
        pool: &PgPool,
        limit: i64,
        offset: i64,
    ) -> Result<Vec<PublicComplaintDto>, AppError> {
        let rows = sqlx::query_as::<_, (String, String, String, String, String, Option<String>, Option<String>, f64, f64, String, String, chrono::DateTime<Utc>, chrono::DateTime<Utc>)>(
            r#"
            SELECT 
                c.ticket_number,
                c.title,
                c.description,
                cat.name AS category_name,
                a.name AS agency_name,
                r.name AS region_name,
                c.address_detail,
                c.latitude,
                c.longitude,
                c.status,
                c.priority,
                c.created_at,
                c.updated_at
            FROM complaints c
            JOIN categories cat ON c.category_id = cat.id
            JOIN agencies a ON cat.agency_id = a.id
            LEFT JOIN regions r ON c.region_id = r.id
            WHERE c.visibility = 'PUBLIC' AND c.status IN ('VERIFIED', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED')
            ORDER BY c.created_at DESC
            LIMIT $1 OFFSET $2
            "#,
        )
        .bind(limit)
        .bind(offset)
        .fetch_all(pool)
        .await
        .map_err(|e| AppError::DatabaseError(format!("Gagal memuat pengaduan publik: {}", e)))?;

        let list = rows
            .into_iter()
            .map(|r| PublicComplaintDto {
                ticket_number: r.0,
                title: r.1,
                description: r.2,
                category_name: r.3,
                agency_name: r.4,
                region_name: r.5,
                address_detail: r.6,
                latitude: r.7,
                longitude: r.8,
                status: r.9,
                priority: r.10,
                created_at: r.11,
                updated_at: r.12,
            })
            .collect();

        Ok(list)
    }

    /// Laporan milik warga pelapor itu sendiri
    pub async fn list_mine(pool: &PgPool, user_id: Uuid) -> Result<Vec<Complaint>, AppError> {
        let list = sqlx::query_as::<_, Complaint>(
            r#"
            SELECT id, ticket_number, user_id, category_id, region_id,
                   title, description, address_detail, latitude, longitude,
                   status, priority, visibility, rejection_reason, created_at, updated_at
            FROM complaints
            WHERE user_id = $1
            ORDER BY created_at DESC
            "#,
        )
        .bind(user_id)
        .fetch_all(pool)
        .await
        .map_err(|e| AppError::DatabaseError(format!("Gagal memuat laporan saya: {}", e)))?;

        Ok(list)
    }

    /// Detail lengkap pengaduan dengan timeline riwayat status
    pub async fn get_detail(
        pool: &PgPool,
        complaint_id: Uuid,
    ) -> Result<Option<ComplaintDetailDto>, AppError> {
        let base = sqlx::query_as::<_, (
            Uuid, String, String, String, Option<String>, f64, f64, String, String, String, Option<String>,
            Uuid, String, Uuid, String, Option<Uuid>, Option<String>, Option<String>,
            chrono::DateTime<Utc>, chrono::DateTime<Utc>
        )>(
            r#"
            SELECT 
                c.id, c.ticket_number, c.title, c.description, c.address_detail,
                c.latitude, c.longitude, c.status, c.priority, c.visibility, c.rejection_reason,
                c.category_id, cat.name AS category_name,
                a.id AS agency_id, a.name AS agency_name,
                c.region_id, r.name AS region_name,
                u.full_name AS complainant_name,
                c.created_at, c.updated_at
            FROM complaints c
            JOIN categories cat ON c.category_id = cat.id
            JOIN agencies a ON cat.agency_id = a.id
            LEFT JOIN regions r ON c.region_id = r.id
            JOIN users u ON c.user_id = u.id
            WHERE c.id = $1
            "#,
        )
        .bind(complaint_id)
        .fetch_optional(pool)
        .await
        .map_err(|e| AppError::DatabaseError(format!("Gagal memuat detail pengaduan: {}", e)))?;

        if let Some(c) = base {
            // Ambil timeline
            let timeline_rows = sqlx::query_as::<_, (Uuid, Option<String>, String, Option<String>, Option<String>, chrono::DateTime<Utc>)>(
                r#"
                SELECT h.id, h.from_status, h.to_status, u.full_name AS changed_by_name, h.notes, h.created_at
                FROM complaint_status_history h
                LEFT JOIN users u ON h.changed_by = u.id
                WHERE h.complaint_id = $1
                ORDER BY h.created_at ASC
                "#,
            )
            .bind(complaint_id)
            .fetch_all(pool)
            .await
            .map_err(|e| AppError::DatabaseError(format!("Gagal memuat riwayat timeline: {}", e)))?;

            let timeline = timeline_rows
                .into_iter()
                .map(|t| StatusHistoryDto {
                    id: t.0,
                    from_status: t.1,
                    to_status: t.2,
                    changed_by_name: t.3,
                    notes: t.4,
                    created_at: t.5,
                })
                .collect();

            Ok(Some(ComplaintDetailDto {
                id: c.0,
                ticket_number: c.1,
                title: c.2,
                description: c.3,
                address_detail: c.4,
                latitude: c.5,
                longitude: c.6,
                status: c.7,
                priority: c.8,
                visibility: c.9,
                rejection_reason: c.10,
                category_id: c.11,
                category_name: c.12,
                agency_id: c.13,
                agency_name: c.14,
                region_id: c.15,
                region_name: c.16,
                complainant_name: c.17,
                created_at: c.18,
                updated_at: c.19,
                timeline,
            }))
        } else {
            Ok(None)
        }
    }

    /// Update status pengaduan dalam transaksi transaksional
    pub async fn update_status(
        pool: &PgPool,
        complaint_id: Uuid,
        new_status: &str,
        changed_by: Uuid,
        notes: Option<&str>,
        rejection_reason: Option<&str>,
    ) -> Result<(), AppError> {
        let mut tx = pool
            .begin()
            .await
            .map_err(|e| AppError::DatabaseError(format!("Gagal memulai transaksi: {}", e)))?;

        // Dapatkan status lama
        let old_status: (String,) = sqlx::query_as(
            r#"SELECT status FROM complaints WHERE id = $1 FOR UPDATE"#,
        )
        .bind(complaint_id)
        .fetch_one(&mut *tx)
        .await
        .map_err(|e| AppError::DatabaseError(format!("Pengaduan tidak ditemukan: {}", e)))?;

        // Update tabel complaints
        sqlx::query(
            r#"
            UPDATE complaints
            SET status = $1, rejection_reason = COALESCE($2, rejection_reason), updated_at = CURRENT_TIMESTAMP
            WHERE id = $3
            "#,
        )
        .bind(new_status)
        .bind(rejection_reason)
        .bind(complaint_id)
        .execute(&mut *tx)
        .await
        .map_err(|e| AppError::DatabaseError(format!("Gagal memperbarui status laporan: {}", e)))?;

        // Catat ke history
        sqlx::query(
            r#"
            INSERT INTO complaint_status_history (complaint_id, from_status, to_status, changed_by, notes)
            VALUES ($1, $2, $3, $4, $5)
            "#,
        )
        .bind(complaint_id)
        .bind(&old_status.0)
        .bind(new_status)
        .bind(changed_by)
        .bind(notes)
        .execute(&mut *tx)
        .await
        .map_err(|e| AppError::DatabaseError(format!("Gagal mencatat histori status: {}", e)))?;

        tx.commit()
            .await
            .map_err(|e| AppError::DatabaseError(format!("Gagal commit update status: {}", e)))?;

        Ok(())
    }

    /// Penugasan petugas lapangan oleh Admin OPD
    pub async fn assign_officer(
        pool: &PgPool,
        complaint_id: Uuid,
        officer_id: Uuid,
        assigned_by: Uuid,
        notes: Option<&str>,
    ) -> Result<(), AppError> {
        let mut tx = pool
            .begin()
            .await
            .map_err(|e| AppError::DatabaseError(format!("Gagal memulai transaksi: {}", e)))?;

        // 1. Nonaktifkan penugasan sebelumnya bila ada
        sqlx::query(
            r#"UPDATE complaint_assignments SET is_active = FALSE, ended_at = CURRENT_TIMESTAMP WHERE complaint_id = $1 AND is_active = TRUE"#,
        )
        .bind(complaint_id)
        .execute(&mut *tx)
        .await
        .map_err(|e| AppError::DatabaseError(format!("Gagal mengakhiri penugasan lama: {}", e)))?;

        // 2. Tambah penugasan baru
        sqlx::query(
            r#"
            INSERT INTO complaint_assignments (complaint_id, officer_id, assigned_by, notes, is_active)
            VALUES ($1, $2, $3, $4, TRUE)
            "#,
        )
        .bind(complaint_id)
        .bind(officer_id)
        .bind(assigned_by)
        .bind(notes)
        .execute(&mut *tx)
        .await
        .map_err(|e| AppError::DatabaseError(format!("Gagal membuat penugasan baru: {}", e)))?;

        // 3. Update status laporan menjadi ASSIGNED
        sqlx::query(
            r#"UPDATE complaints SET status = 'ASSIGNED', updated_at = CURRENT_TIMESTAMP WHERE id = $1"#,
        )
        .bind(complaint_id)
        .execute(&mut *tx)
        .await
        .map_err(|e| AppError::DatabaseError(format!("Gagal mengubah status menjadi ASSIGNED: {}", e)))?;

        // 4. Catat riwayat status
        sqlx::query(
            r#"
            INSERT INTO complaint_status_history (complaint_id, from_status, to_status, changed_by, notes)
            VALUES ($1, 'VERIFIED', 'ASSIGNED', $2, $3)
            "#,
        )
        .bind(complaint_id)
        .bind(assigned_by)
        .bind(notes.unwrap_or("Petugas lapangan ditugaskan"))
        .execute(&mut *tx)
        .await
        .map_err(|e| AppError::DatabaseError(format!("Gagal mencatat histori penugasan: {}", e)))?;

        tx.commit()
            .await
            .map_err(|e| AppError::DatabaseError(format!("Gagal commit penugasan: {}", e)))?;

        Ok(())
    }
}

