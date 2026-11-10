use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub enum ComplaintStatus {
    #[serde(rename = "SUBMITTED")]
    Submitted,
    #[serde(rename = "UNDER_REVIEW")]
    UnderReview,
    #[serde(rename = "VERIFIED")]
    Verified,
    #[serde(rename = "ASSIGNED")]
    Assigned,
    #[serde(rename = "IN_PROGRESS")]
    InProgress,
    #[serde(rename = "RESOLVED")]
    Resolved,
    #[serde(rename = "REJECTED")]
    Rejected,
    #[serde(rename = "CLOSED")]
    Closed,
}

impl ComplaintStatus {
    pub fn from_str(s: &str) -> Option<Self> {
        match s.to_uppercase().as_str() {
            "SUBMITTED" => Some(ComplaintStatus::Submitted),
            "UNDER_REVIEW" => Some(ComplaintStatus::UnderReview),
            "VERIFIED" => Some(ComplaintStatus::Verified),
            "ASSIGNED" => Some(ComplaintStatus::Assigned),
            "IN_PROGRESS" => Some(ComplaintStatus::InProgress),
            "RESOLVED" => Some(ComplaintStatus::Resolved),
            "REJECTED" => Some(ComplaintStatus::Rejected),
            "CLOSED" => Some(ComplaintStatus::Closed),
            _ => None,
        }
    }

    pub fn as_str(&self) -> &'static str {
        match self {
            ComplaintStatus::Submitted => "SUBMITTED",
            ComplaintStatus::UnderReview => "UNDER_REVIEW",
            ComplaintStatus::Verified => "VERIFIED",
            ComplaintStatus::Assigned => "ASSIGNED",
            ComplaintStatus::InProgress => "IN_PROGRESS",
            ComplaintStatus::Resolved => "RESOLVED",
            ComplaintStatus::Rejected => "REJECTED",
            ComplaintStatus::Closed => "CLOSED",
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize, sqlx::FromRow)]
pub struct Complaint {
    pub id: Uuid,
    pub ticket_number: String,
    pub user_id: Uuid,
    pub category_id: Uuid,
    pub region_id: Option<Uuid>,
    pub title: String,
    pub description: String,
    pub address_detail: Option<String>,
    pub latitude: f64,
    pub longitude: f64,
    pub status: String,
    pub priority: String,
    pub visibility: String,
    pub rejection_reason: Option<String>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Deserialize)]
pub struct CreateComplaintDto {
    pub category_id: Uuid,
    pub region_id: Option<Uuid>,
    pub title: String,
    pub description: String,
    pub address_detail: Option<String>,
    pub latitude: f64,
    pub longitude: f64,
    pub visibility: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct PublicComplaintDto {
    pub ticket_number: String,
    pub title: String,
    pub description: String,
    pub category_name: String,
    pub agency_name: String,
    pub region_name: Option<String>,
    pub address_detail: Option<String>,
    pub latitude: f64,
    pub longitude: f64,
    pub status: String,
    pub priority: String,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ComplaintDetailDto {
    pub id: Uuid,
    pub ticket_number: String,
    pub title: String,
    pub description: String,
    pub address_detail: Option<String>,
    pub latitude: f64,
    pub longitude: f64,
    pub status: String,
    pub priority: String,
    pub visibility: String,
    pub rejection_reason: Option<String>,
    pub category_id: Uuid,
    pub category_name: String,
    pub agency_id: Uuid,
    pub agency_name: String,
    pub region_id: Option<Uuid>,
    pub region_name: Option<String>,
    pub complainant_name: Option<String>, // Terisi hanya jika diakses berwenang/pelapor itu sendiri
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
    pub timeline: Vec<StatusHistoryDto>,
}

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
pub struct StatusHistoryDto {
    pub id: Uuid,
    pub from_status: Option<String>,
    pub to_status: String,
    pub changed_by_name: Option<String>,
    pub notes: Option<String>,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Deserialize)]
pub struct VerifyComplaintDto {
    pub priority: Option<String>,
    pub notes: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct RejectComplaintDto {
    pub reason: String,
}

#[derive(Debug, Deserialize)]
pub struct AssignComplaintDto {
    pub officer_id: Uuid,
    pub notes: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct UpdateStatusDto {
    pub to_status: String,
    pub notes: Option<String>,
}
