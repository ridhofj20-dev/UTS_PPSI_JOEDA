use crate::errors::AppError;
use crate::models::{User, UserProfileDto};
use sqlx::PgPool;
use uuid::Uuid;

pub struct UserRepo;

impl UserRepo {
    pub async fn find_by_email(pool: &PgPool, email: &str) -> Result<Option<User>, AppError> {
        let user = sqlx::query_as::<_, User>(
            r#"
            SELECT id, role_id, region_id, full_name, email, phone, nik, password_hash, is_active, created_at, updated_at
            FROM users
            WHERE email = $1
            "#,
        )
        .bind(email)
        .fetch_optional(pool)
        .await
        .map_err(|e| AppError::DatabaseError(format!("Gagal mencari user berdasarkan email: {}", e)))?;

        Ok(user)
    }

    pub async fn find_by_nik(pool: &PgPool, nik: &str) -> Result<Option<User>, AppError> {
        let user = sqlx::query_as::<_, User>(
            r#"
            SELECT id, role_id, region_id, full_name, email, phone, nik, password_hash, is_active, created_at, updated_at
            FROM users
            WHERE nik = $1
            "#,
        )
        .bind(nik)
        .fetch_optional(pool)
        .await
        .map_err(|e| AppError::DatabaseError(format!("Gagal mencari user berdasarkan NIK: {}", e)))?;

        Ok(user)
    }

    pub async fn create_citizen(
        pool: &PgPool,
        full_name: &str,
        email: &str,
        phone: Option<&str>,
        nik: &str,
        password_hash: &str,
    ) -> Result<User, AppError> {
        // Dapatkan role_id untuk CITIZEN
        let role_id: (Uuid,) = sqlx::query_as(
            r#"SELECT id FROM roles WHERE name = 'CITIZEN' LIMIT 1"#,
        )
        .fetch_one(pool)
        .await
        .map_err(|e| AppError::DatabaseError(format!("Gagal memuat role CITIZEN: {}", e)))?;

        let user = sqlx::query_as::<_, User>(
            r#"
            INSERT INTO users (role_id, full_name, email, phone, nik, password_hash, is_active)
            VALUES ($1, $2, $3, $4, $5, $6, TRUE)
            RETURNING id, role_id, region_id, full_name, email, phone, nik, password_hash, is_active, created_at, updated_at
            "#,
        )
        .bind(role_id.0)
        .bind(full_name)
        .bind(email)
        .bind(phone)
        .bind(nik)
        .bind(password_hash)
        .fetch_one(pool)
        .await
        .map_err(|e| AppError::DatabaseError(format!("Gagal mendaftarkan warga: {}", e)))?;

        Ok(user)
    }

    pub async fn get_profile_by_id(pool: &PgPool, user_id: Uuid) -> Result<Option<UserProfileDto>, AppError> {
        let profile = sqlx::query_as::<_, (Uuid, String, String, String, Option<String>, Option<String>, Option<Uuid>, Option<String>)>(
            r#"
            SELECT 
                u.id,
                r.name AS role,
                u.full_name,
                u.email,
                u.phone,
                u.nik,
                am.agency_id,
                a.name AS agency_name
            FROM users u
            JOIN roles r ON u.role_id = r.id
            LEFT JOIN agency_members am ON u.id = am.user_id AND am.is_active = TRUE
            LEFT JOIN agencies a ON am.agency_id = a.id
            WHERE u.id = $1 AND u.is_active = TRUE
            "#,
        )
        .bind(user_id)
        .fetch_optional(pool)
        .await
        .map_err(|e| AppError::DatabaseError(format!("Gagal memuat profil pengguna: {}", e)))?;

        Ok(profile.map(|p| UserProfileDto {
            id: p.0,
            role: p.1,
            full_name: p.2,
            email: p.3,
            phone: p.4,
            nik: p.5,
            agency_id: p.6,
            agency_name: p.7,
        }))
    }
}

