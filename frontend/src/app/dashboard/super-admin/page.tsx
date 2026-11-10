"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { DashboardSidebar } from "@/components/layouts/DashboardSidebar";
import { DashboardTopbar } from "@/components/layouts/DashboardTopbar";
import { StatCard } from "@/components/ui/StatCard";
import { getStoredUser, apiFetch } from "@/lib/api-client";
import { UserProfile } from "@/types";

export default function SuperAdminDashboardPage() {
  const [user, setUser] = useState<UserProfile | null>(null);

  const districts = [
    { name: "Kedaton", total: 142, resolved: 120, rate: 84 },
    { name: "Way Halim", total: 128, resolved: 110, rate: 85 },
    { name: "Sukarame", total: 115, resolved: 98, rate: 85 },
    { name: "Tanjung Karang Pusat", total: 104, resolved: 95, rate: 91 },
    { name: "Rajabasa", total: 98, resolved: 82, rate: 83 },
    { name: "Kemiling", total: 95, resolved: 80, rate: 84 },
    { name: "Enggal", total: 88, resolved: 81, rate: 92 },
    { name: "Teluk Betung Selatan", total: 84, resolved: 72, rate: 85 },
  ];

  const recentAudit = [
    { actor: "Ir. Hendra Kusuma (Admin Dishub)", action: "VERIFY_COMPLAINT", entity: "TKT-20261110-00001", time: "10:15 WIB" },
    { actor: "Budi Santoso (Citizen)", action: "CREATE_COMPLAINT", entity: "TKT-20261110-00001", time: "08:30 WIB" },
    { actor: "Hendra Setiawan (Officer)", action: "UPDATE_STATUS", entity: "TKT-20261110-00001 (IN_PROGRESS)", time: "09:45 WIB" },
    { actor: "Dr. H. Ahmad Fauzi (Super Admin)", action: "SYSTEM_CONFIG", entity: "GLOBAL_RULES", time: "Kemarin" },
  ];

  useEffect(() => {
    const activeUser = getStoredUser();
    setUser(activeUser);
  }, []);

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar
        role="SUPER_ADMIN"
        userName={user?.full_name || "Dr. H. Ahmad Fauzi, M.T."}
        agencyName="Pemerintah Kota & Diskominfotik"
      />

      <div className="flex-1 flex flex-col min-w-0">
        <DashboardTopbar
          breadcrumb="Pusat Komando Kota"
          subTitle="Tata Kelola Global & Analitik 20 Kecamatan"
          userName={user?.full_name || "Dr. H. Ahmad Fauzi, M.T."}
          userRole="Super Administrator Kota"
        />

        <main className="p-gutter max-w-7xl w-full mx-auto flex flex-col gap-space-lg">
          {/* Executive Command Banner */}
          <div className="bg-primary text-on-primary rounded-2xl p-space-lg shadow flex flex-col md:flex-row md:items-center justify-between gap-space-md">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-tertiary-fixed font-mono">
                Pusat Komando Kota Bandar Lampung
              </span>
              <h1 className="font-headline text-2xl font-bold mt-0.5">
                Pusat Komando & Tata Kelola Sistem Pengaduan
              </h1>
              <p className="text-xs text-on-primary-container max-w-xl mt-1">
                Pemantauan real-time agregasi pengaduan publik seluruh OPD dinas, pemetaan yurisdiksi 20 kecamatan, dan jejak audit keamanan.
              </p>
            </div>
            <div className="flex items-center gap-space-sm">
              <Link
                href="/dashboard/super-admin/users"
                className="px-space-md py-2.5 rounded-xl bg-secondary hover:bg-secondary-container text-on-secondary text-xs font-bold shadow transition-all flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-base">manage_accounts</span>
                <span>Manajemen Pengguna</span>
              </Link>
            </div>
          </div>

          {/* Global KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-space-md">
            <StatCard title="Total Aduan Kota" value="1.284" subtitle="Seluruh 20 Kecamatan" icon="analytics" />
            <StatCard title="Terselesaikan" value="1.092" subtitle="Rasio 85.1%" icon="task_alt" accentColor="border-t-emerald-600" />
            <StatCard title="Rata-rata SLA" value="28.4 Jam" subtitle="Target < 48 Jam" icon="speed" accentColor="border-t-blue-600" />
            <StatCard title="Pengguna Terdaftar" value="5.820" subtitle="Warga e-KTP & Petugas" icon="group" accentColor="border-t-purple-600" />
          </div>

          {/* Grid: 20 Kecamatan Overview & Audit Log */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
            {/* Districts Ranking (7 Cols) */}
            <div className="lg:col-span-7 bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-space-lg shadow-sm flex flex-col gap-space-md">
              <div className="flex items-center justify-between border-b border-outline-variant/20 pb-2">
                <div>
                  <h2 className="font-headline text-base font-bold text-primary">Sebaran 20 Kecamatan Terpadat</h2>
                  <span className="text-xs text-on-surface-variant">Volume aduan dan rasio penyelesaian per kecamatan</span>
                </div>
                <span className="text-xs font-mono font-bold text-secondary">Bandar Lampung</span>
              </div>

              <div className="divide-y divide-outline-variant/10 text-xs">
                {districts.map((d) => (
                  <div key={d.name} className="py-2.5 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-primary">Kec. {d.name}</span>
                      <span className="text-[11px] text-on-surface-variant block">
                        {d.resolved} selesai dari {d.total} laporan
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-surface-container-high rounded-full h-2 overflow-hidden hidden sm:block">
                        <div
                          className="bg-emerald-600 h-2 rounded-full"
                          style={{ width: `${d.rate}%` }}
                        ></div>
                      </div>
                      <span className="font-mono font-bold text-emerald-700 text-xs">{d.rate}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Audit Log Feed (5 Cols) */}
            <div className="lg:col-span-5 bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-space-lg shadow-sm flex flex-col gap-space-md">
              <div className="flex items-center justify-between border-b border-outline-variant/20 pb-2">
                <div>
                  <h2 className="font-headline text-base font-bold text-primary">Jejak Audit Keamanan</h2>
                  <span className="text-xs text-on-surface-variant">Aktivitas penting sistem terkini</span>
                </div>
                <span className="material-symbols-outlined text-secondary text-lg">shield</span>
              </div>

              <div className="space-y-3 text-xs">
                {recentAudit.map((log, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-surface-container-low border border-outline-variant/20 flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-primary text-[11px]">{log.action}</span>
                      <span className="text-[10px] text-outline font-mono">{log.time}</span>
                    </div>
                    <span className="text-[11px] text-on-surface truncate">{log.actor}</span>
                    <span className="text-[10px] font-mono text-secondary truncate">{log.entity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

