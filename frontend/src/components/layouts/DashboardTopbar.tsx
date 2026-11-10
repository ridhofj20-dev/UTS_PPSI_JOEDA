"use client";

import React from "react";

interface TopbarProps {
  breadcrumb: string;
  subTitle?: string;
  userName?: string;
  userRole?: string;
}

export const DashboardTopbar: React.FC<TopbarProps> = ({
  breadcrumb,
  subTitle = "Sistem Operasional Siaga Pelayanan Publik",
  userName = "Pengguna Sistem",
  userRole = "Operator",
}) => {
  return (
    <header className="h-16 bg-surface-container-lowest/90 backdrop-blur-xl border-b border-outline-variant/20 px-gutter flex items-center justify-between gap-space-md sticky top-0 z-30">
      {/* Left: Breadcrumbs & Status */}
      <div className="flex items-center gap-space-md">
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 text-xs text-on-surface-variant">
            <span className="font-semibold text-primary">Lampung Report</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-secondary font-semibold">{breadcrumb}</span>
          </div>
          <span className="text-[11px] text-on-surface-variant hidden sm:inline">{subTitle}</span>
        </div>
      </div>

      {/* Right: Notification & User Pill */}
      <div className="flex items-center gap-space-md">
        <div className="hidden lg:flex items-center gap-2 px-space-sm py-1 bg-surface-container-low border border-outline-variant/30 rounded-full">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-[11px] font-semibold text-emerald-800">Server Backend Online</span>
        </div>

        <button
          type="button"
          className="relative p-2 rounded-lg text-on-surface-variant hover:bg-surface-container-low transition-colors"
          title="Notifikasi"
        >
          <span className="material-symbols-outlined text-xl">notifications</span>
          <span className="absolute top-1.5 right-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-error px-1 text-[9px] font-bold text-on-error">
            3
          </span>
        </button>

        <div className="h-6 w-px bg-outline-variant/30"></div>

        <div className="flex items-center gap-space-sm">
          <div className="hidden sm:flex flex-col text-right">
            <span className="font-label-md text-xs font-bold text-on-surface leading-tight">
              {userName}
            </span>
            <span className="text-[10px] text-on-surface-variant leading-tight">{userRole}</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-xs">
            {userName ? userName.charAt(0).toUpperCase() : "U"}
          </div>
        </div>
      </div>
    </header>
  );
};
