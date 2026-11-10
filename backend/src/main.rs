mod config;
mod errors;
mod handlers;
mod middleware;
mod models;
mod repositories;
mod routes;
mod services;

use config::AppConfig;
use sqlx::postgres::PgPoolOptions;
use std::net::SocketAddr;
use std::time::Duration;
use tower_http::cors::{Any, CorsLayer};
use tower_http::trace::TraceLayer;
use tracing::{error, info, warn};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // 1. Inisialisasi Environment & Tracing Subscriber
    dotenvy::dotenv().ok();
    tracing_subscriber::fmt()
        .with_env_filter(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "info,tower_http=debug,axum=debug".into()),
        )
        .init();

    // 2. Load Configuration
    let config = AppConfig::from_env().expect("Failed to load application configuration");
    info!(
        "Inisialisasi Lampung Report Backend API v{} [Lingkungan: {}]",
        env!("CARGO_PKG_VERSION"),
        config.environment
    );

    // 3. Setup PostgreSQL Connection Pool via SQLx
    info!("Menghubungkan ke PostgreSQL: {}", sanitize_db_url(&config.database_url));
    let pool = match PgPoolOptions::new()
        .max_connections(20)
        .min_connections(2)
        .acquire_timeout(Duration::from_secs(5))
        .idle_timeout(Duration::from_secs(600))
        .connect(&config.database_url)
        .await
    {
        Ok(pool) => {
            info!("Koneksi PostgreSQL berhasil dibuat.");
            pool
        }
        Err(e) => {
            warn!("Perhatian: Gagal terhubung langsung ke database PostgreSQL: {}. Server tetap berjalan untuk health check dan simulasi.", e);
            // Fallback pool connection attempt with minimal setup or lazy pool
            PgPoolOptions::new()
                .max_connections(5)
                .connect_lazy(&config.database_url)
                .expect("Failed to initialize lazy database pool")
        }
    };

    // 4. Setup CORS Middleware dengan Dukungan Whitelist Domain Aman
    let cors = if config.environment == "production" && config.allowed_origins != "*" {
        let origins: Vec<_> = config
            .allowed_origins
            .split(',')
            .filter_map(|s| s.trim().parse().ok())
            .collect();
        CorsLayer::new()
            .allow_origin(origins)
            .allow_methods(Any)
            .allow_headers(Any)
    } else {
        CorsLayer::new()
            .allow_origin(Any)
            .allow_methods(Any)
            .allow_headers(Any)
    };

    // 5. Build Axum Router dengan Shared State (PgPool)
    let app = routes::create_router(pool)
        .layer(cors)
        .layer(TraceLayer::new_for_http());

    // 6. Bind Server Address & Start Listening
    let addr = SocketAddr::from(([0, 0, 0, 0], config.server_port));
    info!("Server Axum mendengarkan pada http://{}", addr);

    let listener = tokio::net::TcpListener::bind(addr).await?;
    axum::serve(listener, app)
        .with_graceful_shutdown(shutdown_signal())
        .await?;

    Ok(())
}

fn sanitize_db_url(url: &str) -> String {
    if let Some(at_idx) = url.find('@') {
        if let Some(colon_idx) = url[..at_idx].rfind(':') {
            return format!("{}****{}", &url[..colon_idx + 1], &url[at_idx..]);
        }
    }
    url.to_string()
}

async fn shutdown_signal() {
    tokio::signal::ctrl_c()
        .await
        .expect("Failed to install CTRL+C signal handler");
    info!("Menerima sinyal shutdown, mematikan server Lampung Report secara graceful...");
}
