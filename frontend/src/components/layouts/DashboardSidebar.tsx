"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserRole } from "@/types";
import { clearStoredAuth } from "@/lib/api-client";

interface SidebarProps {
  role: UserRole;
  userName?: string;
  agencyName?: string;
}

export const DashboardSidebar: React.FC<SidebarProps> = ({ role, userName, agencyName }) => {
  const pathname = usePathname();

  const handleLogout = () => {
    clearStoredAuth();
    window.location.href = "/";
  };

  const getNavItems = () => {
    switch (role) {
      case "CITIZEN":
        return [
          { label: "Dashboard Warga", href: "/dashboard/warga", icon: "dashboard" },
          { label: "Buat Laporan Baru", href: "/dashboard/warga/lapor", icon: "add_circle" },
          { label: "Portal Publik Kota", href: "/", icon: "public" },
        ];
      case "OFFICER":
        return [
          { label: "Dashboard Tugas", href: "/dashboard/petugas", icon: "assignment" },
          { label: "Portal Publik Kota", href: "/", icon: "public" },
        ];
      case "AGENCY_ADMIN":
        return [
          { label: "Dashboard OPD", href: "/dashboard/admin-opd", icon: "dashboard" },
          { label: "Portal Publik Kota", href: "/", icon: "public" },
        ];
      case "SUPER_ADMIN":
        return [
          { label: "Pusat Komando Kota", href: "/dashboard/super-admin", icon: "space_dashboard" },
          { label: "Manajemen Pengguna", href: "/dashboard/super-admin/users", icon: "manage_accounts" },
          { label: "Portal Publik Kota", href: "/", icon: "public" },
        ];
      default:
        return [{ label: "Beranda", href: "/", icon: "home" }];
    }
  };

  const navItems = getNavItems();

  const getRoleBadge = () => {
    switch (role) {
      case "SUPER_ADMIN":
        return { label: "SUPER ADMIN", color: "bg-purple-100 text-purple-800" };
      case "AGENCY_ADMIN":
        return { label: "ADMIN INSTANSI", color: "bg-amber-100 text-amber-800" };
      case "OFFICER":
        return { label: "SATGAS LAPANGAN", color: "bg-blue-100 text-blue-800" };
      default:
        return { label: "WARGA MASYARAKAT", color: "bg-emerald-100 text-emerald-800" };
    }
  };

  const badge = getRoleBadge();

  return (
    <aside className="w-64 lg:w-72 bg-primary-container text-on-primary flex flex-col justify-between shrink-0 h-screen sticky top-0 shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-40 overflow-y-auto">
      {/* Top Header Logo */}
      <div className="flex flex-col">
        <div className="p-space-lg bg-primary border-b border-outline-variant/10">
          <div className="flex items-center gap-space-sm mb-2">
            <div className="flex items-center gap-1.5 p-1 bg-surface-container-lowest rounded-lg">
              <img
                src="/assets/logo-pemkot-bandar-lampung.jpg"
                alt="Logo Pemkot"
                className="h-7 w-auto object-contain rounded"
              />
              <img
                src="/assets/logo-teknokrat.png"
                alt="Logo Teknokrat"
                className="h-7 w-auto object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-headline text-sm font-bold tracking-tight text-surface-bright leading-tight">
                LAMPUNG REPORT
              </span>
              <span className="font-label-sm text-[10px] text-tertiary-fixed font-semibold uppercase">
                Bandar Lampung
              </span>
            </div>
          </div>

          <div className="mt-2 flex items-center justify-between">
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${badge.color}`}>
              {badge.label}
            </span>
            {agencyName && (
              <span className="text-[11px] text-surface-variant truncate max-w-[130px]" title={agencyName}>
                {agencyName}
              </span>
            )}
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="p-space-md flex flex-col gap-1.5">
          <div className="px-space-sm py-1 text-[11px] font-label-sm uppercase tracking-wider text-outline-variant font-bold">
            Navigasi Menu
          </div>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-space-sm px-space-md py-2.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-secondary text-on-secondary shadow-sm"
                    : "text-on-primary-container hover:bg-surface-container-high/20 hover:text-on-primary"
                }`}
              >
                <span className="material-symbols-outlined text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Profile & Logout Action */}
      <div className="p-space-md bg-primary border-t border-outline-variant/10">
        <div className="flex items-center gap-space-sm mb-3">
          <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center font-bold text-xs text-on-secondary">
            {userName ? userName.charAt(0).toUpperCase() : "U"}
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="font-label-md text-xs font-semibold text-surface-bright truncate">
              {userName || "Pengguna Aktif"}
            </span>
            <span className="text-[10px] text-on-primary-container truncate">
              Status Sesi: Terautentikasi
            </span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          type="button"
          className="w-full flex items-center justify-center gap-space-xs py-2 px-3 rounded-lg bg-surface-container-lowest/10 hover:bg-error hover:text-on-error text-error-container text-xs font-bold transition-colors"
        >
          <span className="material-symbols-outlined text-base">logout</span>
          <span>Keluar Sistem</span>
        </button>
      </div>
    </aside>
  );
};

