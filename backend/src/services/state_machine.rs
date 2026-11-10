use crate::errors::AppError;
use crate::models::{ComplaintStatus, UserRole};

pub struct StateMachine;

impl StateMachine {
    /// Memvalidasi apakah transisi dari `current_status` menuju `target_status` diperbolehkan
    /// dan apakah `actor_role` memiliki wewenang untuk melakukan transisi tersebut.
    pub fn validate_transition(
        current_status: &ComplaintStatus,
        target_status: &ComplaintStatus,
        actor_role: &UserRole,
    ) -> Result<(), AppError> {
        // Super Admin memiliki izin bypass untuk koreksi administratif
        if *actor_role == UserRole::SuperAdmin {
            return Ok(());
        }

        match (current_status, target_status) {
            // SUBMITTED -> UNDER_REVIEW (Hanya Admin Instansi / Super Admin)
            (ComplaintStatus::Submitted, ComplaintStatus::UnderReview) => {
                if *actor_role == UserRole::AgencyAdmin {
                    Ok(())
                } else {
                    Err(AppError::Forbidden(
                        "Hanya Admin Instansi yang dapat memeriksa aduan masuk".to_string(),
                    ))
                }
            }

            // UNDER_REVIEW -> VERIFIED (Admin Instansi menyetujui)
            (ComplaintStatus::UnderReview, ComplaintStatus::Verified) => {
                if *actor_role == UserRole::AgencyAdmin {
                    Ok(())
                } else {
                    Err(AppError::Forbidden(
                        "Hanya Admin Instansi yang dapat memverifikasi aduan".to_string(),
                    ))
                }
            }

            // UNDER_REVIEW -> REJECTED (Admin Instansi menolak aduan)
            (ComplaintStatus::UnderReview, ComplaintStatus::Rejected) => {
                if *actor_role == UserRole::AgencyAdmin {
                    Ok(())
                } else {
                    Err(AppError::Forbidden(
                        "Hanya Admin Instansi yang dapat menolak aduan".to_string(),
                    ))
                }
            }

            // VERIFIED -> ASSIGNED (Admin Instansi menugaskan petugas lapangan)
            (ComplaintStatus::Verified, ComplaintStatus::Assigned) => {
                if *actor_role == UserRole::AgencyAdmin {
                    Ok(())
                } else {
                    Err(AppError::Forbidden(
                        "Hanya Admin Instansi yang dapat menugaskan petugas lapangan".to_string(),
                    ))
                }
            }

            // ASSIGNED -> IN_PROGRESS (Petugas Lapangan memulai pengerjaan)
            (ComplaintStatus::Assigned, ComplaintStatus::InProgress) => {
                if *actor_role == UserRole::Officer || *actor_role == UserRole::AgencyAdmin {
                    Ok(())
                } else {
                    Err(AppError::Forbidden(
                        "Hanya Petugas Lapangan yang ditugaskan yang dapat memulai pengerjaan"
                            .to_string(),
                    ))
                }
            }

            // IN_PROGRESS -> RESOLVED (Petugas Lapangan menyelesaikan pekerjaan)
            (ComplaintStatus::InProgress, ComplaintStatus::Resolved) => {
                if *actor_role == UserRole::Officer || *actor_role == UserRole::AgencyAdmin {
                    Ok(())
                } else {
                    Err(AppError::Forbidden(
                        "Hanya Petugas Lapangan atau Admin yang dapat menyatakan pekerjaan selesai"
                            .to_string(),
                    ))
                }
            }

            // RESOLVED -> CLOSED (Warga pelapor atau Admin menutup aduan)
            (ComplaintStatus::Resolved, ComplaintStatus::Closed) => {
                if *actor_role == UserRole::Citizen
                    || *actor_role == UserRole::AgencyAdmin
                    || *actor_role == UserRole::SuperAdmin
                {
                    Ok(())
                } else {
                    Err(AppError::Forbidden(
                        "Penutupan laporan hanya dapat dilakukan oleh pelapor atau admin"
                            .to_string(),
                    ))
                }
            }

            // Transisi ilegal lainnya
            _ => Err(AppError::BadRequest(format!(
                "Transisi status tidak valid dari {} menuju {}",
                current_status.as_str(),
                target_status.as_str()
            ))),
        }
    }
}

