"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { PublicNavbar } from "@/components/layouts/PublicNavbar";
import { LeafletMap } from "@/components/maps/LeafletMap";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { PublicComplaint } from "@/types";
import { apiFetch } from "@/lib/api-client";

export default function PublicPortalPage() {
  const [complaints, setComplaints] = useState<PublicComplaint[]>([]);
  const [searchTicket, setSearchTicket] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("SEMUA");
  const [isLoading, setIsLoading] = useState(true);

  // Initial Demo Reports fallback if backend isn't yet queried
  const demoComplaints: PublicComplaint[] = [
    {
      ticket_number: "TKT-20261110-00001",
      title: "Lampu Penerangan Jalan Umum (PJU) Padam di Depan Kampus Teknokrat Jl. ZA Pagar Alam",
      description: "Lampu jalan padam sepanjang 100 meter, membahayakan penyeberang jalan dan rawan kecelakaan.",
      category_name: "Lampu Jalan & Traffic Light",
      agency_name: "Dinas Perhubungan Kota Bandar Lampung",
      region_name: "Kedaton",
      address_detail: "Depan gerbang utama Universitas Teknokrat Indonesia",
      latitude: -5.381786,
      longitude: 105.257922,
      status: "IN_PROGRESS",
      priority: "HIGH",
      created_at: "2026-11-10T08:30:00Z",
      updated_at: "2026-11-10T10:15:00Z",
    },
    {
      ticket_number: "TKT-20261109-00042",
      title: "Aspal Amblas dan Berlubang Dalam di Jl. Teuku Umar Dekat Pasar Koga",
      description: "Lubang sedalam 15cm tertutup genangan air, dua pengendara motor sempat terjatuh.",
      category_name: "Jalan Rusak & Berlubang",
      agency_name: "Dinas Pekerjaan Umum Kota Bandar Lampung",
      region_name: "Kedaton",
      address_detail: "50m sebelum lampu merah Pasar Koga",
      latitude: -5.395211,
      longitude: 105.263412,
      status: "VERIFIED",
      priority: "URGENT",
      created_at: "2026-11-09T14:20:00Z",
      updated_at: "2026-11-09T16:00:00Z",
    },
    {
      ticket_number: "TKT-20261108-00089",
      title: "Penumpukan Sampah Liar di Pinggir Jalan Ryacudu Jalur Dua Korpri",
      description: "Tumpukan sampah plastik memanjang 20 meter dan menimbulkan bau menyengat ke pemukiman.",
      category_name: "Tumpukan Sampah Liar",
      agency_name: "Dinas Lingkungan Hidup Kota Bandar Lampung",
      region_name: "Sukarame",
      address_detail: "Dekat perempatan flyover Korpri",
      latitude: -5.372101,
      longitude: 105.295431,
      status: "RESOLVED",
      priority: "MEDIUM",
      created_at: "2026-11-08T09:10:00Z",
      updated_at: "2026-11-09T11:45:00Z",
    },
  ];

  useEffect(() => {
    // Attempt fetch from real backend API
    apiFetch<PublicComplaint[]>("/public/complaints")
      .then((data) => {
        if (data && data.length > 0) {
          setComplaints(data);
        } else {
          setComplaints(demoComplaints);
        }
      })
      .catch(() => {
        // Fallback to demo data
        setComplaints(demoComplaints);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const filteredComplaints = complaints.filter((c) => {
    const matchesSearch =
      searchTicket.trim() === "" ||
      c.ticket_number.toLowerCase().includes(searchTicket.toLowerCase()) ||
      c.title.toLowerCase().includes(searchTicket.toLowerCase()) ||
      (c.region_name && c.region_name.toLowerCase().includes(searchTicket.toLowerCase()));

    const matchesCategory =
      selectedCategory === "SEMUA" ||
      c.category_name.toLowerCase().includes(selectedCategory.toLowerCase());

    return matchesSearch && matchesCategory;
  });

  const mapMarkers = complaints.map((c) => ({
    lat: c.latitude,
    lng: c.longitude,
    title: c.title,
    category: c.category_name,
    status: c.status,
  }));

  return (
    <div className="flex flex-col min-h-screen">
      <PublicNavbar />

      {/* Hero Section */}
      <section className="relative w-full bg-surface-container-low py-space-2xl px-margin overflow-hidden border-b border-outline-variant/20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-center relative z-10">
          {/* Left Narrative */}
          <div className="lg:col-span-7 flex flex-col gap-space-lg">
            <div className="inline-flex items-center gap-space-xs px-3 py-1 rounded-full bg-surface-container-highest text-primary font-label-sm text-xs w-fit shadow-sm border border-outline-variant/30">
              <span className="material-symbols-outlined text-secondary text-sm">verified</span>
              <span>Kanal Resmi Aspirasi & Tinjau Lapangan Warga Kota</span>
            </div>

            <div className="flex flex-col gap-space-xs">
              <h1 className="font-headline text-3xl sm:text-5xl font-extrabold text-primary tracking-tight leading-tight">
                Lapor Mudah, Tindak Cepat, <br className="hidden sm:inline" />
                <span className="text-secondary">Bandar Lampung Lebih Baik</span>
              </h1>
              <p className="font-body text-base text-on-surface-variant max-w-2xl leading-relaxed mt-2">
                Platform digital pintar pengaduan fasilitas & pelayanan publik Kota Bandar Lampung
                berbasis geolokasi presisi. Transparan, terakuntabilitas, dan melindungi privasi identitas pelapor.
              </p>
            </div>

            {/* Quick Ticket Search Bar */}
            <div className="flex flex-col sm:flex-row items-center gap-space-xs bg-surface-container-lowest p-2 rounded-xl shadow-md border border-outline-variant/30 max-w-xl">
              <div className="relative flex-1 flex items-center w-full">
                <span className="material-symbols-outlined absolute left-3 text-outline text-lg">search</span>
                <input
                  type="text"
                  value={searchTicket}
                  onChange={(e) => setSearchTicket(e.target.value)}
                  placeholder="Cari nomor tiket (Contoh: TKT-20261110-00001)..."
                  className="w-full pl-9 pr-3 py-2.5 text-xs bg-transparent focus:outline-none text-on-surface"
                />
              </div>
              <button
                type="button"
                className="w-full sm:w-auto px- space-md py-2.5 rounded-lg bg-secondary text-on-secondary text-xs font-bold hover:bg-secondary-container transition-all"
              >
                Lacak Laporan
              </button>
            </div>

            {/* Quick Stats Pill */}
            <div className="flex flex-wrap items-center gap-space-md pt-2 text-xs text-on-surface-variant">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                <span><strong>1.284+</strong> Pengaduan Selesai</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-secondary"></span>
                <span><strong>&le; 24 Jam</strong> Respon Awal Verifikasi</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-amber-500"></span>
                <span><strong>20 Kecamatan</strong> Terlayani</span>
              </div>
            </div>
          </div>

          {/* Right Action Banner */}
          <div className="lg:col-span-5 flex flex-col gap-space-md bg-surface-container-lowest p-space-lg rounded-2xl border border-outline-variant/30 shadow-md">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
              <span className="font-headline text-base font-bold text-primary">Kirim Laporan Anda</span>
              <span className="text-[11px] font-semibold text-secondary bg-secondary/10 px-2.5 py-0.5 rounded-full">
                Responsif 24/7
              </span>
            </div>

            <p className="text-xs text-on-surface-variant leading-relaxed">
              Temukan jalan berlubang, lampu jalan padam, atau tumpukan sampah di lingkungan Anda?
              Foto dan laporkan langsung dengan titik lokasi GPS presisi.
            </p>

            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-secondary text-sm mt-0.5">check_circle</span>
                <span>Identitas pelapor <strong>tidak dipublikasikan</strong> ke umum</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-secondary text-sm mt-0.5">check_circle</span>
                <span>Didisposisi langsung ke OPD terkait (Dishub, PU, DLH)</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-secondary text-sm mt-0.5">check_circle</span>
                <span>Pantau perkembangan secara real-time hingga selesai</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <Link
                href="/login?redirect=/dashboard/warga/lapor"
                className="w-full py-3 bg-secondary hover:bg-secondary-container text-on-secondary font-label-md text-xs font-bold rounded-lg shadow transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-base">add_location_alt</span>
                <span>Buat Pengaduan Sekarang</span>
              </Link>
              <Link
                href="/register"
                className="w-full py-2.5 bg-surface-container-high hover:bg-surface-container-highest text-primary font-label-md text-xs font-semibold rounded-lg transition-colors text-center"
              >
                Daftar Akun Warga (e-KTP)
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section: Peta Sebaran Pengaduan Publik */}
      <section id="peta-sebaran" className="py-space-xl px-margin max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-space-md gap-2">
          <div>
            <div className="inline-flex items-center gap-1 text-xs text-secondary font-semibold uppercase tracking-wider mb-1">
              <span className="material-symbols-outlined text-sm">map</span>
              <span>Peta Spasial Geografis</span>
            </div>
            <h2 className="font-headline text-2xl font-bold text-primary">Sebaran Titik Pengaduan Terverifikasi</h2>
          </div>
          <span className="text-xs text-on-surface-variant">
            Menampilkan titik insiden publik se-Kota Bandar Lampung (OpenStreetMap)
          </span>
        </div>

        <LeafletMap
          initialLat={-5.395211}
          initialLng={105.263412}
          zoom={13}
          markers={mapMarkers}
          className="w-full h-96 rounded-2xl"
        />
      </section>

      {/* Feed Section: Daftar Laporan Publik */}
      <section id="daftar-laporan" className="py-space-xl px-margin max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-space-md gap-4">
          <div>
            <h2 className="font-headline text-2xl font-bold text-primary">Laporan Terkini Masyarakat</h2>
            <p className="text-xs text-on-surface-variant">Laporan yang telah diverifikasi dan dalam proses tindak lanjut</p>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            {["SEMUA", "Lampu Jalan", "Jalan Rusak", "Sampah Liar"].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  selectedCategory === cat
                    ? "bg-primary text-on-primary shadow-sm"
                    : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Complaints Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-md">
          {filteredComplaints.map((c) => (
            <div
              key={c.ticket_number}
              className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-space-md shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between gap-3"
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-secondary text-[11px]">{c.ticket_number}</span>
                  <StatusBadge status={c.status} />
                </div>

                <h3 className="font-headline text-sm font-bold text-primary line-clamp-2 leading-snug">
                  {c.title}
                </h3>

                <p className="text-xs text-on-surface-variant line-clamp-3 leading-relaxed">
                  {c.description}
                </p>
              </div>

              <div className="border-t border-outline-variant/20 pt-2 flex flex-col gap-1 text-[11px] text-on-surface-variant">
                <div className="flex items-center justify-between">
                  <span className="truncate max-w-[170px]">Dinas: <strong>{c.agency_name}</strong></span>
                  <span>{c.region_name || "Bandar Lampung"}</span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-outline">
                  <span>Pelapor: Warga (Disamarkan)</span>
                  <span>{new Date(c.created_at).toLocaleDateString("id-ID")}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
