use crate::errors::AppError;
use crate::models::UserClaims;
use argon2::{
    password_hash::{rand_core::OsRng, PasswordHash, PasswordHasher, PasswordVerifier, SaltString},
    Argon2,
};
use chrono::Utc;
use jsonwebtoken::{decode, encode, DecodingKey, EncodingKey, Header, Validation};
use uuid::Uuid;

pub struct AuthService;

impl AuthService {
    pub fn hash_password(password: &str) -> Result<String, AppError> {
        let salt = SaltString::generate(&mut OsRng);
        let argon2 = Argon2::default();
        let password_hash = argon2
            .hash_password(password.as_bytes(), &salt)
            .map_err(|e| AppError::InternalServerError(format!("Password hashing failed: {}", e)))?
            .to_string();

        Ok(password_hash)
    }

    pub fn verify_password(password: &str, password_hash: &str) -> Result<bool, AppError> {
        let parsed_hash = PasswordHash::new(password_hash)
            .map_err(|e| AppError::AuthError(format!("Invalid stored password hash: {}", e)))?;

        let argon2 = Argon2::default();
        match argon2.verify_password(password.as_bytes(), &parsed_hash) {
            Ok(_) => Ok(true),
            Err(_) => Ok(false),
        }
    }

    pub fn generate_token(
        user_id: Uuid,
        role: &str,
        email: &str,
        full_name: &str,
        agency_id: Option<Uuid>,
        jwt_secret: &str,
        expiration_hours: i64,
    ) -> Result<String, AppError> {
        let now = Utc::now().timestamp();
        let exp = now + (expiration_hours * 3600);

        let claims = UserClaims {
            sub: user_id,
            role: role.to_string(),
            email: email.to_string(),
            full_name: full_name.to_string(),
            agency_id,
            exp,
            iat: now,
        };

        encode(
            &Header::default(),
            &claims,
            &EncodingKey::from_secret(jwt_secret.as_bytes()),
        )
        .map_err(|e| AppError::InternalServerError(format!("Token creation failed: {}", e)))
    }

    pub fn validate_token(token: &str, jwt_secret: &str) -> Result<UserClaims, AppError> {
        let mut validation = Validation::default();
        validation.validate_exp = true;

        let token_data = decode::<UserClaims>(
            token,
            &DecodingKey::from_secret(jwt_secret.as_bytes()),
            &validation,
        )
        .map_err(|e| AppError::AuthError(format!("Invalid or expired JWT token: {}", e)))?;

        Ok(token_data.claims)
    }
}
