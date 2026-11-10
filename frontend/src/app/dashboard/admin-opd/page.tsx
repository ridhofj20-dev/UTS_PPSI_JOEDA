"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { DashboardSidebar } from "@/components/layouts/DashboardSidebar";
import { DashboardTopbar } from "@/components/layouts/DashboardTopbar";
import { StatCard } from "@/components/ui/StatCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { getStoredUser, apiFetch } from "@/lib/api-client";
import { UserProfile } from "@/types";

export default function AgencyAdminDashboardPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState({
    total: 34,
    pending: 4,
    inProgress: 12,
    resolved: 18,
    rate: 85,
  });

  const triageQueue = [
    {
      id: "55555555-5555-5555-5555-555555555555",
      ticket_number: "TKT-20261110-00001",
      title: "Lampu Penerangan Jalan Umum (PJU) Padam di Depan Kampus Teknokrat Jl. ZA Pagar Alam",
      category: "Lampu Jalan & Traffic Light",
      region: "Kedaton",
      priority: "HIGH",
      status: "UNDER_REVIEW",
      date: "10 Nov 2026 08:30 WIB",
    },
    {
      id: "dishub-002",
      ticket_number: "TKT-20261110-00018",
      title: "Traffic Light Error Berkedip Kuning Bersamaan di Simpang Kalibalok",
      category: "Lampu Jalan & Traffic Light",
      region: "Sukarame",
      priority: "URGENT",
      status: "SUBMITTED",
      date: "10 Nov 2026 11:15 WIB",
    },
    {
      id: "dishub-003",
      ticket_number: "TKT-20261109-00055",
      title: "Rambu Penyeberangan Jalan (Zebra Cross) Tertutup Dahan di Jl. Kartini",
      category: "Rambu & Marka Jalan",
      region: "Tanjung Karang Pusat",
      priority: "MEDIUM",
      status: "VERIFIED",
      date: "09 Nov 2026 16:40 WIB",
    },
  ];

  useEffect(() => {
    const activeUser = getStoredUser();
    setUser(activeUser);

    apiFetch<any>("/admin/statistics")
      .then((data) => {
        if (data?.summary) {
          setStats({
            total: data.summary.total_complaints || 34,
            pending: data.summary.pending_verification || 4,
            inProgress: data.summary.in_progress || 12,
            resolved: data.summary.resolved || 18,
            rate: data.summary.resolution_rate_percent || 85,
          });
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar
        role="AGENCY_ADMIN"
        userName={user?.full_name || "Ir. Hendra Kusuma, S.T."}
        agencyName={user?.agency_name || "Dinas Perhubungan Kota"}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <DashboardTopbar
          breadcrumb="Dashboard Admin OPD"
          subTitle="Pusat Kendali Pengaduan Dinas Perhubungan Kota Bandar Lampung"
          userName={user?.full_name || "Ir. Hendra Kusuma, S.T."}
          userRole="Admin Koordinator OPD Dishub"
        />

        <main className="p-gutter max-w-7xl w-full mx-auto flex flex-col gap-space-lg">
          {/* Welcome Banner */}
          <div className="bg-primary text-on-primary rounded-2xl p-space-lg shadow flex flex-col md:flex-row md:items-center justify-between gap-space-md">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-tertiary-fixed font-mono">
                Pusat Verifikasi & Disposisi Instansi
              </span>
              <h1 className="font-headline text-2xl font-bold mt-0.5">
                {user?.agency_name || "Dinas Perhubungan Kota Bandar Lampung"}
              </h1>
              <p className="text-xs text-on-primary-container max-w-xl mt-1">
                Tinjau aduan masuk warga, lakukan verifikasi faktual lapangan, tetapkan tingkat urgensi prioritas, dan disposisikan regu satgas pelaksana.
              </p>
            </div>
          </div>

          {/* KPI Statistics Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-space-md">
            <StatCard title="Total Aduan Masuk" value={stats.total} subtitle="Bulan Berjalan" icon="inbox" />
            <StatCard title="Menunggu Verifikasi" value={stats.pending} subtitle="Perlu Tindakan Cepat" icon="notification_important" accentColor="border-t-rose-500" />
            <StatCard title="Sedang Ditangani" value={stats.inProgress} subtitle="Satgas Reaksi Cepat" icon="engineering" accentColor="border-t-blue-600" />
            <StatCard title="Rasio Penyelesaian" value={`${stats.rate}%`} subtitle="Standar Pelayanan Minimal" icon="verified" accentColor="border-t-emerald-600" />
          </div>

          {/* Triage Queue Table */}
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl shadow-sm overflow-hidden flex flex-col">
            <div className="p-space-md border-b border-outline-variant/20 flex items-center justify-between">
              <div>
                <h2 className="font-headline text-base font-bold text-primary">Antrean Pengaduan Memerlukan Tindakan</h2>
                <span className="text-xs text-on-surface-variant">Verifikasi dan disposisikan tugas sebelum batas SLA terlampaui</span>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 bg-amber-50 text-amber-800 rounded-full border border-amber-200">
                {triageQueue.length} Menunggu
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-surface-container-low text-on-surface-variant font-label-sm uppercase tracking-wider text-[11px] border-b border-outline-variant/20">
                  <tr>
                    <th className="py-3 px-space-md">Tiket Aduan</th>
                    <th className="py-3 px-space-md">Judul & Wilayah</th>
                    <th className="py-3 px-space-md">Kategori</th>
                    <th className="py-3 px-space-md">Status</th>
                    <th className="py-3 px-space-md">Prioritas</th>
                    <th className="py-3 px-space-md text-right">Aksi Eksekusi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  {triageQueue.map((item) => (
                    <tr key={item.ticket_number} className="hover:bg-surface-container-low/50 transition-colors">
                      <td className="py-3.5 px-space-md font-mono font-bold text-secondary">
                        {item.ticket_number}
                      </td>
                      <td className="py-3.5 px-space-md max-w-sm">
                        <div className="font-bold text-primary leading-snug">{item.title}</div>
                        <div className="text-[11px] text-on-surface-variant">Kec. {item.region} • {item.date}</div>
                      </td>
                      <td className="py-3.5 px-space-md text-on-surface-variant">
                        {item.category}
                      </td>
                      <td className="py-3.5 px-space-md">
                        <StatusBadge status={item.status} />
                      </td>
                      <td className="py-3.5 px-space-md">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${item.priority === 'URGENT' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'}`}>
                          {item.priority}
                        </span>
                      </td>
                      <td className="py-3.5 px-space-md text-right">
                        <Link
                          href={`/dashboard/admin-opd/verifikasi/${item.id}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-secondary text-on-secondary font-label-md text-xs font-semibold hover:bg-secondary-container transition-all"
                        >
                          <span>Verifikasi</span>
                          <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

