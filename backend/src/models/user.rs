use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize, sqlx::FromRow)]
pub struct User {
    pub id: Uuid,
    pub role_id: Uuid,
    pub region_id: Option<Uuid>,
    pub full_name: String,
    pub email: String,
    pub phone: Option<String>,
    pub nik: Option<String>,
    #[serde(skip_serializing)]
    pub password_hash: String,
    pub is_active: BOOLEAN_TYPE,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

pub type BOOLEAN_TYPE = bool;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub enum UserRole {
    #[serde(rename = "SUPER_ADMIN")]
    SuperAdmin,
    #[serde(rename = "AGENCY_ADMIN")]
    AgencyAdmin,
    #[serde(rename = "OFFICER")]
    Officer,
    #[serde(rename = "CITIZEN")]
    Citizen,
}

impl UserRole {
    pub fn from_str(s: &str) -> Option<Self> {
        match s.to_uppercase().as_str() {
            "SUPER_ADMIN" => Some(UserRole::SuperAdmin),
            "AGENCY_ADMIN" => Some(UserRole::AgencyAdmin),
            "OFFICER" => Some(UserRole::Officer),
            "CITIZEN" => Some(UserRole::Citizen),
            _ => None,
        }
    }

    pub fn as_str(&self) -> &'static str {
        match self {
            UserRole::SuperAdmin => "SUPER_ADMIN",
            UserRole::AgencyAdmin => "AGENCY_ADMIN",
            UserRole::Officer => "OFFICER",
            UserRole::Citizen => "CITIZEN",
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UserClaims {
    pub sub: Uuid,
    pub role: String,
    pub email: String,
    pub full_name: String,
    pub agency_id: Option<Uuid>,
    pub exp: i64,
    pub iat: i64,
}

#[derive(Debug, Deserialize)]
pub struct RegisterDto {
    pub full_name: String,
    pub email: String,
    pub phone: Option<String>,
    pub nik: String,
    pub password: String,
}

#[derive(Debug, Deserialize)]
pub struct LoginDto {
    pub email: String,
    pub password: String,
}

#[derive(Debug, Serialize)]
pub struct AuthResponse {
    pub token: String,
    pub token_type: String,
    pub user: UserProfileDto,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UserProfileDto {
    pub id: Uuid,
    pub role: String,
    pub full_name: String,
    pub email: String,
    pub phone: Option<String>,
    pub nik: Option<String>,
    pub agency_id: Option<Uuid>,
    pub agency_name: Option<String>,
}
