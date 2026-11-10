"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { DashboardSidebar } from "@/components/layouts/DashboardSidebar";
import { DashboardTopbar } from "@/components/layouts/DashboardTopbar";
import { StatCard } from "@/components/ui/StatCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { getStoredUser } from "@/lib/api-client";
import { UserProfile } from "@/types";

export default function OfficerDashboardPage() {
  const [user, setUser] = useState<UserProfile | null>(null);

  const assignedTasks = [
    {
      id: "55555555-5555-5555-5555-555555555555",
      ticket_number: "TKT-20261110-00001",
      title: "Lampu Penerangan Jalan Umum (PJU) Padam di Depan Kampus Teknokrat Jl. ZA Pagar Alam",
      category: "Lampu Jalan & Traffic Light",
      address: "Jl. ZA Pagar Alam No. 9-11, Kedaton",
      priority: "HIGH",
      status: "IN_PROGRESS",
      sla_deadline: "Sisa 4 Jam 25 Menit",
      assigned_at: "2026-11-10 09:15 WIB",
    },
    {
      id: "task-002",
      ticket_number: "TKT-20261110-00012",
      title: "Cermin Tikungan Pecah di Simpang Jl. Sultan Agung - Jl. Teuku Umar",
      category: "Rambu & Marka Jalan",
      address: "Simpang flyover Sultan Agung, Kedaton",
      priority: "MEDIUM",
      status: "ASSIGNED",
      sla_deadline: "Sisa 8 Jam",
      assigned_at: "2026-11-10 11:30 WIB",
    },
  ];

  useEffect(() => {
    const activeUser = getStoredUser();
    setUser(activeUser);
  }, []);

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar
        role="OFFICER"
        userName={user?.full_name || "Hendra Setiawan"}
        agencyName={user?.agency_name || "Dinas Perhubungan Kota"}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <DashboardTopbar
          breadcrumb="Portal Satgas Lapangan"
          subTitle="Disposisi Reaksi Cepat Penanganan Lapangan"
          userName={user?.full_name || "Hendra Setiawan"}
          userRole="Satgas Regu 2 Dishub Kedaton"
        />

        <main className="p-gutter max-w-7xl w-full mx-auto flex flex-col gap-space-lg">
          {/* Header Banner */}
          <div className="bg-primary text-on-primary rounded-2xl p-space-lg shadow flex flex-col md:flex-row md:items-center justify-between gap-space-md">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-tertiary-fixed font-mono">
                Satgas Regu Lapangan Aktif
              </span>
              <h1 className="font-headline text-2xl font-bold mt-0.5">
                Pusat Tugas & Penanganan Lapangan
              </h1>
              <p className="text-xs text-on-primary-container max-w-xl mt-1">
                Lakukan verifikasi lapangan, perbarui status pengerjaan secara bertahap, dan unggah foto bukti sebelum dan sesudah perbaikan.
              </p>
            </div>
            <div className="px-space-md py-2 bg-surface-container-lowest/10 rounded-xl border border-outline-variant/20 text-center self-start md:self-auto">
              <span className="text-[11px] text-surface-variant block">Status Tim:</span>
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Siaga Reaksi Cepat
              </span>
            </div>
          </div>

          {/* Metric KPI Tiles */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-space-md">
            <StatCard title="Tugas Dikerjakan" value="1" subtitle="Regu Anda" icon="engineering" accentColor="border-t-blue-600" />
            <StatCard title="Menunggu Ditangani" value="1" subtitle="Antrean tugas" icon="pending_actions" accentColor="border-t-amber-500" />
            <StatCard title="Selesai Bulan Ini" value="28" subtitle="Telah terverifikasi" icon="task_alt" accentColor="border-t-emerald-600" />
            <StatCard title="SLA Rata-Rata" value="3.4 Jam" subtitle="Respon cepat" icon="timer" />
          </div>

          {/* Assigned Tasks Feed */}
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl shadow-sm overflow-hidden flex flex-col">
            <div className="p-space-md border-b border-outline-variant/20 flex items-center justify-between">
              <div>
                <h2 className="font-headline text-base font-bold text-primary">Daftar Surat Tugas Lapangan</h2>
                <span className="text-xs text-on-surface-variant">Tugas yang didisposisikan oleh Koordinator Admin OPD Anda</span>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 bg-secondary/10 text-secondary rounded-full">
                2 Tugas Aktif
              </span>
            </div>

            <div className="divide-y divide-outline-variant/10">
              {assignedTasks.map((t) => (
                <div key={t.id} className="p-space-md flex flex-col md:flex-row md:items-center justify-between gap-space-md hover:bg-surface-container-low/40 transition-colors">
                  <div className="flex flex-col gap-1.5 max-w-2xl">
                    <div className="flex flex-wrap items-center gap-space-xs text-xs">
                      <span className="font-mono font-bold text-secondary text-[11px]">{t.ticket_number}</span>
                      <StatusBadge status={t.status} />
                      <span className="text-[11px] text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                        {t.sla_deadline}
                      </span>
                    </div>

                    <h3 className="font-headline text-sm font-bold text-primary">
                      {t.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-space-md text-xs text-on-surface-variant">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px] text-outline">location_on</span>
                        {t.address}
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px] text-outline">schedule</span>
                        Ditugaskan: {t.assigned_at}
                      </span>
                    </div>
                  </div>

                  <Link
                    href={`/dashboard/petugas/tugas/${t.id}`}
                    className="inline-flex items-center justify-center gap-1.5 px-space-md py-2.5 rounded-xl bg-secondary hover:bg-secondary-container text-on-secondary text-xs font-bold shadow transition-all self-start md:self-auto shrink-0"
                  >
                    <span>Buka Pengerjaan</span>
                    <span className="material-symbols-outlined text-base">arrow_forward</span>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
