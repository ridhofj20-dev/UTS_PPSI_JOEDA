# DOKUMENTASI LENGKAP SPESIFIKASI REST API
**LAMPUNG REPORT — Smart Public Complaint Management System**
*Proyek Pengembangan Sistem Informasi (UTS) | Universitas Teknokrat Indonesia*

---

## 1. Standar Respons API

Semua endpoint mengembalikan respons berformat JSON dengan struktur standar:

### Respons Berhasil (Success)
```json
{
  "success": true,
  "data": { ... },
  "message": "Deskripsi singkat hasil operasi"
}
```

### Respons Gagal (Error)
```json
{
  "success": false,
  "error": {
    "code": 400,
    "message": "Alasan penolakan / validasi gagal"
  }
}
```

### Format Autentikasi
Gunakan header standar HTTP pada endpoint yang terproteksi:
```http
Authorization: Bearer <JWT_ACCESS_TOKEN>
```

---

## 2. Rincian Endpoint API v1

### 2.1 Autentikasi & Akun (`/api/v1/auth`)

#### `POST /api/v1/auth/register`
Mendaftarkan akun warga masyarakat baru.
- **Akses**: Publik
- **Request Body**:
  ```json
  {
    "full_name": "Budi Santoso",
    "email": "warga.budi@gmail.com",
    "phone": "081271000004",
    "nik": "1871041208950001",
    "password": "PasswordRahasia123!"
  }
  ```
- **Validasi**:
  - NIK wajib persis 16 digit angka.
  - Password minimal 8 karakter (dihash dengan Argon2id).
  - Email dan NIK harus unik.
- **Response `200 OK`**:
  ```json
  {
    "token": "eyJhbGciOi...",
    "token_type": "Bearer",
    "user": {
      "id": "66666666-6666-6666-6666-666666666666",
      "role": "CITIZEN",
      "full_name": "Budi Santoso",
      "email": "warga.budi@gmail.com",
      "phone": "081271000004",
      "nik": "1871041208950001",
      "agency_id": null,
      "agency_name": null
    }
  }
  ```

#### `POST /api/v1/auth/login`
Masuk ke dalam sistem untuk seluruh 4 Role.
- **Akses**: Publik
- **Request Body**:
  ```json
  {
    "email": "admin.dishub@bandarlampung.go.id",
    "password": "Admin123!"
  }
  ```
- **Response `200 OK`**: Mengembalikan token JWT dan profil peran.

#### `GET /api/v1/auth/me`
Mendapatkan profil aktif pengguna berdasarkan token.
- **Akses**: Authenticated (`CITIZEN`, `OFFICER`, `AGENCY_ADMIN`, `SUPER_ADMIN`)

---

### 2.2 Pengaduan Masyarakat (`/api/v1/complaints`)

#### `POST /api/v1/complaints`
Membuat laporan pengaduan baru.
- **Akses**: Authenticated (`CITIZEN`, `SUPER_ADMIN`)
- **Request Body**:
  ```json
  {
    "category_id": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
    "region_id": "00000000-0000-0000-0000-000000001871",
    "title": "Lampu PJU Padam di Depan Kampus Teknokrat Jl. ZA Pagar Alam",
    "description": "Lampu jalan padam sepanjang 100 meter, sangat gelap pada malam hari.",
    "address_detail": "Depan gerbang utama Teknokrat",
    "latitude": -5.381786,
    "longitude": 105.257922,
    "visibility": "PUBLIC"
  }
  ```
- **Fitur Otomatis**:
  - Dihasilkan nomor tiket unik format: `TKT-YYYYMMDD-XXXXX`.
  - Disimpan histori status awal: `SUBMITTED`.

#### `GET /api/v1/complaints/mine`
Melihat daftar laporan pribadi yang dibuat oleh pengguna login.
- **Akses**: Authenticated (`CITIZEN`)

#### `GET /api/v1/complaints/:id`
Mendapatkan detail pengaduan beserta linimasa riwayat status.
- **Akses**: Authenticated (Pelapor, Petugas ditugaskan, Admin OPD berwenang, Super Admin)
- **Privasi**: Jika diakses oleh pihak non-pelapor/publik, nama pelapor disamarkan otomatis.

#### `POST /api/v1/complaints/:id/verify`
Memverifikasi pengaduan masuk.
- **Akses**: Authenticated (`AGENCY_ADMIN` sesuai dinas, `SUPER_ADMIN`)
- **Transisi**: `SUBMITTED` / `UNDER_REVIEW` $\rightarrow$ `VERIFIED`
- **Request Body**:
  ```json
  {
    "priority": "HIGH",
    "notes": "Laporan valid setelah dicocokkan dengan laporan warga lain"
  }
  ```

#### `POST /api/v1/complaints/:id/reject`
Menolak pengaduan tidak valid disertai alasan wajib.
- **Akses**: Authenticated (`AGENCY_ADMIN`, `SUPER_ADMIN`)
- **Transisi**: `SUBMITTED` / `UNDER_REVIEW` $\rightarrow$ `REJECTED`
- **Request Body**:
  ```json
  {
    "reason": "Bukan kewenangan Kota Bandar Lampung (Jalan Nasional / Provinsi)"
  }
  ```

#### `POST /api/v1/complaints/:id/assign`
Menugaskan petugas lapangan untuk mengeksekusi perbaikan.
- **Akses**: Authenticated (`AGENCY_ADMIN`, `SUPER_ADMIN`)
- **Transisi**: `VERIFIED` $\rightarrow$ `ASSIGNED`
- **Request Body**:
  ```json
  {
    "officer_id": "77777777-7777-7777-7777-777777777777",
    "notes": "Disposisi ke Satgas Regu 2 Kedaton"
  }
  ```

#### `POST /api/v1/complaints/:id/status`
Memperbarui progres lapangan oleh petugas.
- **Akses**: Authenticated (`OFFICER` yang ditugaskan, `AGENCY_ADMIN`)
- **Transisi**: `ASSIGNED` $\rightarrow$ `IN_PROGRESS` $\rightarrow$ `RESOLVED`
- **Request Body**:
  ```json
  {
    "to_status": "RESOLVED",
    "notes": "Penggantian bohlam LED 120W selesai, lampu menyala normal"
  }
  ```

---

### 2.3 Layanan Publik & Privasi (`/api/v1/public`)

#### `GET /api/v1/public/complaints`
Daftar pengaduan terverifikasi yang boleh dilihat masyarakat luas.
- **Akses**: Publik Bebas
- **Privasi**: Tidak mengembalikan NIK, nomor HP, email, atau nama lengkap pelapor.

#### `GET /api/v1/public/map`
Data titik spasial koordinat dan status aduan untuk render peta Leaflet / OpenStreetMap.
- **Akses**: Publik Bebas

---

### 2.4 Data Master & Tata Kelola (`/api/v1/master` & `/api/v1/admin`)

#### `GET /api/v1/master/regions`
Daftar hierarki Kota Bandar Lampung dan 20 Kecamatan.

#### `GET /api/v1/master/agencies`
Daftar seluruh Organisasi Perangkat Daerah (OPD).

#### `GET /api/v1/master/categories`
Daftar taksonomi kategori masalah terpetakan ke dinas.

#### `GET /api/v1/admin/statistics`
Statistik ringkasan KPI (Total pengaduan, verifikasi tertunda, dalam pengerjaan, selesai, rasio penanganan).

#### `GET /api/v1/admin/audit-logs`
Audit log aktivitas administratif khusus `SUPER_ADMIN`.

