pub mod admin;
pub mod auth;
pub mod complaints;
pub mod health;
pub mod master;
pub mod public;

use axum::{routing::get, Router};
use sqlx::PgPool;

pub fn create_router(pool: PgPool) -> Router {
    let api_v1 = Router::new()
        .nest("/auth", auth::auth_routes())
        .nest("/complaints", complaints::complaint_routes())
        .nest("/public", public::public_routes())
        .nest("/admin", admin::admin_routes())
        .nest("/master", master::master_routes())
        .route("/health", get(health::health_check))
        .with_state(pool.clone());

    Router::new()
        .route("/health", get(health::health_check))
        .nest("/api/v1", api_v1)
}
