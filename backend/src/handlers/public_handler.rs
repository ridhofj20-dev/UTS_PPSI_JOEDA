use crate::errors::AppError;
use crate::models::PublicComplaintDto;
use crate::repositories::ComplaintRepo;
use axum::{
    extract::{Query, State},
    Json,
};
use serde::Deserialize;
use serde_json::json;
use sqlx::PgPool;

#[derive(Debug, Deserialize)]
pub struct PaginationQuery {
    pub limit: Option<i64>,
    pub offset: Option<i64>,
}

pub async fn list_public_complaints(
    State(pool): State<PgPool>,
    Query(query): Query<PaginationQuery>,
) -> Result<Json<Vec<PublicComplaintDto>>, AppError> {
    let limit = query.limit.unwrap_or(20).min(100);
    let offset = query.offset.unwrap_or(0);

    let complaints = ComplaintRepo::list_public(&pool, limit, offset).await?;
    Ok(Json(complaints))
}

pub async fn get_public_map(
    State(pool): State<PgPool>,
) -> Result<Json<serde_json::Value>, AppError> {
    let rows = sqlx::query_as::<_, (String, String, String, String, f64, f64, String)>(
        r#"
        SELECT 
            c.ticket_number,
            c.title,
            cat.name AS category_name,
            c.status,
            c.latitude,
            c.longitude,
            c.priority
        FROM complaints c
        JOIN categories cat ON c.category_id = cat.id
        WHERE c.visibility = 'PUBLIC' AND c.status IN ('VERIFIED', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED')
        ORDER BY c.created_at DESC
        LIMIT 200
        "#,
    )
    .fetch_all(&pool)
    .await
    .map_err(|e| AppError::DatabaseError(format!("Gagal memuat peta publik: {}", e)))?;

    let points: Vec<serde_json::Value> = rows
        .into_iter()
        .map(|r| {
            json!({
                "ticket_number": r.0,
                "title": r.1,
                "category": r.2,
                "status": r.3,
                "lat": r.4,
                "lng": r.5,
                "priority": r.6
            })
        })
        .collect();

    Ok(Json(json!({
        "total": points.len(),
        "points": points
    })))
}

