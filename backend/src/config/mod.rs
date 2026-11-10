use std::env;

#[derive(Clone, Debug)]
pub struct AppConfig {
    pub server_host: String,
    pub server_port: u16,
    pub database_url: String,
    pub jwt_secret: String,
    pub jwt_expiration_hours: i64,
    pub environment: String,
    pub upload_dir: String,
    pub allowed_origins: String,
}

impl AppConfig {
    pub fn from_env() -> Result<Self, String> {
        let server_host = env::var("SERVER_HOST").unwrap_or_else(|_| "0.0.0.0".to_string());
        let server_port = env::var("SERVER_PORT")
            .unwrap_or_else(|_| "8080".to_string())
            .parse::<u16>()
            .map_err(|e| format!("Invalid SERVER_PORT: {}", e))?;

        let database_url = env::var("DATABASE_URL").unwrap_or_else(|_| {
            "postgres://postgres:postgres@localhost:5432/lampung_report".to_string()
        });

        let jwt_secret = env::var("JWT_SECRET").unwrap_or_else(|_| {
            "super-secret-development-key-lampung-report-2026-teknokrat".to_string()
        });

        let jwt_expiration_hours = env::var("JWT_EXPIRATION_HOURS")
            .unwrap_or_else(|_| "24".to_string())
            .parse::<i64>()
            .unwrap_or(24);

        let environment = env::var("APP_ENV").unwrap_or_else(|_| "development".to_string());
        let upload_dir = env::var("UPLOAD_DIR").unwrap_or_else(|_| "./uploads".to_string());
        let allowed_origins = env::var("ALLOWED_ORIGINS").unwrap_or_else(|_| "*".to_string());

        Ok(Self {
            server_host,
            server_port,
            database_url,
            jwt_secret,
            jwt_expiration_hours,
            environment,
            upload_dir,
            allowed_origins,
        })
    }
}

