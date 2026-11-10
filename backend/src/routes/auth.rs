use crate::handlers::auth_handler;
use axum::{
    routing::{get, post},
    Router,
};
use sqlx::PgPool;

pub fn auth_routes() -> Router<PgPool> {
    Router::new()
        .route("/register", post(auth_handler::register))
        .route("/login", post(auth_handler::login))
        .route("/me", get(auth_handler::get_me))
}

