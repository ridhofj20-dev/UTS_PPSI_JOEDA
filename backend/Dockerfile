# ==============================================================================
# LAMPUNG REPORT — BACKEND DOCKERFILE (RUST / AXUM)
# Multi-stage production build with security hardening & minimal footprint
# ==============================================================================

# Stage 1: Build binary
FROM rust:1.78-bookworm AS builder

WORKDIR /usr/src/lampung-report-backend

# Install build dependencies
RUN apt-get update && apt-get install -y pkg-config libssl-dev && rm -rf /var/lib/apt/lists/*

# Copy dependency manifests for cache optimization
COPY Cargo.toml Cargo.lock* ./

# Copy source code and migrations
COPY src ./src
COPY migrations ./migrations

# Build optimized release binary
ENV SQLX_OFFLINE=true
RUN cargo build --release --bin lampung_report_backend

# Stage 2: Minimal runtime image
FROM debian:bookworm-slim AS runner

WORKDIR /app

# Install runtime dependencies (OpenSSL, CA certificates) and security updates
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    libssl3 \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Create unprivileged system user for security
RUN groupadd -g 10001 appgroup && \
    useradd -u 10001 -g appgroup -s /sbin/nologin appuser

# Create upload directory and grant permissions
RUN mkdir -p /app/uploads && chown -R appuser:appgroup /app

# Copy binary from builder
COPY --from=builder /usr/src/lampung-report-backend/target/release/lampung_report_backend /app/lampung_report_backend

# Set ownership to unprivileged user
RUN chown appuser:appgroup /app/lampung_report_backend

USER appuser:appgroup

# Environment defaults
ENV SERVER_HOST=0.0.0.0 \
    SERVER_PORT=8080 \
    APP_ENV=production \
    UPLOAD_DIR=/app/uploads

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/health || exit 1

ENTRYPOINT ["/app/lampung_report_backend"]

