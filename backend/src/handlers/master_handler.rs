use crate::errors::AppError;
use crate::models::{AgencyDto, CategoryDto, RegionDto};
use crate::repositories::MasterRepo;
use axum::{extract::State, Json};
use sqlx::PgPool;

pub async fn list_regions(State(pool): State<PgPool>) -> Result<Json<Vec<RegionDto>>, AppError> {
    let list = MasterRepo::list_regions(&pool).await?;
    Ok(Json(list))
}

pub async fn list_agencies(State(pool): State<PgPool>) -> Result<Json<Vec<AgencyDto>>, AppError> {
    let list = MasterRepo::list_agencies(&pool).await?;
    Ok(Json(list))
}

pub async fn list_categories(State(pool): State<PgPool>) -> Result<Json<Vec<CategoryDto>>, AppError> {
    let list = MasterRepo::list_categories(&pool).await?;
    Ok(Json(list))
}

