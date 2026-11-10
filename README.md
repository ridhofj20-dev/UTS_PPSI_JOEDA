# LAMPUNG REPORT
### Smart Public Complaint Management System (Sistem Pengaduan Masyarakat Cerdas)
**Proyek Pengembangan Sistem Informasi — Ujian Tengah Semester (UTS)**  
**Universitas Teknokrat Indonesia & Kota Bandar Lampung**

---

## 1. Identitas Proyek & Hak Cipta
- **Nama Sistem**: LAMPUNG REPORT
- **Tagline**: *"Lapor Mudah, Tindak Cepat, Bandar Lampung Lebih Baik."*
- **Pengembang**: Ridho Fatahilah Joeda (NPM: 23311111)
- **Dosen Pengampu**: Dr. Erliyan Redy Susanto, M.Kom
- **Hak Cipta Resmi**:
  > `Copyright©2026 by Ridho Fatahilah Joeda and Dr. Erliyan Redy Susanto, M.Kom`
- **Status Proyek**: Prototipe Riset Civic-Tech Independen — Lingkup Akademik UTS PPSI

---

## 2. Struktur Proyek

```
D:\UTS_PPSI_23311111\
├── assets/                                 # Aset Logo Master Asli
│   ├── logo-pemkot-bandar-lampung.jpg
│   └── logo-teknokrat.png
├── DESIGN/                                 # Desain Lengkap Ekspor Google Stitch
│   ├── smart_civic_operations/ (DESIGN.md)
│   └── [11 Halaman HTML & Mockup UI]
├── frontend/                               # Antarmuka Pengguna (Next.js 14)
│   ├── public/assets/                      # Logo resmi (terjaga integritas bit & aspek)
│   ├── src/
│   │   ├── app/                            # Next.js App Router (Public & 4 Roles)
│   │   │   ├── api/health/route.ts         # Endpoint Health Check Frontend
│   │   │   ├── layout.tsx                  # Root layout dengan font & footer wajib
│   │   │   └── page.tsx                    # Landing status & pratinjau sistem
│   │   ├── components/                     # UI components, layout, Leaflet maps
│   │   └── lib/                            # API client & utilities
│   ├── package.json
│   ├── tailwind.config.ts                  # Konfigurasi Token Desain Stitch
│   └── .env.example
├── backend/                                # REST API Server (Rust & Axum)
│   ├── migrations/                         # SQLx Database Migrations
│   ├── src/
│   │   ├── config/                         # Environment & App Config
│   │   ├── errors/                         # Structured App Error Response
│   │   ├── routes/                         # Modular Axum HTTP Routes
│   │   │   └── health.rs                   # Endpoint Health Check Backend
│   │   └── main.rs                         # Axum entry point & graceful shutdown
│   ├── Cargo.toml
│   └── .env.example
├── PRD_Lampung_Report.md                   # Dokumen Kebutuhan Produk (PRD 1.0)
├── SKILL_Lampung_Report.md                 # Standar Operasional Teknis Pengembangan
└── README.md                               # Petunjuk Instalasi & Menjalankan Sistem
```

---

## 3. Prasyarat Instalasi (Prerequisites)

Untuk menjalankan sistem secara penuh pada lingkungan lokal:
1. **Node.js**: Versi 18 LTS atau 20 LTS (disertai `npm` atau `pnpm`)
2. **Rust & Cargo**: Versi stable terbaru ($1.75+$)
3. **PostgreSQL**: Versi 14, 15, atau 16
4. **Git**: Versi 2.x

---

## 4. Panduan Menjalankan Sistem

### A. Menjalankan Backend (Rust + Axum)
1. Buka terminal pada folder `backend`:
   ```bash
   cd backend
   ```
2. Salin environment konfigurasi:
   ```bash
   copy .env.example .env
   ```
3. Sesuaikan `DATABASE_URL` di dalam berkas `.env` dengan kredensial PostgreSQL lokal Anda:
   ```env
   DATABASE_URL=postgres://postgres:password@localhost:5432/lampung_report
   ```
4. Jalankan server Rust:
   ```bash
   cargo run
   ```
   *Server akan mendengarkan pada: `http://localhost:8080`*
5. Verifikasi Health Check Backend:
   - Akses: `http://localhost:8080/health` atau `http://localhost:8080/api/v1/health`
   - Respon JSON:
     ```json
     {
       "status": "ok",
       "service": "lampung-report-backend",
       "version": "1.0.0",
       "timestamp": "2026-11-10T11:10:00Z",
       "database": "connected",
       "message": "Lampung Report Smart Public Complaint System API is online"
     }
     ```

### B. Menjalankan Frontend (Next.js + TypeScript + Tailwind)
1. Buka terminal pada folder `frontend`:
   ```bash
   cd frontend
   ```
2. Salin environment konfigurasi:
   ```bash
   copy .env.example .env.local
   ```
3. Pasang dependensi Node.js:
   ```bash
   npm install
   ```
4. Jalankan server pengembangan Next.js:
   ```bash
   npm run dev
   ```
   *Frontend akan berjalan pada: `http://localhost:3000`*
5. Verifikasi Health Check Frontend:
   - Akses: `http://localhost:3000/api/health`

---

## 5. Ringkasan Hak Akses (Role-Based Access Control)
1. **Masyarakat (Citizen)**: Mengajukan pengaduan, unggah foto bukti GPS, lacak progres tiket laporan, beri rating.
2. **Petugas Lapangan (Officer)**: Menerima disposisi penanganan, perbarui progres lapangan, unggah foto hasil pekerjaan.
3. **Admin Instansi/OPD (Agency Admin)**: Verifikasi aduan dinas, penolakan berargumen, disposisi regu petugas, monitoring SLA.
4. **Super Admin**: Tata kelola platform global, 20 kecamatan Bandar Lampung, master dinas OPD, kategori, dan audit trail log.

