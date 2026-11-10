"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DashboardSidebar } from "@/components/layouts/DashboardSidebar";
import { DashboardTopbar } from "@/components/layouts/DashboardTopbar";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { apiFetch } from "@/lib/api-client";

export default function OfficerTaskDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();

  const [currentStatus, setCurrentStatus] = useState("IN_PROGRESS");
  const [progressNotes, setProgressNotes] = useState(
    "Penggantian bohlam LED 120W selesai. Trafo telah dicek dan berfungsi normal. Lampu menyala terang."
  );
  const [sopChecked, setSopChecked] = useState({
    cek1: true,
    cek2: true,
    cek3: true,
    cek4: true,
  });

  const [isUpdating, setIsUpdating] = useState(false);
  const [alertMsg, setAlertMsg] = useState<string | null>(null);

  const handleUpdateProgress = async (newStatus: string) => {
    setIsUpdating(true);
    setAlertMsg(null);

    try {
      await apiFetch(`/complaints/${params.id}/status`, {
        method: "POST",
        body: JSON.stringify({
          to_status: newStatus,
          notes: progressNotes,
        }),
      });

      setCurrentStatus(newStatus);
      setAlertMsg(`Status pengerjaan berhasil diperbarui menjadi ${newStatus}!`);
    } catch (err: any) {
      console.warn("Update status offline fallback:", err.message);
      setCurrentStatus(newStatus);
      setAlertMsg(`Status berhasil diperbarui ke ${newStatus} (Tercatat Lokal)!`);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar
        role="OFFICER"
        userName="Hendra Setiawan"
        agencyName="Dinas Perhubungan Kota"
      />

      <div className="flex-1 flex flex-col min-w-0">
        <DashboardTopbar
          breadcrumb="Detail Eksekusi Tugas"
          subTitle="Laporan Pelaksanaan Lapangan"
          userName="Hendra Setiawan"
          userRole="Satgas Regu 2 Dishub"
        />

        <main className="p-gutter max-w-7xl w-full mx-auto flex flex-col gap-space-lg">
          {/* Top Status & SLA Banner */}
          <div className="bg-primary text-on-primary rounded-2xl p-space-lg shadow flex flex-col md:flex-row md:items-center justify-between gap-space-md">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-tertiary-fixed">
                  TIKET: TKT-20261110-00001
                </span>
                <StatusBadge status={currentStatus} />
              </div>
              <h1 className="font-headline text-xl font-bold mt-1">
                Lampu Penerangan Jalan Umum (PJU) Padam di Depan Kampus Teknokrat Jl. ZA Pagar Alam
              </h1>
              <p className="text-xs text-on-primary-container">
                Kedaton, Kota Bandar Lampung • Koordinat: -5.381786, 105.257922
              </p>
            </div>

            <div className="flex flex-col items-start md:items-end gap-1 shrink-0">
              <span className="text-[11px] text-surface-variant font-mono">Batas Waktu SLA:</span>
              <span className="px-3 py-1 rounded-lg bg-error text-on-error font-mono font-bold text-xs shadow-sm">
                Sisa 03:42:15
              </span>
            </div>
          </div>

          {alertMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
              <span className="material-symbols-outlined text-base">check_circle</span>
              <span>{alertMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
            {/* Left Column: Complaint Detail & Timeline (7 Cols) */}
            <div className="lg:col-span-7 flex flex-col gap-space-md">
              <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-space-lg shadow-sm flex flex-col gap-space-sm">
                <h2 className="font-headline text-base font-bold text-primary">Deskripsi Pengaduan Warga</h2>
                <p className="text-xs text-on-surface leading-relaxed">
                  Lampu jalan padam sepanjang kurang lebih 100 meter di depan gerbang utama Universitas Teknokrat Indonesia. Kondisi jalan sangat gelap pada malam hari dan rawan kecelakaan bagi penyeberang jalan dan pengendara motor.
                </p>
                <div className="p-space-sm bg-surface-container-low rounded-lg text-xs text-on-surface-variant flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-base">store</span>
                  <span>Patokan: Tepat di depan pintu gerbang utama Kampus Teknokrat</span>
                </div>
              </div>

              {/* SOP Checklist */}
              <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-space-lg shadow-sm flex flex-col gap-space-sm">
                <h2 className="font-headline text-base font-bold text-primary">SOP & Ceklis Lapangan Petugas</h2>
                <div className="space-y-2 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sopChecked.cek1}
                      onChange={(e) => setSopChecked({ ...sopChecked, cek1: e.target.checked })}
                      className="rounded text-secondary focus:ring-secondary"
                    />
                    <span>1. Pemasangan rambu pengaman kerja / kerucut jalan (traffic cone)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sopChecked.cek2}
                      onChange={(e) => setSopChecked({ ...sopChecked, cek2: e.target.checked })}
                      className="rounded text-secondary focus:ring-secondary"
                    />
                    <span>2. Pengecekan arus listrik box panel kontrol dan trafo</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sopChecked.cek3}
                      onChange={(e) => setSopChecked({ ...sopChecked, cek3: e.target.checked })}
                      className="rounded text-secondary focus:ring-secondary"
                    />
                    <span>3. Penggantian bohlam lampu LED PJU dan kabel jaringan yang putus</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sopChecked.cek4}
                      onChange={(e) => setSopChecked({ ...sopChecked, cek4: e.target.checked })}
                      className="rounded text-secondary focus:ring-secondary"
                    />
                    <span>4. Uji nyala bohlam pada malam hari / simulasi sensor LDR</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column: Evidence Upload & Action Execution (5 Cols) */}
            <div className="lg:col-span-5 flex flex-col gap-space-md">
              <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-space-lg shadow-sm flex flex-col gap-space-md">
                <h2 className="font-headline text-base font-bold text-primary">Eksekusi Status Lapangan</h2>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-on-surface">
                    Catatan Progres / Hasil Tindak Lanjut
                  </label>
                  <textarea
                    rows={4}
                    value={progressNotes}
                    onChange={(e) => setProgressNotes(e.target.value)}
                    className="w-full p-3 rounded-lg bg-surface-container-low text-xs border border-outline-variant/30 focus:border-secondary outline-none leading-relaxed"
                    placeholder="Tuliskan tindakan perbaikan yang telah dilakukan tim..."
                  />
                </div>

                <div className="border border-dashed border-outline-variant/40 rounded-xl p-3 text-center flex flex-col items-center justify-center gap-1 bg-surface-container-low/30">
                  <span className="material-symbols-outlined text-secondary text-2xl">add_a_photo</span>
                  <span className="text-xs font-semibold text-primary">Unggah Foto Bukti Selesai</span>
                  <span className="text-[10px] text-outline">Bohlam PJU menyala terang di lokasi</span>
                </div>

                <div className="flex flex-col gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => handleUpdateProgress("RESOLVED")}
                    disabled={isUpdating}
                    className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-label-md text-xs font-bold shadow transition-all flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-base">task_alt</span>
                    <span>Tandai Selesai Dikerjakan (Resolved)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleUpdateProgress("IN_PROGRESS")}
                    disabled={isUpdating}
                    className="w-full py-2.5 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-primary font-label-md text-xs font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-base">sync</span>
                    <span>Simpan Catatan Perkembangan</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
