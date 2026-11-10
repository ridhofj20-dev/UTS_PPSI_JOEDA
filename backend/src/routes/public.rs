use crate::handlers::public_handler;
use axum::{routing::get, Router};
use sqlx::PgPool;

pub fn public_routes() -> Router<PgPool> {
    Router::new()
        .route("/complaints", get(public_handler::list_public_complaints))
        .route("/map", get(public_handler::get_public_map))
}

