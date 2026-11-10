"use client";

import React, { useState } from "react";
import Link from "next/link";
import { DashboardSidebar } from "@/components/layouts/DashboardSidebar";
import { DashboardTopbar } from "@/components/layouts/DashboardTopbar";

export default function UserManagementPage() {
  const [filterRole, setFilterRole] = useState("ALL");
  const [search, setSearch] = useState("");

  const [users, setUsers] = useState([
    {
      id: "u1",
      full_name: "Dr. H. Ahmad Fauzi, M.T.",
      email: "superadmin@bandarlampung.go.id",
      nik: "1871000101800001",
      role: "SUPER_ADMIN",
      agency: "Diskominfotik Kota",
      is_active: true,
      joined: "01 Jan 2026",
    },
    {
      id: "u2",
      full_name: "Ir. Hendra Kusuma, S.T.",
      email: "admin.dishub@bandarlampung.go.id",
      nik: "1871041005850002",
      role: "AGENCY_ADMIN",
      agency: "Dinas Perhubungan",
      is_active: true,
      joined: "15 Jan 2026",
    },
    {
      id: "u3",
      full_name: "Hendra Setiawan",
      email: "petugas.dishub@bandarlampung.go.id",
      nik: "1871042008920003",
      role: "OFFICER",
      agency: "Dinas Perhubungan (Satgas)",
      is_active: true,
      joined: "20 Jan 2026",
    },
    {
      id: "u4",
      full_name: "Budi Santoso",
      email: "warga.budi@gmail.com",
      nik: "1871041208950001",
      role: "CITIZEN",
      agency: "Warga Kedaton",
      is_active: true,
      joined: "10 Feb 2026",
    },
    {
      id: "u5",
      full_name: "Siti Rahmawati",
      email: "siti.rahma@gmail.com",
      nik: "1871055503980005",
      role: "CITIZEN",
      agency: "Warga Kemiling",
      is_active: false,
      joined: "12 Feb 2026",
    },
  ]);

  const toggleUserStatus = (id: string) => {
    setUsers(
      users.map((u) => (u.id === id ? { ...u, is_active: !u.is_active } : u))
    );
  };

  const filteredUsers = users.filter((u) => {
    const matchesRole = filterRole === "ALL" || u.role === filterRole;
    const matchesSearch =
      search.trim() === "" ||
      u.full_name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.nik.includes(search);
    return matchesRole && matchesSearch;
  });

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar
        role="SUPER_ADMIN"
        userName="Dr. H. Ahmad Fauzi, M.T."
        agencyName="Pemerintah Kota & Diskominfotik"
      />

      <div className="flex-1 flex flex-col min-w-0">
        <DashboardTopbar
          breadcrumb="Manajemen Pengguna"
          subTitle="Tata Kelola Akun, NIK & Hak Akses Peran"
          userName="Dr. H. Ahmad Fauzi, M.T."
          userRole="Super Administrator Kota"
        />

        <main className="p-gutter max-w-7xl w-full mx-auto flex flex-col gap-space-lg">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md bg-surface-container-lowest p-space-lg rounded-2xl border border-outline-variant/30 shadow-sm">
            <div>
              <span className="text-[11px] font-bold text-secondary uppercase tracking-widest font-mono">
                Tata Kelola Pengguna
              </span>
              <h1 className="font-headline text-2xl font-bold text-primary mt-0.5">
                Manajemen Akun & Otoritas Sistem
              </h1>
              <p className="text-xs text-on-surface-variant mt-1">
                Kelola hak akses 4 role, verifikasi status NIK warga, dan kontrol aktivasi pengguna.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-purple-50 text-purple-800 border border-purple-200">
                {users.length} Akun Terdaftar
              </span>
            </div>
          </div>

          {/* Filter & Search Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-space-md">
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              {[
                { label: "Semua Peran", val: "ALL" },
                { label: "Warga", val: "CITIZEN" },
                { label: "Satgas Lapangan", val: "OFFICER" },
                { label: "Admin OPD", val: "AGENCY_ADMIN" },
                { label: "Super Admin", val: "SUPER_ADMIN" },
              ].map((tab) => (
                <button
                  key={tab.val}
                  type="button"
                  onClick={() => setFilterRole(tab.val)}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                    filterRole === tab.val
                      ? "bg-primary text-on-primary shadow-sm"
                      : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-72">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-outline text-lg">search</span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari nama, email, NIK..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-surface-container-lowest border border-outline-variant/30 focus:border-secondary outline-none"
              />
            </div>
          </div>

          {/* Table */}
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-surface-container-low text-on-surface-variant font-label-sm uppercase tracking-wider text-[11px] border-b border-outline-variant/20">
                  <tr>
                    <th className="py-3 px-space-md">Nama Lengkap & NIK</th>
                    <th className="py-3 px-space-md">Alamat Email</th>
                    <th className="py-3 px-space-md">Peran (Role)</th>
                    <th className="py-3 px-space-md">Instansi / Wilayah</th>
                    <th className="py-3 px-space-md">Status Akun</th>
                    <th className="py-3 px-space-md text-right">Tindakan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-surface-container-low/50 transition-colors">
                      <td className="py-3.5 px-space-md">
                        <div className="font-bold text-primary">{u.full_name}</div>
                        <div className="text-[11px] text-outline font-mono">NIK: {u.nik}</div>
                      </td>
                      <td className="py-3.5 px-space-md text-on-surface-variant">{u.email}</td>
                      <td className="py-3.5 px-space-md">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-surface-container-high text-primary">
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3.5 px-space-md text-on-surface">{u.agency}</td>
                      <td className="py-3.5 px-space-md">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            u.is_active ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                          }`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${u.is_active ? "bg-emerald-500" : "bg-rose-500"}`}></span>
                          <span>{u.is_active ? "Aktif" : "Dibekukan"}</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-space-md text-right">
                        <button
                          type="button"
                          onClick={() => toggleUserStatus(u.id)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                            u.is_active
                              ? "bg-rose-50 text-rose-700 hover:bg-rose-100"
                              : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                          }`}
                        >
                          {u.is_active ? "Bekukan" : "Aktifkan"}
                        </button>
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
