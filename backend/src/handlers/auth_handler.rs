use crate::config::AppConfig;
use crate::errors::AppError;
use crate::middleware::AuthUser;
use crate::models::{AuthResponse, LoginDto, RegisterDto, UserProfileDto};
use crate::repositories::UserRepo;
use crate::services::AuthService;
use axum::{extract::State, Json};
use serde_json::json;
use sqlx::PgPool;

pub async fn register(
    State(pool): State<PgPool>,
    Json(dto): Json<RegisterDto>,
) -> Result<Json<AuthResponse>, AppError> {
    // 1. Validasi Panjang NIK (Wajib 16 Digit)
    let nik = dto.nik.trim();
    if nik.len() != 16 || !nik.chars().all(|c| c.is_ascii_digit()) {
        return Err(AppError::BadRequest(
            "NIK harus berjumlah 16 digit angka sesuai KTP".to_string(),
        ));
    }

    // 2. Validasi Password Minimal 8 Karakter
    if dto.password.len() < 8 {
        return Err(AppError::BadRequest(
            "Kata sandi minimal harus 8 karakter".to_string(),
        ));
    }

    // 3. Periksa Keunikan Email & NIK
    if UserRepo::find_by_email(&pool, &dto.email).await?.is_some() {
        return Err(AppError::BadRequest("Alamat email sudah terdaftar".to_string()));
    }
    if UserRepo::find_by_nik(&pool, nik).await?.is_some() {
        return Err(AppError::BadRequest("NIK sudah terdaftar dalam sistem".to_string()));
    }

    // 4. Hash Password dengan Argon2id
    let password_hash = AuthService::hash_password(&dto.password)?;

    // 5. Simpan Warga ke Database
    let user = UserRepo::create_citizen(
        &pool,
        &dto.full_name,
        &dto.email,
        dto.phone.as_deref(),
        nik,
        &password_hash,
    )
    .await?;

    // 6. Generate JWT Token
    let config = AppConfig::from_env()
        .map_err(|e| AppError::InternalServerError(format!("Config error: {}", e)))?;

    let token = AuthService::generate_token(
        user.id,
        "CITIZEN",
        &user.email,
        &user.full_name,
        None,
        &config.jwt_secret,
        config.jwt_expiration_hours,
    )?;

    let profile = UserProfileDto {
        id: user.id,
        role: "CITIZEN".to_string(),
        full_name: user.full_name,
        email: user.email,
        phone: user.phone,
        nik: user.nik,
        agency_id: None,
        agency_name: None,
    };

    Ok(Json(AuthResponse {
        token,
        token_type: "Bearer".to_string(),
        user: profile,
    }))
}

pub async fn login(
    State(pool): State<PgPool>,
    Json(dto): Json<LoginDto>,
) -> Result<Json<AuthResponse>, AppError> {
    // 1. Cari Pengguna Berdasarkan Email
    let user = UserRepo::find_by_email(&pool, &dto.email)
        .await?
        .ok_or_else(|| AppError::AuthError("Email atau kata sandi tidak valid".to_string()))?;

    // 2. Verifikasi Password dengan Argon2id
    let is_valid = AuthService::verify_password(&dto.password, &user.password_hash)?;
    if !is_valid {
        return Err(AppError::AuthError("Email atau kata sandi tidak valid".to_string()));
    }

    if !user.is_active {
        return Err(AppError::Forbidden("Akun Anda telah dinonaktifkan".to_string()));
    }

    // 3. Muat Profil Lengkap Pengguna Beserta Role & Instansi
    let profile = UserRepo::get_profile_by_id(&pool, user.id)
        .await?
        .ok_or_else(|| AppError::InternalServerError("Gagal memuat profil pengguna".to_string()))?;

    // 4. Generate JWT Token
    let config = AppConfig::from_env()
        .map_err(|e| AppError::InternalServerError(format!("Config error: {}", e)))?;

    let token = AuthService::generate_token(
        profile.id,
        &profile.role,
        &profile.email,
        &profile.full_name,
        profile.agency_id,
        &config.jwt_secret,
        config.jwt_expiration_hours,
    )?;

    Ok(Json(AuthResponse {
        token,
        token_type: "Bearer".to_string(),
        user: profile,
    }))
}

pub async fn get_me(
    State(pool): State<PgPool>,
    auth: AuthUser,
) -> Result<Json<UserProfileDto>, AppError> {
    let profile = UserRepo::get_profile_by_id(&pool, auth.0.sub)
        .await?
        .ok_or_else(|| AppError::NotFound("Pengguna tidak ditemukan".to_string()))?;

    Ok(Json(profile))
}

