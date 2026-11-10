use axum::{response::IntoResponse, Json};
use chrono::Utc;
use serde_json::json;

pub async fn health_check() -> impl IntoResponse {
    Json(json!({
        "status": "ok",
        "service": "lampung-report-backend",
        "version": env!("CARGO_PKG_VERSION"),
        "timestamp": Utc::now().to_rfc3339(),
        "database": "connected",
        "message": "Lampung Report Smart Public Complaint System API is online"
    }))
}

