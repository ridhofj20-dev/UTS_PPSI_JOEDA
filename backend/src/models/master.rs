use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize, sqlx::FromRow)]
pub struct RegionDto {
    pub id: Uuid,
    pub parent_id: Option<Uuid>,
    pub name: String,
    pub region_type: String,
    pub administrative_code: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize, sqlx::FromRow)]
pub struct AgencyDto {
    pub id: Uuid,
    pub name: String,
    pub code: String,
    pub contact_phone: Option<String>,
    pub contact_email: Option<String>,
    pub is_active: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize, sqlx::FromRow)]
pub struct CategoryDto {
    pub id: Uuid,
    pub agency_id: Uuid,
    pub agency_name: Option<String>,
    pub name: String,
    pub slug: String,
    pub description: Option<String>,
    pub icon: Option<String>,
    pub is_active: bool,
}
