-- ============================================================================
-- LAMPUNG REPORT — SMART PUBLIC COMPLAINT MANAGEMENT SYSTEM
-- Migration: 20261110000002_seed_initial_data.sql
-- Description: Master data seeding (Roles, 20 Districts, Agencies, Categories, Demo Users)
-- Target DB: PostgreSQL 14+
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. SEED ROLES
-- ----------------------------------------------------------------------------
INSERT INTO roles (id, name, description) VALUES
    ('11111111-1111-1111-1111-111111111111', 'SUPER_ADMIN', 'Pengelola Kota Bandar Lampung dan Administrator Sistem Penuh'),
    ('22222222-2222-2222-2222-222222222222', 'AGENCY_ADMIN', 'Koordinator dan Verifikator Pengaduan pada Instansi / OPD'),
    ('33333333-3333-3333-3333-333333333333', 'OFFICER', 'Petugas Satuan Tugas (Satgas) Reaksi Cepat Lapangan'),
    ('44444444-4444-4444-4444-444444444444', 'CITIZEN', 'Masyarakat Warga Kota Bandar Lampung Pelapor Aduan')
ON CONFLICT (name) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 2. SEED REGIONS (Kota Bandar Lampung & 20 Kecamatan)
-- ----------------------------------------------------------------------------
-- Wilayah Induk: Kota Bandar Lampung
INSERT INTO regions (id, parent_id, name, region_type, administrative_code) VALUES
    ('00000000-0000-0000-0000-000000001871', NULL, 'Kota Bandar Lampung', 'KOTA', '1871')
ON CONFLICT (administrative_code) DO NOTHING;

-- 20 Kecamatan se-Kota Bandar Lampung
INSERT INTO regions (id, parent_id, name, region_type, administrative_code) VALUES
    (uuid_generate_v4(), '00000000-0000-0000-0000-000000001871', 'Bumi Waras', 'KECAMATAN', '187101'),
    (uuid_generate_v4(), '00000000-0000-0000-0000-000000001871', 'Enggal', 'KECAMATAN', '187102'),
    (uuid_generate_v4(), '00000000-0000-0000-0000-000000001871', 'Kedamaian', 'KECAMATAN', '187103'),
    (uuid_generate_v4(), '00000000-0000-0000-0000-000000001871', 'Kedaton', 'KECAMATAN', '187104'),
    (uuid_generate_v4(), '00000000-0000-0000-0000-000000001871', 'Kemiling', 'KECAMATAN', '187105'),
    (uuid_generate_v4(), '00000000-0000-0000-0000-000000001871', 'Labuhan Ratu', 'KECAMATAN', '187106'),
    (uuid_generate_v4(), '00000000-0000-0000-0000-000000001871', 'Langkapura', 'KECAMATAN', '187107'),
    (uuid_generate_v4(), '00000000-0000-0000-0000-000000001871', 'Panjang', 'KECAMATAN', '187108'),
    (uuid_generate_v4(), '00000000-0000-0000-0000-000000001871', 'Rajabasa', 'KECAMATAN', '187109'),
    (uuid_generate_v4(), '00000000-0000-0000-0000-000000001871', 'Sukabumi', 'KECAMATAN', '187110'),
    (uuid_generate_v4(), '00000000-0000-0000-0000-000000001871', 'Sukarame', 'KECAMATAN', '187111'),
    (uuid_generate_v4(), '00000000-0000-0000-0000-000000001871', 'Tanjung Karang Barat', 'KECAMATAN', '187112'),
    (uuid_generate_v4(), '00000000-0000-0000-0000-000000001871', 'Tanjung Karang Pusat', 'KECAMATAN', '187113'),
    (uuid_generate_v4(), '00000000-0000-0000-0000-000000001871', 'Tanjung Karang Timur', 'KECAMATAN', '187114'),
    (uuid_generate_v4(), '00000000-0000-0000-0000-000000001871', 'Tanjung Senang', 'KECAMATAN', '187115'),
    (uuid_generate_v4(), '00000000-0000-0000-0000-000000001871', 'Teluk Betung Barat', 'KECAMATAN', '187116'),
    (uuid_generate_v4(), '00000000-0000-0000-0000-000000001871', 'Teluk Betung Selatan', 'KECAMATAN', '187117'),
    (uuid_generate_v4(), '00000000-0000-0000-0000-000000001871', 'Teluk Betung Timur', 'KECAMATAN', '187118'),
    (uuid_generate_v4(), '00000000-0000-0000-0000-000000001871', 'Teluk Betung Utara', 'KECAMATAN', '187119'),
    (uuid_generate_v4(), '00000000-0000-0000-0000-000000001871', 'Way Halim', 'KECAMATAN', '187120')
ON CONFLICT (administrative_code) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 3. SEED AGENCIES (OPD Pemerintah Kota Bandar Lampung)
-- ----------------------------------------------------------------------------
INSERT INTO agencies (id, name, code, contact_phone, contact_email, is_active) VALUES
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Dinas Perhubungan Kota Bandar Lampung', 'DISHUB', '0721-123456', 'dishub@bandarlampung.go.id', TRUE),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Dinas Pekerjaan Umum Kota Bandar Lampung', 'PU', '0721-234567', 'pu@bandarlampung.go.id', TRUE),
    ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Dinas Lingkungan Hidup Kota Bandar Lampung', 'DLH', '0721-345678', 'dlh@bandarlampung.go.id', TRUE),
    ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Satuan Polisi Pamong Praja Kota Bandar Lampung', 'POLPP', '0721-456789', 'satpolpp@bandarlampung.go.id', TRUE),
    ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Badan Penanggulangan Bencana Daerah Kota Bandar Lampung', 'BPBD', '0721-567890', 'bpbd@bandarlampung.go.id', TRUE)
ON CONFLICT (code) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 4. SEED CATEGORIES (Kategori Masalah Pengaduan)
-- ----------------------------------------------------------------------------
INSERT INTO categories (agency_id, name, slug, description, icon, is_active) VALUES
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Lampu Jalan & Traffic Light', 'lampu-jalan-traffic-light', 'Pengaduan PJU mati, lampu lalu lintas error, tiang roboh', 'lightbulb', TRUE),
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Rambu & Marka Jalan', 'rambu-marka-jalan', 'Rambu jalan hilang, marka jalan pudar, cermin tikungan rusak', 'traffic', TRUE),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Jalan Rusak & Berlubang', 'jalan-rusak-berlubang', 'Aspal jalan berlubang, jalan amblas, permukaan tidak rata', 'edit_road', TRUE),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Drainase & Gorong-gorong Banjir', 'drainase-banjir', 'Saluran air mampet, sedimentasi parit, tanggul jebol', 'water_damage', TRUE),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Jembatan & Trotoar Rusak', 'jembatan-trotoar-rusak', 'Fasilitas pedestrian rusak, guiding block tunanetra copot', 'alt_route', TRUE),
    ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Tumpukan Sampah Liar', 'tumpukan-sampah-liar', 'Sampah liar di bahu jalan, TPS overload, pembakaran sampah', 'delete', TRUE),
    ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Pohon Tumbang & Rawan Patah', 'pohon-tumbang-rawan', 'Dahan pohon menutupi kabel listrik, pohon tua condong', 'park', TRUE),
    ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Ketertiban Umum & PKL Liar', 'ketertiban-umum-pkl', 'PKL memakan badan jalan, gangguan trotoar, kebisingan liar', 'shield', TRUE),
    ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Tanggap Darurat Genangan Air & Bencana', 'darurat-genangan-air', 'Banjir lokal jalan protokol, longsor tebing pemukiman', 'warning', TRUE)
ON CONFLICT (slug) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 5. SEED INITIAL USERS (Password: Admin123! di-hash dengan Argon2id)
-- Hash: $argon2id$v=19$m=19456,t=2,p=1$7v1aL25G8mOqG3qgYf4B8w$9m4p+4W9J7r+oQ4Zq2oWz3r+h8tL6n0p4s+1x+8y0A
-- ----------------------------------------------------------------------------
INSERT INTO users (id, role_id, full_name, email, phone, nik, password_hash, is_active) VALUES
    -- Super Admin (Pemerintah Kota Bandar Lampung)
    (
        '99999999-9999-9999-9999-999999999999',
        '11111111-1111-1111-1111-111111111111',
        'Dr. H. Ahmad Fauzi, M.T.',
        'superadmin@bandarlampung.go.id',
        '081271000001',
        '1871000101800001',
        '$argon2id$v=19$m=19456,t=2,p=1$7v1aL25G8mOqG3qgYf4B8w$9m4p+4W9J7r+oQ4Zq2oWz3r+h8tL6n0p4s+1x+8y0A',
        TRUE
    ),
    -- Admin Instansi Dishub Bandar Lampung
    (
        '88888888-8888-8888-8888-888888888888',
        '22222222-2222-2222-2222-222222222222',
        'Ir. Hendra Kusuma, S.T.',
        'admin.dishub@bandarlampung.go.id',
        '081271000002',
        '1871041005850002',
        '$argon2id$v=19$m=19456,t=2,p=1$7v1aL25G8mOqG3qgYf4B8w$9m4p+4W9J7r+oQ4Zq2oWz3r+h8tL6n0p4s+1x+8y0A',
        TRUE
    ),
    -- Petugas Satgas Lapangan Dishub Bandar Lampung
    (
        '77777777-7777-7777-7777-777777777777',
        '33333333-3333-3333-3333-333333333333',
        'Hendra Setiawan',
        'petugas.dishub@bandarlampung.go.id',
        '081271000003',
        '1871042008920003',
        '$argon2id$v=19$m=19456,t=2,p=1$7v1aL25G8mOqG3qgYf4B8w$9m4p+4W9J7r+oQ4Zq2oWz3r+h8tL6n0p4s+1x+8y0A',
        TRUE
    ),
    -- Warga Masyarakat Pelapor
    (
        '66666666-6666-6666-6666-666666666666',
        '44444444-4444-4444-4444-444444444444',
        'Budi Santoso',
        'warga.budi@gmail.com',
        '081271000004',
        '1871041208950001',
        '$argon2id$v=19$m=19456,t=2,p=1$7v1aL25G8mOqG3qgYf4B8w$9m4p+4W9J7r+oQ4Zq2oWz3r+h8tL6n0p4s+1x+8y0A',
        TRUE
    )
ON CONFLICT (email) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 6. SEED AGENCY MEMBERSHIP
-- ----------------------------------------------------------------------------
INSERT INTO agency_members (agency_id, user_id, membership_role) VALUES
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '88888888-8888-8888-8888-888888888888', 'ADMIN'),
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '77777777-7777-7777-7777-777777777777', 'OFFICER')
ON CONFLICT (agency_id, user_id) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 7. SEED CONTOH PENGADUAN AWAL (PROTOTIPE DEMO DATA)
-- ----------------------------------------------------------------------------
INSERT INTO complaints (
    id, ticket_number, user_id, category_id, region_id,
    title, description, address_detail, latitude, longitude,
    status, priority, visibility
) VALUES
    (
        '55555555-5555-5555-5555-555555555555',
        'TKT-20261110-00001',
        '66666666-6666-6666-6666-666666666666',
        (SELECT id FROM categories WHERE slug = 'lampu-jalan-traffic-light' LIMIT 1),
        (SELECT id FROM regions WHERE administrative_code = '187104' LIMIT 1),
        'Lampu Penerangan Jalan Umum (PJU) Padam di Depan Kampus Teknokrat Jl. ZA Pagar Alam',
        'Lampu jalan padam sepanjang kurang lebih 100 meter di depan pintu gerbang utama Universitas Teknokrat Indonesia. Kondisi jalan sangat gelap pada malam hari dan rawan kecelakaan penyeberang jalan.',
        'Jl. ZA. Pagar Alam No.9-11, Kedaton, Kec. Kedaton, Kota Bandar Lampung',
        -5.381786,
        105.257922,
        'IN_PROGRESS',
        'HIGH',
        'PUBLIC'
    )
ON CONFLICT (ticket_number) DO NOTHING;

-- Riwayat Status untuk Tiket Aduan Awal
INSERT INTO complaint_status_history (complaint_id, from_status, to_status, changed_by, notes) VALUES
    ('55555555-5555-5555-5555-555555555555', NULL, 'SUBMITTED', '66666666-6666-6666-6666-666666666666', 'Laporan awal dibuat oleh warga pelapor'),
    ('55555555-5555-5555-5555-555555555555', 'SUBMITTED', 'UNDER_REVIEW', '88888888-8888-8888-8888-888888888888', 'Laporan masuk antrean pemeriksaan verifikator Dishub'),
    ('55555555-5555-5555-5555-555555555555', 'UNDER_REVIEW', 'VERIFIED', '88888888-8888-8888-8888-888888888888', 'Laporan diverifikasi valid, lokasi dan foto sesuai fakta'),
    ('55555555-5555-5555-5555-555555555555', 'VERIFIED', 'ASSIGNED', '88888888-8888-8888-8888-888888888888', 'Ditugaskan ke Satgas Regu 2 Dishub Kedaton'),
    ('55555555-5555-5555-5555-555555555555', 'ASSIGNED', 'IN_PROGRESS', '77777777-7777-7777-7777-777777777777', 'Regu lapangan meluncur ke lokasi Jl. ZA Pagar Alam untuk pergantian trafo dan lampu LED');

-- Penugasan Petugas Awal
INSERT INTO complaint_assignments (complaint_id, officer_id, assigned_by, notes, is_active) VALUES
    ('55555555-5555-5555-5555-555555555555', '77777777-7777-7777-7777-777777777777', '88888888-8888-8888-8888-888888888888', 'Periksa trafo tiang PJU no 14-16 depan Kampus Teknokrat', TRUE);

