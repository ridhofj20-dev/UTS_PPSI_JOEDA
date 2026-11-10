use crate::errors::AppError;
use crate::middleware::AuthUser;
use crate::models::UserRole;
use axum::{extract::State, Json};
use serde_json::json;
use sqlx::PgPool;

pub async fn get_statistics(
    State(pool): State<PgPool>,
    auth: AuthUser,
) -> Result<Json<serde_json::Value>, AppError> {
    auth.require_role(&[UserRole::AgencyAdmin, UserRole::SuperAdmin, UserRole::Officer])?;

    let role = auth.role().unwrap_or(UserRole::AgencyAdmin);
    let agency_filter = auth.0.agency_id;

    let (total_complaints, pending, in_progress, resolved): (i64, i64, i64, i64) = if role == UserRole::SuperAdmin || agency_filter.is_none() {
        let counts: (i64, i64, i64, i64) = sqlx::query_as(
            r#"
            SELECT 
                COUNT(*) AS total,
                COUNT(*) FILTER (WHERE status IN ('SUBMITTED', 'UNDER_REVIEW')) AS pending,
                COUNT(*) FILTER (WHERE status IN ('ASSIGNED', 'IN_PROGRESS')) AS in_progress,
                COUNT(*) FILTER (WHERE status IN ('RESOLVED', 'CLOSED')) AS resolved
            FROM complaints
            "#,
        )
        .fetch_one(&pool)
        .await
        .map_err(|e| AppError::DatabaseError(format!("Gagal memuat statistik: {}", e)))?;
        counts
    } else {
        let agency_id = agency_filter.unwrap();
        let counts: (i64, i64, i64, i64) = sqlx::query_as(
            r#"
            SELECT 
                COUNT(*) AS total,
                COUNT(*) FILTER (WHERE c.status IN ('SUBMITTED', 'UNDER_REVIEW')) AS pending,
                COUNT(*) FILTER (WHERE c.status IN ('ASSIGNED', 'IN_PROGRESS')) AS in_progress,
                COUNT(*) FILTER (WHERE c.status IN ('RESOLVED', 'CLOSED')) AS resolved
            FROM complaints c
            JOIN categories cat ON c.category_id = cat.id
            WHERE cat.agency_id = $1
            "#,
        )
        .bind(agency_id)
        .fetch_one(&pool)
        .await
        .map_err(|e| AppError::DatabaseError(format!("Gagal memuat statistik instansi: {}", e)))?;
        counts
    };

    Ok(Json(json!({
        "summary": {
            "total_complaints": total_complaints,
            "pending_verification": pending,
            "in_progress": in_progress,
            "resolved": resolved,
            "resolution_rate_percent": if total_complaints > 0 {
                ((resolved as f64 / total_complaints as f64) * 100.0).round()
            } else {
                0.0
            }
        }
    })))
}

pub async fn list_audit_logs(
    State(pool): State<PgPool>,
    auth: AuthUser,
) -> Result<Json<serde_json::Value>, AppError> {
    auth.require_role(&[UserRole::SuperAdmin])?;

    let rows = sqlx::query_as::<_, (uuid::Uuid, Option<String>, String, String, Option<String>, Option<serde_json::Value>, chrono::DateTime<chrono::Utc>)>(
        r#"
        SELECT a.id, u.full_name AS actor_name, a.action, a.entity_type, a.entity_id, a.metadata, a.created_at
        FROM audit_logs a
        LEFT JOIN users u ON a.actor_id = u.id
        ORDER BY a.created_at DESC
        LIMIT 100
        "#,
    )
    .fetch_all(&pool)
    .await
    .map_err(|e| AppError::DatabaseError(format!("Gagal memuat audit log: {}", e)))?;

    let logs: Vec<serde_json::Value> = rows
        .into_iter()
        .map(|r| {
            json!({
                "id": r.0,
                "actor": r.1.unwrap_or_else(|| "Sistem / Tamu".to_string()),
                "action": r.2,
                "entity_type": r.3,
                "entity_id": r.4,
                "metadata": r.5,
                "created_at": r.6
            })
        })
        .collect();

    Ok(Json(json!({ "audit_logs": logs })))
}

