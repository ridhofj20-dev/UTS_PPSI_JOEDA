import React from "react";
import { ComplaintStatus } from "@/types";

interface StatusBadgeProps {
  status: ComplaintStatus | string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = "" }) => {
  const getBadgeStyle = () => {
    switch (status.toUpperCase()) {
      case "SUBMITTED":
        return {
          bg: "bg-amber-50 text-amber-800 border-amber-200",
          label: "Menunggu Peninjauan",
          dot: "bg-amber-500",
        };
      case "UNDER_REVIEW":
        return {
          bg: "bg-amber-100 text-amber-900 border-amber-300",
          label: "Sedang Ditinjau",
          dot: "bg-amber-600",
        };
      case "VERIFIED":
        return {
          bg: "bg-sky-50 text-sky-800 border-sky-200",
          label: "Terverifikasi",
          dot: "bg-sky-500",
        };
      case "ASSIGNED":
        return {
          bg: "bg-indigo-50 text-indigo-800 border-indigo-200",
          label: "Petugas Ditugaskan",
          dot: "bg-indigo-500",
        };
      case "IN_PROGRESS":
        return {
          bg: "bg-blue-50 text-blue-800 border-blue-200",
          label: "Sedang Dikerjakan",
          dot: "bg-blue-600 animate-pulse",
        };
      case "RESOLVED":
        return {
          bg: "bg-emerald-50 text-emerald-800 border-emerald-200",
          label: "Selesai Dikerjakan",
          dot: "bg-emerald-500",
        };
      case "CLOSED":
        return {
          bg: "bg-slate-100 text-slate-700 border-slate-300",
          label: "Laporan Ditutup",
          dot: "bg-slate-500",
        };
      case "REJECTED":
        return {
          bg: "bg-rose-50 text-rose-800 border-rose-200",
          label: "Laporan Ditolak",
          dot: "bg-rose-500",
        };
      default:
        return {
          bg: "bg-slate-50 text-slate-700 border-slate-200",
          label: status,
          dot: "bg-slate-400",
        };
    }
  };

  const style = getBadgeStyle();

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${style.bg} ${className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`}></span>
      <span>{style.label}</span>
    </span>
  );
};
