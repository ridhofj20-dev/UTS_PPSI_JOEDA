use crate::handlers::master_handler;
use axum::{routing::get, Router};
use sqlx::PgPool;

pub fn master_routes() -> Router<PgPool> {
    Router::new()
        .route("/regions", get(master_handler::list_regions))
        .route("/agencies", get(master_handler::list_agencies))
        .route("/categories", get(master_handler::list_categories))
}

