use crate::handlers::admin_handler;
use axum::{routing::get, Router};
use sqlx::PgPool;

pub fn admin_routes() -> Router<PgPool> {
    Router::new()
        .route("/statistics", get(admin_handler::get_statistics))
        .route("/audit-logs", get(admin_handler::list_audit_logs))
}

