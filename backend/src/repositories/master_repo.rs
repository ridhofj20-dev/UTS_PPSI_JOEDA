use crate::errors::AppError;
use crate::models::{AgencyDto, CategoryDto, RegionDto};
use sqlx::PgPool;
use uuid::Uuid;

pub struct MasterRepo;

impl MasterRepo {
    pub async fn list_regions(pool: &PgPool) -> Result<Vec<RegionDto>, AppError> {
        let regions = sqlx::query_as::<_, RegionDto>(
            r#"
            SELECT id, parent_id, name, region_type, administrative_code
            FROM regions
            ORDER BY administrative_code ASC
            "#,
        )
        .fetch_all(pool)
        .await
        .map_err(|e| AppError::DatabaseError(format!("Gagal memuat daftar wilayah: {}", e)))?;

        Ok(regions)
    }

    pub async fn list_agencies(pool: &PgPool) -> Result<Vec<AgencyDto>, AppError> {
        let agencies = sqlx::query_as::<_, AgencyDto>(
            r#"
            SELECT id, name, code, contact_phone, contact_email, is_active
            FROM agencies
            WHERE is_active = TRUE
            ORDER BY name ASC
            "#,
        )
        .fetch_all(pool)
        .await
        .map_err(|e| AppError::DatabaseError(format!("Gagal memuat daftar instansi: {}", e)))?;

        Ok(agencies)
    }

    pub async fn list_categories(pool: &PgPool) -> Result<Vec<CategoryDto>, AppError> {
        let rows = sqlx::query_as::<_, (Uuid, Uuid, String, String, String, Option<String>, Option<String>, bool)>(
            r#"
            SELECT c.id, c.agency_id, a.name AS agency_name, c.name, c.slug, c.description, c.icon, c.is_active
            FROM categories c
            JOIN agencies a ON c.agency_id = a.id
            WHERE c.is_active = TRUE
            ORDER BY c.name ASC
            "#,
        )
        .fetch_all(pool)
        .await
        .map_err(|e| AppError::DatabaseError(format!("Gagal memuat daftar kategori: {}", e)))?;

        let list = rows
            .into_iter()
            .map(|r| CategoryDto {
                id: r.0,
                agency_id: r.1,
                agency_name: Some(r.2),
                name: r.3,
                slug: r.4,
                description: r.5,
                icon: r.6,
                is_active: r.7,
            })
            .collect();

        Ok(list)
    }

    pub async fn record_audit_log(
        pool: &PgPool,
        actor_id: Option<Uuid>,
        action: &str,
        entity_type: &str,
        entity_id: Option<&str>,
        metadata: serde_json::Value,
    ) -> Result<(), AppError> {
        sqlx::query(
            r#"
            INSERT INTO audit_logs (actor_id, action, entity_type, entity_id, metadata)
            VALUES ($1, $2, $3, $4, $5)
            "#,
        )
        .bind(actor_id)
        .bind(action)
        .bind(entity_type)
        .bind(entity_id)
        .bind(metadata)
        .execute(pool)
        .await
        .map_err(|e| AppError::DatabaseError(format!("Gagal mencatat audit log: {}", e)))?;

        Ok(())
    }
}

