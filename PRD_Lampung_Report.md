PRODUCT REQUIREMENT DOCUMENT

LAMPUNG REPORT

Smart Public Complaint Management System

Proyek Pengembangan Sistem Informasi – Ujian Tengah Semester

Kota Bandar Lampung, Provinsi Lampung 2026

| Identitas Mahasiswa | Keterangan |
| --- | --- |
| Nama | Ridho Fatahilah Joeda |
| NPM | 23311111 |
| Kelas | SI 23 Dx |
| Universitas | Universitas Teknokrat Indonesia |
| Dosen | Dr. Erliyan Redy Susanto, M.Kom |

# Kontrol Dokumen

| Atribut | Nilai |
| --- | --- |
| Nama Produk | Lampung Report |
| Jenis Dokumen | Product Requirement Document (PRD) |
| Versi | 1.0 |
| Status | Draft untuk validasi kebutuhan dan persetujuan |
| Tanggal | 10 November 2026 |
| Pemilik Produk | [Nama Mahasiswa] |
| Wilayah Implementasi Awal | Kota Bandar Lampung |
| Teknologi Backend & Database | Rust dan PostgreSQL |

## Riwayat Perubahan

| Versi | Tanggal | Perubahan |
| --- | --- | --- |
| 1.0 | 10-11-2026 | Penyusunan PRD berdasarkan brainstorming; penetapan Lampung Report, wilayah pilot Bandar Lampung, transparansi publik, dan validasi arsitektur Rust–PostgreSQL. |

# 1. Ringkasan Eksekutif

Lampung Report adalah aplikasi web pengaduan masyarakat untuk membantu warga menyampaikan laporan mengenai fasilitas umum, infrastruktur, kebersihan, dan lingkungan di Kota Bandar Lampung. Pelapor mengirim deskripsi, kategori, foto bukti, serta lokasi kejadian. Admin instansi memeriksa dan menugaskan laporan, sedangkan petugas memperbarui progres hingga laporan selesai.

Laporan yang telah diverifikasi dapat ditampilkan pada kanal publik. Identitas pribadi pelapor tidak ditampilkan. Sistem dibangun dengan backend Rust dan database PostgreSQL, serta dirancang agar cakupan wilayah dapat diperluas ke seluruh Provinsi Lampung.

## 1.1 Visi

Menyediakan sarana pengaduan publik yang mudah diakses, terstruktur, dapat dipantau, dan mendukung evaluasi pelayanan publik.

## 1.2 Prinsip Produk

Mudah digunakan oleh masyarakat melalui desktop maupun ponsel.

Transparan terhadap progres penanganan, tetapi menjaga kerahasiaan identitas pelapor.

Setiap laporan memiliki tiket, status, penanggung jawab, dan jejak aktivitas.

Hak akses mengikuti peran dan kewenangan instansi.

Wilayah pilot Bandar Lampung dapat diperluas melalui data wilayah bertingkat.

# 2. Latar Belakang dan Rumusan Masalah

Kebutuhan awal yang mendasari produk ini adalah tersedianya kanal pelaporan yang terstruktur, dilengkapi bukti dan lokasi, serta memungkinkan masyarakat memantau tindak lanjut. Kebutuhan tersebut merupakan hipotesis produk hasil brainstorming dan belum dianggap sebagai temuan survei resmi. Validasi lapangan perlu dilakukan melalui wawancara atau observasi dengan calon pengguna.

Masyarakat memerlukan cara yang praktis untuk melaporkan masalah fasilitas publik.

Laporan perlu memuat kategori, deskripsi, foto, dan lokasi agar dapat diperiksa.

Pelapor membutuhkan informasi perkembangan laporan.

Instansi membutuhkan sarana verifikasi, penugasan, dan pemantauan.

Pengelola membutuhkan data terstruktur untuk melihat pola pengaduan berdasarkan kategori, status, dan wilayah.

# 3. Tujuan, Sasaran, dan Indikator Keberhasilan

| Tujuan | Indikator awal | Target rancangan |
| --- | --- | --- |
| Pengiriman pengaduan andal | Rasio laporan berhasil tersimpan terhadap percobaan valid | ≥95% dalam skenario uji |
| Jejak status lengkap | Perubahan status tercatat dengan aktor dan waktu | 100% transisi status |
| Privasi publik | Respons API publik tidak memuat identitas pelapor | 100% skenario uji privasi |
| Pembatasan akses | Akses sesuai role dan cakupan instansi | 100% skenario uji otorisasi |
| Kemudahan penggunaan | Tampilan responsif dan alur pengaduan dapat diselesaikan | Lulus uji usability yang ditetapkan |
| Performa | Waktu respons endpoint normal pada lingkungan uji | Target p95 ≤500 ms, tidak termasuk upload |

Target di atas adalah sasaran yang akan diuji, bukan hasil pengukuran yang sudah dicapai.

# 4. Pengguna dan Hak Akses

| Peran | Kebutuhan dan kewenangan utama |
| --- | --- |
| Citizen / Masyarakat | Registrasi, login, membuat laporan, mengunggah bukti, melihat laporan milik sendiri, mengikuti status, dan memberi umpan balik. |
| Officer / Petugas | Melihat laporan yang ditugaskan, menambahkan catatan, memperbarui progres, dan mengunggah bukti tindak lanjut. |
| Agency Admin | Memeriksa laporan dalam lingkup instansi, memverifikasi/menolak, menugaskan petugas, dan memantau progres instansi. |
| Super Admin | Mengelola akun, role, instansi, kategori, wilayah, konfigurasi, serta memantau keseluruhan sistem dan audit log. |

Prinsip otorisasi: akses harus diperiksa di backend pada setiap endpoint. Agency Admin dibatasi pada instansi yang menjadi kewenangannya. Citizen hanya dapat mengakses data privat miliknya.

# 5. Ruang Lingkup Produk

## 5.1 In Scope – MVP

Registrasi, login, logout, dan manajemen sesi.

Role-Based Access Control (RBAC).

Pembuatan pengaduan dengan judul, deskripsi, kategori, wilayah, koordinat, dan lampiran.

Nomor tiket unik dan daftar laporan milik pelapor.

Verifikasi, penolakan dengan alasan, dan penugasan petugas.

Pembaruan status, catatan progres, bukti penyelesaian, dan histori status.

Notifikasi dalam aplikasi.

Dashboard masyarakat, petugas, admin instansi, dan super admin.

Halaman publik untuk laporan terverifikasi dengan penyamaran identitas.

Peta dan filter laporan publik.

Pengelolaan kategori, instansi, wilayah, dan audit log.

## 5.2 Di Luar MVP / Pengembangan Lanjutan

Deteksi laporan duplikat berbasis kemiripan.

Klasifikasi prioritas berbantuan AI.

Integrasi WhatsApp atau kanal notifikasi eksternal.

Integrasi sensor IoT dan aplikasi mobile native.

Integrasi resmi dengan sistem pemerintahan lain setelah izin dan dokumentasi tersedia.

## 5.3 Batasan

Aplikasi ini merupakan proyek akademik independen. PRD tidak menyatakan adanya kerja sama, integrasi, atau dukungan resmi Pemerintah Kota Bandar Lampung. Data instansi dan petugas dapat menggunakan data simulasi selama pengembangan. Aplikasi bukan pengganti kanal darurat resmi.

# 6. Kebutuhan Fungsional

| ID | Kebutuhan |
| --- | --- |
| FR-001 | Sistem menyediakan registrasi akun masyarakat dengan validasi data. |
| FR-002 | Sistem menyediakan login dan logout yang aman. |
| FR-003 | Sistem mengidentifikasi pengguna aktif dan perannya. |
| FR-004 | Sistem menerapkan RBAC pada seluruh endpoint yang dilindungi. |
| FR-005 | Masyarakat dapat membuat pengaduan dengan judul, deskripsi, kategori, wilayah, dan lokasi. |
| FR-006 | Sistem menghasilkan nomor tiket unik untuk setiap pengaduan. |
| FR-007 | Masyarakat dapat mengunggah foto bukti dengan pembatasan tipe dan ukuran. |
| FR-008 | Masyarakat dapat melihat daftar dan detail pengaduan miliknya. |
| FR-009 | Admin instansi dapat meninjau laporan yang berada dalam kewenangannya. |
| FR-010 | Admin dapat memverifikasi laporan atau menolaknya dengan alasan. |
| FR-011 | Admin dapat menetapkan instansi dan menugaskan petugas. |
| FR-012 | Petugas dapat menambahkan catatan perkembangan dan bukti tindak lanjut. |
| FR-013 | Perubahan status harus melalui validasi transisi di backend. |
| FR-014 | Setiap perubahan status dicatat beserta aktor, waktu, status sebelumnya, dan status baru. |
| FR-015 | Pelapor menerima notifikasi dalam aplikasi atas perubahan penting. |
| FR-016 | Publik dapat melihat laporan yang sudah diverifikasi dan diizinkan untuk publikasi. |
| FR-017 | API publik tidak mengembalikan nama, email, telepon, atau identitas pelapor. |
| FR-018 | Peta publik hanya menampilkan lokasi dan informasi yang telah disetujui untuk publik. |
| FR-019 | Dashboard menampilkan statistik sesuai cakupan akses pengguna. |
| FR-020 | Super Admin dapat mengelola pengguna, role, instansi, kategori, dan wilayah. |
| FR-021 | Sistem mencatat aktivitas administratif dan keamanan yang penting ke audit log. |
| FR-022 | Sistem menyediakan pencarian, filter, pengurutan, dan pagination daftar laporan. |

# 7. Aturan Bisnis dan Alur Status

Pengguna harus terautentikasi untuk membuat pengaduan.

Setiap laporan memiliki tiket unik, kategori, wilayah, dan titik lokasi yang valid.

Laporan baru tidak langsung tampil di kanal publik.

Penolakan harus disertai alasan yang dapat dilihat pelapor.

Hanya role yang berwenang yang dapat melakukan verifikasi, penugasan, dan perubahan progres.

Perubahan status harus menghasilkan rekaman histori yang tidak dapat diubah melalui endpoint biasa.

Identitas pelapor selalu disembunyikan dari respons publik.

Penutupan laporan dilakukan oleh pihak berwenang setelah status penyelesaian sesuai aturan.

| Status | Makna | Transisi umum |
| --- | --- | --- |
| Submitted | Laporan diterima sistem | → Under Review |
| Under Review | Sedang diperiksa admin | → Verified / Rejected |
| Verified | Laporan telah diverifikasi | → Assigned |
| Assigned | Petugas telah ditugaskan | → In Progress |
| In Progress | Penanganan berjalan | → Resolved |
| Resolved | Penanganan dinyatakan selesai | → Closed |
| Rejected | Laporan ditolak dengan alasan | Akhir proses atau ajukan ulang sesuai kebijakan |
| Closed | Laporan ditutup | Status akhir |

Transisi status perlu didefinisikan sebagai state machine di backend; frontend tidak boleh menentukan status secara bebas.

# 8. Kebutuhan Non-Fungsional

| Area | Persyaratan |
| --- | --- |
| Performance | Pagination, indeks database, connection pooling, query terukur, dan optimasi file gambar. |
| Security | Hash password Argon2id, HTTPS, validasi input, query parameterized, RBAC, rate limiting, dan pengelolaan secret. |
| Privacy | Minimisasi data pribadi, penyamaran identitas di API publik, dan pembatasan akses lampiran. |
| Reliability | Backup database, transaksi untuk operasi penting, health check, dan penanganan kegagalan yang aman. |
| Usability | Desain responsif, navigasi konsisten, pesan validasi jelas, dan status mudah dipahami. |
| Maintainability | Kode modular, migration database, dokumentasi API, automated tests, dan pemisahan konfigurasi. |
| Scalability | Model wilayah bertingkat dan pemisahan data per instansi/wilayah tanpa mengunci sistem pada satu kota. |

# 9. Arsitektur dan Validasi Teknologi

## 9.1 Stack yang Direkomendasikan

| Lapisan | Teknologi | Alasan pemilihan |
| --- | --- | --- |
| Frontend | Next.js + TypeScript | Antarmuka web responsif dan pemisahan frontend dari API. |
| Backend HTTP | Rust + Axum | Framework routing dan request handling yang modular. |
| Async runtime | Tokio | Menjalankan operasi asynchronous pada layanan backend. |
| Database access | SQLx | Akses PostgreSQL asynchronous, connection pool, migration, dan query macros. |
| Database | PostgreSQL | Penyimpanan relasional, constraint, transaksi, indeks, dan konsistensi data. |
| Password | Argon2id | Hash password yang dirancang untuk memperlambat serangan tebak password. |
| Peta | Leaflet + OpenStreetMap | Menampilkan titik lokasi laporan; penggunaan tile harus mengikuti kebijakan penyedia. |
| File storage | Object storage S3-compatible | Menyimpan foto secara terpisah dari database; database menyimpan metadata. |
| Deployment | Vercel (frontend), container host (Rust), managed PostgreSQL | Vercel dipakai untuk frontend; backend Rust dan PostgreSQL membutuhkan layanan runtime masing-masing. |

## 9.2 Arsitektur Logis

Browser mengakses antarmuka Next.js.

Frontend mengirim request HTTPS ke REST API Rust/Axum.

Middleware memeriksa autentikasi, role, dan cakupan instansi.

Service layer menerapkan aturan bisnis dan validasi transisi status.

Repository/data layer menggunakan SQLx dan connection pool untuk mengakses PostgreSQL.

Lampiran disimpan pada object storage; metadata dan relasi disimpan di PostgreSQL.

API mengembalikan JSON dengan DTO yang berbeda untuk data privat dan data publik.

## 9.3 Hasil Validasi Kesesuaian Rust dan PostgreSQL

Kesimpulan validasi desain: Rust + Axum + Tokio + SQLx + PostgreSQL sesuai untuk membangun REST API transaksional Lampung Report. SQLx menyediakan driver PostgreSQL, pool koneksi, dukungan Tokio, migration, dan query macros. Axum menyediakan routing, extractors, dan integrasi middleware melalui ekosistem Tower. Kesesuaian ini adalah validasi arsitektur berbasis dokumentasi, bukan bukti performa atau keamanan aplikasi yang telah diimplementasikan.

| Kebutuhan Lampung Report | Dukungan teknologi | Catatan implementasi |
| --- | --- | --- |
| API pengaduan dan dashboard | Axum + Tokio | Handler async, router modular, middleware, tracing. |
| Transaksi laporan dan histori | PostgreSQL + SQLx | Simpan perubahan laporan dan status history dalam satu transaksi. |
| Validasi query dan tipe | SQLx | Gunakan query! bila lingkungan build menyediakan DATABASE_URL atau offline metadata. |
| Relasi dan integritas | PostgreSQL | Foreign key, unique constraint, check constraint, dan indeks. |
| Koordinat lokasi | PostgreSQL numeric/DOUBLE PRECISION; PostGIS opsional | Untuk MVP simpan latitude/longitude dengan validasi rentang; PostGIS dapat ditambahkan bila analisis spasial kompleks dibutuhkan. |
| Keamanan akses | Middleware Axum + service authorization | Jangan hanya menyembunyikan tombol pada frontend; periksa akses di backend. |
| Skala wilayah | PostgreSQL relational hierarchy | Gunakan parent_id dan kode administratif; jangan hard-code satu kota. |

## 9.4 Catatan Teknis dan Risiko

Rust tidak otomatis membuat aplikasi aman; validasi input, otorisasi, dependency review, secret management, dan pengujian tetap wajib.

SQLx bukan pengganti desain skema. Constraint, indeks, migration, transaksi, dan strategi backup harus dirancang.

Gunakan connection pool dengan batas koneksi yang disesuaikan kapasitas database.

Gunakan query parameterized; hindari membangun SQL dari input pengguna.

Gunakan transaksi saat membuat laporan beserta nomor tiket, lampiran metadata, dan histori awal.

Gunakan idempotency atau proteksi pengiriman ganda untuk mencegah laporan duplikat akibat retry jaringan.

Vercel adalah target frontend Next.js; jangan mengasumsikan server Rust berjalan sebagai backend permanen di Vercel. Deploy Rust ke layanan container/server terpisah.

# 10. Rancangan Database PostgreSQL

Skema berikut adalah rancangan konseptual awal. Tipe data, constraint, indeks, dan migration final akan diperiksa saat implementasi.

| Tabel | Kolom utama | Aturan penting |
| --- | --- | --- |
| roles | id UUID, name UNIQUE, description | Nama role unik. |
| users | id UUID, role_id, region_id, full_name, email, phone, password_hash, is_active, timestamps | Email unik; password_hash tidak pernah dikirim ke API. |
| regions | id UUID, parent_id, name, region_type, administrative_code | Hierarki provinsi/kota/kecamatan/kelurahan; kode administratif unik sesuai sumber. |
| agencies | id UUID, name, region_id, is_active | Instansi terikat wilayah/lingkup kewenangan. |
| agency_members | id UUID, agency_id, user_id, membership_role | Relasi pengguna dengan instansi; batasi keanggotaan ganda. |
| categories | id UUID, agency_id, name, description, is_active | Kategori aktif dan dapat dipetakan ke instansi. |
| complaints | id UUID, ticket_number UNIQUE, user_id, category_id, region_id, title, description, latitude, longitude, status, priority, visibility, timestamps | Koordinat divalidasi; status dan visibility memakai enum/check constraint. |
| complaint_attachments | id UUID, complaint_id, object_key, mime_type, file_size, checksum, created_at | Simpan object key, bukan file biner di tabel utama. |
| complaint_assignments | id UUID, complaint_id, officer_id, assigned_by, assigned_at, ended_at | Riwayat penugasan dipertahankan. |
| complaint_status_history | id UUID, complaint_id, from_status, to_status, changed_by, notes, created_at | Append-only melalui hak akses aplikasi. |
| notifications | id UUID, user_id, complaint_id, title, message, read_at, created_at | Indeks pada user_id dan created_at. |
| audit_logs | id UUID, actor_id, action, entity_type, entity_id, metadata JSONB, created_at | Jangan simpan password, token, atau data sensitif berlebihan. |
| complaint_feedback | id UUID, complaint_id UNIQUE, user_id, rating, feedback, created_at | Satu penilaian akhir per laporan; validasi rating. |

## 10.1 Indeks dan Integritas yang Disarankan

Index complaints(status, created_at DESC) untuk antrean laporan.

Index complaints(region_id, category_id, status) untuk filter dashboard.

Index complaint_status_history(complaint_id, created_at) untuk timeline.

Index notifications(user_id, read_at, created_at) untuk notifikasi.

Unique constraint pada ticket_number dan email pengguna.

Foreign key dengan kebijakan ON DELETE yang konservatif; hindari menghapus laporan historis secara tidak sengaja.

Check constraint latitude antara -90 dan 90, longitude antara -180 dan 180, serta rating pada rentang yang ditentukan.

Gunakan UUID sebagai identifier publik internal dan nomor tiket terpisah yang mudah dibaca.

# 11. Spesifikasi API Awal

| Method | Endpoint | Tujuan / akses |
| --- | --- | --- |
| POST | /api/v1/auth/register | Registrasi masyarakat |
| POST | /api/v1/auth/login | Login |
| POST | /api/v1/auth/logout | Logout / invalidasi sesi |
| GET | /api/v1/auth/me | Profil pengguna aktif |
| POST | /api/v1/complaints | Membuat laporan (Citizen) |
| GET | /api/v1/complaints/mine | Laporan milik pelapor |
| GET | /api/v1/complaints | Daftar sesuai role dan cakupan |
| GET | /api/v1/complaints/{id} | Detail dengan pemeriksaan kepemilikan/role |
| POST | /api/v1/complaints/{id}/attachments | Upload lampiran |
| POST | /api/v1/complaints/{id}/verify | Verifikasi (Agency Admin) |
| POST | /api/v1/complaints/{id}/reject | Penolakan dengan alasan |
| POST | /api/v1/complaints/{id}/assign | Penugasan petugas |
| POST | /api/v1/complaints/{id}/status | Perubahan status oleh petugas berwenang |
| GET | /api/v1/complaints/{id}/history | Histori sesuai akses |
| GET | /api/v1/public/complaints | Daftar publik yang telah disaring |
| GET | /api/v1/public/complaints/{id} | Detail publik tanpa identitas pelapor |
| GET | /api/v1/public/map | Titik laporan yang boleh dipublikasikan |
| GET | /api/v1/admin/statistics | Statistik sesuai role/cakupan admin |
| GET | /api/v1/admin/audit-logs | Audit log khusus Super Admin berwenang |

Semua endpoint harus memakai DTO/response schema yang sesuai. Endpoint publik tidak boleh mengembalikan objek User atau field internal yang dapat mengungkap identitas pelapor.

# 12. Persyaratan UI/UX dan Identitas Visual

## 12.1 Halaman berdasarkan pengguna

| Area | Halaman utama |
| --- | --- |
| Publik | Landing page, daftar laporan terverifikasi, detail publik, peta, login, registrasi. |
| Citizen | Dashboard, buat laporan, laporan saya, detail dan timeline, notifikasi, profil. |
| Officer | Dashboard tugas, daftar penugasan, detail, update progres, upload bukti, riwayat. |
| Agency Admin | Dashboard instansi, antrean verifikasi, penugasan, pemantauan, statistik, petugas. |
| Super Admin | Dashboard keseluruhan, pengguna, role, instansi, kategori, wilayah, audit log. |

# 13. Privasi dan Keamanan

Hash password menggunakan Argon2id dengan parameter yang sesuai dan diuji.

Terapkan HTTPS dan konfigurasi CORS secara ketat.

Pilih mekanisme sesi atau token yang aman; bila memakai cookie, gunakan HttpOnly, Secure, dan SameSite sesuai kebutuhan.

Terapkan rate limiting pada login, registrasi, dan endpoint pengaduan.

Lakukan validasi input di backend dan gunakan query parameterized.

Validasi isi file berdasarkan signature/MIME, ukuran, ekstensi, dan lakukan pemindaian bila tersedia.

Gunakan object storage privat dan signed URL berumur pendek untuk lampiran privat.

Pisahkan DTO publik dari DTO privat; uji bahwa data identitas tidak bocor melalui API, log, peta, atau metadata file.

Batasi audit log agar tidak menyimpan password, token, atau isi dokumen sensitif.

Sediakan kebijakan retensi, backup, pemulihan, dan penghapusan data sesuai aturan yang berlaku.

# 14. Kriteria Penerimaan dan Rencana Pengujian

| ID | Skenario | Kriteria lulus |
| --- | --- | --- |
| AT-01 | Registrasi dan login | Data valid dapat membuat sesi; kredensial salah ditolak. |
| AT-02 | Membuat pengaduan | Tiket unik dibuat dan laporan tersimpan. |
| AT-03 | Upload lampiran | File yang diizinkan diterima; file tidak valid ditolak. |
| AT-04 | Lokasi | Koordinat di luar rentang ditolak. |
| AT-05 | Verifikasi dan penolakan | Hanya admin berwenang dapat melakukan aksi; alasan penolakan tercatat. |
| AT-06 | Penugasan | Petugas yang ditugaskan dapat melihat pekerjaan tersebut. |
| AT-07 | Perubahan status | Transisi ilegal ditolak dan transisi valid tercatat di history. |
| AT-08 | Privasi publik | API publik tidak mengembalikan identitas pelapor. |
| AT-09 | RBAC dan isolasi instansi | Role/instansi lain tidak dapat mengakses data tanpa izin. |
| AT-10 | Dashboard dan filter | Agregasi sesuai data dan cakupan akses. |
| AT-11 | Audit log | Aktivitas sensitif tercatat dengan aktor dan waktu. |
| AT-12 | Responsif | Alur utama dapat digunakan pada desktop dan ponsel. |

# 15. Deployment dan Operasional

| Komponen | Target | Catatan |
| --- | --- | --- |
| Frontend | Vercel | Next.js; environment variables disimpan di dashboard deployment. |
| Backend | Layanan container/server | Rust/Axum dijalankan sebagai proses layanan HTTP; sediakan health check dan graceful shutdown. |
| Database | Managed PostgreSQL | TLS, backup, connection limit, migration terkontrol. |
| File | Object storage | Bucket privat, policy akses, signed URL bila perlu. |
| Observability | Structured logs + metrics | Jangan mencatat secret atau data pribadi berlebihan. |

Deployment frontend di Vercel tidak otomatis men-deploy backend Rust maupun database PostgreSQL. Ketiga komponen harus dikonfigurasi dan diamankan secara terpisah.

# 16. Risiko dan Mitigasi

| Risiko | Mitigasi |
| --- | --- |
| Laporan palsu/spam | Rate limit, moderasi, verifikasi, dan mekanisme pelaporan penyalahgunaan. |
| Kebocoran identitas | DTO publik terpisah, RBAC, uji privasi, dan review log. |
| Salah penugasan | Pemetaan kategori–instansi dan validasi kewenangan. |
| Upload file berbahaya | Validasi file, batas ukuran, penyimpanan privat, dan pemindaian. |
| Database tidak tersedia | Backup, monitoring, retry terbatas, dan prosedur pemulihan. |
| Kapasitas proyek individu | Prioritaskan MVP; tunda fitur AI/IoT. |
| Penggunaan logo tanpa izin | Konfirmasi ketentuan penggunaan dan tampilkan konteks proyek akademik. |

# 17. Asumsi, Ketergantungan, dan Hal yang Perlu Divalidasi

Kebutuhan pengguna pada PRD ini berasal dari brainstorming dan harus diuji dengan calon masyarakat, petugas, atau administrator.

Data wilayah administratif Bandar Lampung harus diambil dari sumber resmi/terpercaya dan diverifikasi sebelum impor.

Daftar instansi, kewenangan, kategori, dan SLA belum ditetapkan oleh pihak berwenang; gunakan konfigurasi simulasi sampai tervalidasi.

Penggunaan logo Pemda dan logo universitas harus mengikuti izin/pedoman identitas yang berlaku.

Ketersediaan layanan object storage, hosting Rust, dan PostgreSQL merupakan ketergantungan deployment.

Kebijakan privasi, retensi, dan dasar pemrosesan data perlu disesuaikan dengan peraturan yang berlaku.

# 18. Referensi Teknis

SQLx documentation: https://docs.rs/sqlx/latest/sqlx/ — dukungan PostgreSQL, Tokio runtime, connection pool, TLS, dan migration/query macros.

SQLx repository README: https://github.com/launchbadge/sqlx — gambaran kemampuan SQLx dan dukungan database.

Axum documentation: https://docs.rs/axum/latest/axum/ — routing, request handling, extractors, dan integrasi ekosistem Tower.

Axum repository: https://github.com/tokio-rs/axum — deskripsi framework dan fitur utama.

Next.js deployment documentation: https://nextjs.org/docs/app/getting-started/deploying — opsi deployment Next.js termasuk Node.js server, Docker, static export, dan adapter.
