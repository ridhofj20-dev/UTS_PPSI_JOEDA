use crate::config::AppConfig;
use crate::errors::AppError;
use crate::models::{UserClaims, UserRole};
use crate::services::AuthService;
use axum::{
    async_trait,
    extract::FromRequestParts,
    http::request::Parts,
};
use std::sync::Arc;

#[derive(Debug, Clone)]
pub struct AuthUser(pub UserClaims);

#[async_trait]
impl<S> FromRequestParts<S> for AuthUser
where
    S: Send + Sync,
{
    type Rejection = AppError;

    async fn from_request_parts(parts: &mut Parts, _state: &S) -> Result<Self, Self::Rejection> {
        let auth_header = parts
            .headers
            .get("Authorization")
            .and_then(|val| val.to_str().ok())
            .ok_or_else(|| {
                AppError::AuthError("Header Authorization (Bearer token) diperlukan".to_string())
            })?;

        if !auth_header.starts_with("Bearer ") {
            return Err(AppError::AuthError(
                "Format token tidak valid. Gunakan: Bearer <token>".to_string(),
            ));
        }

        let token = &auth_header[7..];

        // Dapatkan JWT Secret dari Config / Environment
        let config = AppConfig::from_env()
            .map_err(|e| AppError::InternalServerError(format!("Config error: {}", e)))?;

        let claims = AuthService::validate_token(token, &config.jwt_secret)?;

        Ok(AuthUser(claims))
    }
}

impl AuthUser {
    pub fn role(&self) -> Option<UserRole> {
        UserRole::from_str(&self.0.role)
    }

    pub fn require_role(&self, allowed_roles: &[UserRole]) -> Result<(), AppError> {
        let user_role = self.role().ok_or_else(|| {
            AppError::Forbidden("Peran pengguna tidak dikenali sistem".to_string())
        })?;

        if allowed_roles.contains(&user_role) {
            Ok(())
        } else {
            Err(AppError::Forbidden(format!(
                "Akses ditolak. Endpoint ini membutuhkan hak akses: {:?}",
                allowed_roles
                    .iter()
                    .map(|r| r.as_str())
                    .collect::<Vec<_>>()
            )))
        }
    }

    pub fn require_agency(&self, target_agency_id: uuid::Uuid) -> Result<(), AppError> {
        if self.role() == Some(UserRole::SuperAdmin) {
            return Ok(());
        }

        if let Some(user_agency) = self.0.agency_id {
            if user_agency == target_agency_id {
                return Ok(());
            }
        }

        Err(AppError::Forbidden(
            "Akses ditolak. Anda tidak memiliki wewenang pada data instansi ini".to_string(),
        ))
    }
}

