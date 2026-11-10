"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { DashboardSidebar } from "@/components/layouts/DashboardSidebar";
import { DashboardTopbar } from "@/components/layouts/DashboardTopbar";
import { StatCard } from "@/components/ui/StatCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { getStoredUser, apiFetch } from "@/lib/api-client";
import { ComplaintDetail, UserProfile } from "@/types";

export default function CitizenDashboardPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [complaints, setComplaints] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Demo fallback
  const demoList = [
    {
      id: "55555555-5555-5555-5555-555555555555",
      ticket_number: "TKT-20261110-00001",
      title: "Lampu Penerangan Jalan Umum (PJU) Padam di Depan Kampus Teknokrat Jl. ZA Pagar Alam",
      category_name: "Lampu Jalan & Traffic Light",
      status: "IN_PROGRESS",
      priority: "HIGH",
      created_at: "2026-11-10T08:30:00Z",
    },
    {
      id: "demo-2",
      ticket_number: "TKT-20261028-00104",
      title: "Lubang Jalan Cukup Besar Membahayakan Dekat Pasar Way Halim",
      category_name: "Jalan Rusak & Berlubang",
      status: "RESOLVED",
      priority: "MEDIUM",
      created_at: "2026-10-28T11:20:00Z",
    },
  ];

  useEffect(() => {
    const activeUser = getStoredUser();
    setUser(activeUser);

    apiFetch<any[]>("/complaints/mine")
      .then((data) => {
        if (data && data.length > 0) {
          setComplaints(data);
        } else {
          setComplaints(demoList);
        }
      })
      .catch(() => {
        setComplaints(demoList);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const total = complaints.length;
  const inProgress = complaints.filter((c) => c.status === "IN_PROGRESS" || c.status === "ASSIGNED").length;
  const resolved = complaints.filter((c) => c.status === "RESOLVED" || c.status === "CLOSED").length;
  const pending = complaints.filter((c) => c.status === "SUBMITTED" || c.status === "UNDER_REVIEW").length;

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar
        role={user?.role || "CITIZEN"}
        userName={user?.full_name || "Budi Santoso"}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <DashboardTopbar
          breadcrumb="Dashboard Warga"
          subTitle="Portal Pelaporan Aspirasi & Fasilitas Publik"
          userName={user?.full_name || "Budi Santoso"}
          userRole="Warga Masyarakat"
        />

        <main className="p-gutter max-w-7xl w-full mx-auto flex flex-col gap-space-lg">
          {/* Welcome Header & Action */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md bg-surface-container-lowest p-space-lg rounded-2xl border border-outline-variant/30 shadow-sm">
            <div>
              <span className="text-[11px] font-bold text-secondary uppercase tracking-widest">
                Selamat Datang
              </span>
              <h1 className="font-headline text-2xl font-bold text-primary mt-0.5">
                {user?.full_name || "Budi Santoso"}
              </h1>
              <p className="text-xs text-on-surface-variant mt-1">
                Pantau progres tindak lanjut aduan fasilitas kota Anda secara transparan.
              </p>
            </div>

            <Link
              href="/dashboard/warga/lapor"
              className="inline-flex items-center justify-center gap-2 px-space-lg py-3 rounded-xl bg-secondary hover:bg-secondary-container text-on-secondary text-xs font-bold shadow transition-all self-start sm:self-auto"
            >
              <span className="material-symbols-outlined text-base">add_location_alt</span>
              <span>Buat Pengaduan Baru</span>
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-space-md">
            <StatCard title="Total Laporan" value={total} subtitle="Riwayat diajukan" icon="assignment" />
            <StatCard title="Sedang Ditangani" value={inProgress} subtitle="Satgas di lapangan" icon="engineering" accentColor="border-t-blue-600" />
            <StatCard title="Selesai Ditindak" value={resolved} subtitle="Telah teratasi" icon="task_alt" accentColor="border-t-emerald-600" />
            <StatCard title="Dalam Peninjauan" value={pending} subtitle="Antrean verifikasi" icon="pending" accentColor="border-t-amber-500" />
          </div>

          {/* Table of User's Complaints */}
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl shadow-sm overflow-hidden flex flex-col">
            <div className="p-space-md border-b border-outline-variant/20 flex items-center justify-between">
              <div>
                <h2 className="font-headline text-base font-bold text-primary">Daftar Pengaduan Saya</h2>
                <span className="text-xs text-on-surface-variant">Laporan yang Anda kirimkan ke Pemerintah Kota</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-surface-container-low text-on-surface-variant font-label-sm uppercase tracking-wider text-[11px] border-b border-outline-variant/20">
                  <tr>
                    <th className="py-3 px-space-md">Nomor Tiket</th>
                    <th className="py-3 px-space-md">Judul Laporan</th>
                    <th className="py-3 px-space-md">Kategori</th>
                    <th className="py-3 px-space-md">Status Progres</th>
                    <th className="py-3 px-space-md">Tanggal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  {complaints.map((c) => (
                    <tr key={c.ticket_number} className="hover:bg-surface-container-low/50 transition-colors">
                      <td className="py-3.5 px-space-md font-mono font-bold text-secondary">
                        {c.ticket_number}
                      </td>
                      <td className="py-3.5 px-space-md font-semibold text-primary max-w-xs truncate">
                        {c.title}
                      </td>
                      <td className="py-3.5 px-space-md text-on-surface-variant">
                        {c.category_name || "Fasilitas Umum"}
                      </td>
                      <td className="py-3.5 px-space-md">
                        <StatusBadge status={c.status} />
                      </td>
                      <td className="py-3.5 px-space-md text-outline">
                        {new Date(c.created_at).toLocaleDateString("id-ID")}
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
