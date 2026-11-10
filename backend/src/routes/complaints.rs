use crate::handlers::complaint_handler;
use axum::{
    routing::{get, post},
    Router,
};
use sqlx::PgPool;

pub fn complaint_routes() -> Router<PgPool> {
    Router::new()
        .route("/", post(complaint_handler::create_complaint))
        .route("/mine", get(complaint_handler::list_mine))
        .route("/:id", get(complaint_handler::get_detail))
        .route("/:id/verify", post(complaint_handler::verify_complaint))
        .route("/:id/reject", post(complaint_handler::reject_complaint))
        .route("/:id/assign", post(complaint_handler::assign_complaint))
        .route("/:id/status", post(complaint_handler::update_status))
}

