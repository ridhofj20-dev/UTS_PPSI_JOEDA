"use client";

import React from "react";
import Link from "next/link";
import { getStoredUser, clearStoredAuth } from "@/lib/api-client";

export const PublicNavbar: React.FC = () => {
  const user = getStoredUser();

  const handleLogout = () => {
    clearStoredAuth();
    window.location.href = "/";
  };

  const getDashboardLink = () => {
    if (!user) return "/login";
    switch (user.role) {
      case "CITIZEN":
        return "/dashboard/warga";
      case "OFFICER":
        return "/dashboard/petugas";
      case "AGENCY_ADMIN":
        return "/dashboard/admin-opd";
      case "SUPER_ADMIN":
        return "/dashboard/super-admin";
      default:
        return "/dashboard/warga";
    }
  };

  return (
    <header className="sticky top-0 w-full z-50 bg-surface/95 backdrop-blur-md shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-outline-variant/20">
      {/* Top Academic & Institutional Banner */}
      <div className="bg-primary-container text-on-primary px-margin py-1.5 flex items-center justify-between text-xs">
        <div className="flex items-center gap-space-md">
          <div className="flex items-center gap-space-xs bg-surface-container-lowest/10 px-2 py-0.5 rounded">
            <img
              src="/assets/logo-pemkot-bandar-lampung.jpg"
              alt="Pemkot Bandar Lampung"
              className="h-4 w-auto object-contain rounded"
            />
            <span className="font-label-sm uppercase tracking-wide text-surface-bright font-semibold">
              Pemerintah Kota Bandar Lampung
            </span>
          </div>
          <span className="text-on-primary-container hidden md:inline">|</span>
          <div className="flex items-center gap-space-xs bg-surface-container-lowest/10 px-2 py-0.5 rounded">
            <img
              src="/assets/logo-teknokrat.png"
              alt="Universitas Teknokrat Indonesia"
              className="h-4 w-auto object-contain"
            />
            <span className="font-label-sm uppercase tracking-wide text-tertiary-fixed font-semibold">
              Universitas Teknokrat Indonesia
            </span>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-space-xs text-surface-variant font-label-sm text-[11px]">
          <span className="material-symbols-outlined text-xs text-secondary-fixed">science</span>
          <span>Prototipe Sistem Civic Tech — Riset Akademik UTS PPSI</span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-margin h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-space-sm">
          <div className="flex items-center gap-2">
            <img
              src="/assets/logo-pemkot-bandar-lampung.jpg"
              alt="Logo Pemkot"
              className="h-9 w-auto object-contain rounded"
            />
            <img
              src="/assets/logo-teknokrat.png"
              alt="Logo Teknokrat"
              className="h-9 w-auto object-contain"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-headline text-lg font-bold tracking-tight text-primary leading-tight">
              LAMPUNG REPORT
            </span>
            <span className="font-label-sm text-[10px] text-secondary uppercase tracking-widest font-bold">
              Kota Bandar Lampung
            </span>
          </div>
        </Link>

        {/* Center Navigation Links */}
        <nav className="hidden md:flex items-center gap-space-xs">
          <Link
            href="/"
            className="px-space-md py-2 text-on-surface hover:text-secondary font-label-md text-sm font-semibold transition-colors"
          >
            Beranda
          </Link>
          <a
            href="#peta-sebaran"
            className="px-space-md py-2 text-on-surface-variant hover:text-on-surface font-label-md text-sm transition-colors"
          >
            Peta Pengaduan
          </a>
          <a
            href="#daftar-laporan"
            className="px-space-md py-2 text-on-surface-variant hover:text-on-surface font-label-md text-sm transition-colors"
          >
            Daftar Publik
          </a>
        </nav>

        {/* Right Action CTAs */}
        <div className="flex items-center gap-space-sm">
          <Link
            href={user ? "/dashboard/warga/lapor" : "/login?redirect=/dashboard/warga/lapor"}
            className="inline-flex items-center justify-center px-space-md py-2 rounded-lg bg-secondary text-on-secondary font-label-md text-xs font-bold hover:bg-secondary-container transition-all shadow-sm"
          >
            <span className="material-symbols-outlined text-base mr-1">campaign</span>
            <span>Buat Pengaduan</span>
          </Link>

          {user ? (
            <div className="flex items-center gap-space-xs">
              <Link
                href={getDashboardLink()}
                className="inline-flex items-center px-3 py-2 rounded-lg bg-surface-container-high text-primary font-label-md text-xs font-semibold hover:bg-surface-container-highest transition-colors"
              >
                <span className="material-symbols-outlined text-base mr-1">dashboard</span>
                <span>Dashboard ({user.role})</span>
              </Link>
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                title="Keluar"
              >
                <span className="material-symbols-outlined text-base">logout</span>
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-space-md py-2 rounded-lg bg-surface-container-high text-primary font-label-md text-xs font-semibold hover:bg-surface-container-highest transition-colors"
            >
              <span>Login Portal</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

