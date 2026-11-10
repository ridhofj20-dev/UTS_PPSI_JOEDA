// ============================================================================
// LAMPUNG REPORT — TEST SUITE: STATE MACHINE & COMPLAINT LIFECYCLE
// Verifies AT-05, AT-06, and AT-07 acceptance criteria
// ============================================================================

#[cfg(test)]
mod tests {
    use lampung_report_backend::models::{ComplaintStatus, UserRole};
    use lampung_report_backend::services::StateMachine;

    #[test]
    fn test_valid_agency_admin_review_and_verification() {
        // Submitted -> UnderReview (Diperbolehkan untuk AgencyAdmin)
        let res1 = StateMachine::validate_transition(
            &ComplaintStatus::Submitted,
            &ComplaintStatus::UnderReview,
            &UserRole::AgencyAdmin,
        );
        assert!(res1.is_ok(), "Admin Instansi harus diizinkan memeriksa aduan masuk");

        // UnderReview -> Verified (Diperbolehkan untuk AgencyAdmin)
        let res2 = StateMachine::validate_transition(
            &ComplaintStatus::UnderReview,
            &ComplaintStatus::Verified,
            &UserRole::AgencyAdmin,
        );
        assert!(res2.is_ok(), "Admin Instansi harus diizinkan memverifikasi aduan");
    }

    #[test]
    fn test_valid_agency_admin_rejection() {
        // UnderReview -> Rejected (Diperbolehkan untuk AgencyAdmin)
        let res = StateMachine::validate_transition(
            &ComplaintStatus::UnderReview,
            &ComplaintStatus::Rejected,
            &UserRole::AgencyAdmin,
        );
        assert!(res.is_ok(), "Admin Instansi harus diizinkan menolak aduan yang tidak valid");
    }

    #[test]
    fn test_direct_triage_verification_and_rejection() {
        // Submitted -> Verified (Triage cepat: langsung diverifikasi oleh AgencyAdmin)
        let res1 = StateMachine::validate_transition(
            &ComplaintStatus::Submitted,
            &ComplaintStatus::Verified,
            &UserRole::AgencyAdmin,
        );
        assert!(res1.is_ok(), "Admin Instansi harus diizinkan langsung memverifikasi aduan baru pada antrean triage");

        // Submitted -> Rejected (Triage cepat: langsung ditolak jika spam/di luar yurisdiksi)
        let res2 = StateMachine::validate_transition(
            &ComplaintStatus::Submitted,
            &ComplaintStatus::Rejected,
            &UserRole::AgencyAdmin,
        );
        assert!(res2.is_ok(), "Admin Instansi harus diizinkan langsung menolak aduan yang tidak valid pada triage");

        // Rejected -> Closed (Pengarsipan formal oleh Agency Admin)
        let res3 = StateMachine::validate_transition(
            &ComplaintStatus::Rejected,
            &ComplaintStatus::Closed,
            &UserRole::AgencyAdmin,
        );
        assert!(res3.is_ok(), "Admin Instansi harus diizinkan mengarsipkan aduan yang telah ditolak");

        // Citizen mencoba mengarsipkan aduan yang ditolak (Ditolak)
        let res4 = StateMachine::validate_transition(
            &ComplaintStatus::Rejected,
            &ComplaintStatus::Closed,
            &UserRole::Citizen,
        );
        assert!(res4.is_err(), "Warga dilarang menutup/mengarsipkan aduan yang ditolak secara sepihak");
    }

    #[test]
    fn test_valid_assignment_and_officer_workflow() {
        // Verified -> Assigned (Diperbolehkan untuk AgencyAdmin)
        let res1 = StateMachine::validate_transition(
            &ComplaintStatus::Verified,
            &ComplaintStatus::Assigned,
            &UserRole::AgencyAdmin,
        );
        assert!(res1.is_ok(), "Admin Instansi harus diizinkan menugaskan petugas lapangan");

        // Assigned -> InProgress (Diperbolehkan untuk Officer)
        let res2 = StateMachine::validate_transition(
            &ComplaintStatus::Assigned,
            &ComplaintStatus::InProgress,
            &UserRole::Officer,
        );
        assert!(res2.is_ok(), "Petugas lapangan harus diizinkan memulai pengerjaan tugas");

        // InProgress -> Resolved (Diperbolehkan untuk Officer)
        let res3 = StateMachine::validate_transition(
            &ComplaintStatus::InProgress,
            &ComplaintStatus::Resolved,
            &UserRole::Officer,
        );
        assert!(res3.is_ok(), "Petugas lapangan harus diizinkan menandai pekerjaan selesai");
    }

    #[test]
    fn test_illegal_transition_rejection() {
        // Lompatan ilegal: Submitted -> Resolved (Ditolak)
        let res1 = StateMachine::validate_transition(
            &ComplaintStatus::Submitted,
            &ComplaintStatus::Resolved,
            &UserRole::Officer,
        );
        assert!(res1.is_err(), "Lompatan langsung dari Submitted ke Resolved harus ditolak!");

        // Warga mencoba memverifikasi aduan miliknya sendiri (Ditolak)
        let res2 = StateMachine::validate_transition(
            &ComplaintStatus::UnderReview,
            &ComplaintStatus::Verified,
            &UserRole::Citizen,
        );
        assert!(res2.is_err(), "Warga biasa dilarang memverifikasi aduan!");
    }

    #[test]
    fn test_super_admin_bypass() {
        // Super Admin memiliki hak bypass untuk perbaikan administratif
        let res = StateMachine::validate_transition(
            &ComplaintStatus::Submitted,
            &ComplaintStatus::Resolved,
            &UserRole::SuperAdmin,
        );
        assert!(res.is_ok(), "Super Admin harus diizinkan melakukan bypass administratif");
    }
}

