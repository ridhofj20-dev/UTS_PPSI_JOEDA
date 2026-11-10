"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { DashboardSidebar } from "@/components/layouts/DashboardSidebar";
import { DashboardTopbar } from "@/components/layouts/DashboardTopbar";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { apiFetch } from "@/lib/api-client";

export default function VerificationExecutionPage() {
  const router = useRouter();
  const routeParams = useParams();
  const complaintId = (routeParams?.id as string) || "55555555-5555-5555-5555-555555555555";

  const [decision, setDecision] = useState<"ACCEPT" | "REJECT" | "FORWARD">("ACCEPT");
  const [priority, setPriority] = useState("HIGH");
  const [officerId, setOfficerId] = useState("77777777-7777-7777-7777-777777777777");
  const [rejectionReason, setRejectionReason] = useState("");
  const [verificationNotes, setVerificationNotes] = useState(
    "Laporan diverifikasi valid. Titik lokasi dan foto bukti bersesuaian dengan jaringan penerangan jalan Dishub."
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alertMsg, setAlertMsg] = useState<string | null>(null);

  const handleExecuteVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setAlertMsg(null);

    try {
      if (decision === "ACCEPT") {
        // Step 1: Verify
        await apiFetch(`/complaints/${complaintId}/verify`, {
          method: "POST",
          body: JSON.stringify({ priority, notes: verificationNotes }),
        });

        // Step 2: Assign Officer
        await apiFetch(`/complaints/${complaintId}/assign`, {
          method: "POST",
          body: JSON.stringify({
            officer_id: officerId,
            notes: "Ditugaskan ke Satgas Regu Lapangan",
          }),
        });

        setAlertMsg("Pengaduan berhasil diverifikasi dan didisposisikan ke petugas lapangan!");
      } else if (decision === "REJECT") {
        if (!rejectionReason.trim()) {
          setAlertMsg("Alasan penolakan wajib diisi!");
          setIsSubmitting(false);
          return;
        }

        await apiFetch(`/complaints/${complaintId}/reject`, {
          method: "POST",
          body: JSON.stringify({ reason: rejectionReason }),
        });

        setAlertMsg("Pengaduan berhasil ditolak dengan alasan tercatat!");
      }

      setTimeout(() => {
        router.push("/dashboard/admin-opd");
      }, 1500);
    } catch (err: any) {
      console.warn("Backend verification call fallback:", err.message);
      setAlertMsg("Tindakan verifikasi berhasil disimpan (Simulasi Offline)!");
      setTimeout(() => {
        router.push("/dashboard/admin-opd");
      }, 1500);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar
        role="AGENCY_ADMIN"
        userName="Ir. Hendra Kusuma, S.T."
        agencyName="Dinas Perhubungan Kota"
      />

      <div className="flex-1 flex flex-col min-w-0">
        <DashboardTopbar
          breadcrumb="Pusat Verifikasi & Disposisi"
          subTitle="Penilaian Kelayakan & Disposisi Satgas"
          userName="Ir. Hendra Kusuma, S.T."
          userRole="Admin Koordinator OPD Dishub"
        />

        <main className="p-gutter max-w-7xl w-full mx-auto flex flex-col gap-space-lg">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
            <div>
              <span className="text-[11px] font-bold text-secondary uppercase tracking-widest font-mono">
                TIKET: TKT-20261110-00001
              </span>
              <h1 className="font-headline text-2xl font-bold text-primary mt-0.5">
                Eksekusi Verifikasi & Disposisi Pengaduan
              </h1>
            </div>
            <StatusBadge status="UNDER_REVIEW" />
          </div>

          {alertMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
              <span className="material-symbols-outlined text-base">check_circle</span>
              <span>{alertMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
            {/* Left: Incident Data & Evidence (7 Cols) */}
            <div className="lg:col-span-7 flex flex-col gap-space-md">
              <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-space-lg shadow-sm flex flex-col gap-space-sm">
                <span className="text-xs font-bold text-secondary">Kategori: Lampu Jalan & Traffic Light</span>
                <h2 className="font-headline text-lg font-bold text-primary">
                  Lampu Penerangan Jalan Umum (PJU) Padam di Depan Kampus Teknokrat Jl. ZA Pagar Alam
                </h2>
                <p className="text-xs text-on-surface leading-relaxed">
                  Lampu jalan padam sepanjang kurang lebih 100 meter di depan pintu gerbang utama Universitas Teknokrat Indonesia. Kondisi jalan sangat gelap pada malam hari dan rawan kecelakaan penyeberang jalan.
                </p>

                <div className="grid grid-cols-2 gap-space-sm pt-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-surface-container-low border border-outline-variant/20">
                    <span className="text-[10px] text-outline block">Wilayah Administratif:</span>
                    <span className="font-semibold text-primary">Kec. Kedaton, Kota Bandar Lampung</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-surface-container-low border border-outline-variant/20">
                    <span className="text-[10px] text-outline block">Koordinat GPS:</span>
                    <span className="font-mono font-semibold text-primary">-5.381786, 105.257922</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-surface-container-low border border-outline-variant/20 text-xs">
                  <span className="text-[10px] text-outline block">Patokan Lokasi:</span>
                  <span className="text-on-surface">Jl. ZA. Pagar Alam No.9-11, depan gerbang Teknokrat</span>
                </div>
              </div>
            </div>

            {/* Right: Decision Execution Form (5 Cols) */}
            <div className="lg:col-span-5 flex flex-col gap-space-md">
              <form onSubmit={handleExecuteVerification} className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-space-lg shadow-sm flex flex-col gap-space-md">
                <h2 className="font-headline text-base font-bold text-primary">Form Tindakan Verifikator</h2>

                {/* Decision Radio Options */}
                <div className="space-y-2 text-xs">
                  <label className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${decision === 'ACCEPT' ? 'border-secondary bg-secondary/5 font-semibold text-primary' : 'border-outline-variant/30'}`}>
                    <input
                      type="radio"
                      name="decision"
                      value="ACCEPT"
                      checked={decision === "ACCEPT"}
                      onChange={() => setDecision("ACCEPT")}
                      className="mt-0.5 text-secondary focus:ring-secondary"
                    />
                    <div>
                      <div className="font-bold">Terima & Verifikasi Pengaduan</div>
                      <div className="text-[11px] text-on-surface-variant font-normal">Laporan valid dan memenuhi syarat untuk ditindaklanjuti regu lapangan.</div>
                    </div>
                  </label>

                  <label className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${decision === 'REJECT' ? 'border-error bg-error/5 font-semibold text-error' : 'border-outline-variant/30'}`}>
                    <input
                      type="radio"
                      name="decision"
                      value="REJECT"
                      checked={decision === "REJECT"}
                      onChange={() => setDecision("REJECT")}
                      className="mt-0.5 text-error focus:ring-error"
                    />
                    <div>
                      <div className="font-bold">Tolak Pengaduan</div>
                      <div className="text-[11px] text-on-surface-variant font-normal">Laporan palsu, tidak jelas, atau bukan kewenangan Pemkot.</div>
                    </div>
                  </label>
                </div>

                {/* Conditional Fields based on Decision */}
                {decision === "ACCEPT" ? (
                  <div className="space-y-space-md border-t border-outline-variant/20 pt-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-semibold text-on-surface">Tingkat Prioritas Tindak Lanjut</label>
                      <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                        className="w-full h-10 px-3 rounded-lg bg-surface-container-low text-xs border border-outline-variant/30 font-semibold"
                      >
                        <option value="LOW">Rendah (Low - SLA 72 Jam)</option>
                        <option value="MEDIUM">Sedang (Medium - SLA 48 Jam)</option>
                        <option value="HIGH">Tinggi (High - SLA 24 Jam)</option>
                        <option value="URGENT">Darurat (Urgent - SLA 6 Jam)</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-semibold text-on-surface">Pilih Petugas Satgas Lapangan</label>
                      <select
                        value={officerId}
                        onChange={(e) => setOfficerId(e.target.value)}
                        className="w-full h-10 px-3 rounded-lg bg-surface-container-low text-xs border border-outline-variant/30 font-semibold"
                      >
                        <option value="77777777-7777-7777-7777-777777777777">
                          Hendra Setiawan — Satgas Regu 2 Kedaton (Siaga)
                        </option>
                        <option value="officer-2">
                          Agus Prabowo — Satgas Regu 1 Way Halim (Siaga)
                        </option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-semibold text-on-surface">Catatan Verifikasi</label>
                      <textarea
                        rows={3}
                        value={verificationNotes}
                        onChange={(e) => setVerificationNotes(e.target.value)}
                        className="w-full p-2.5 rounded-lg bg-surface-container-low text-xs border border-outline-variant/30 outline-none leading-relaxed"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="border-t border-outline-variant/20 pt-3 flex flex-col gap-1">
                    <label className="text-xs font-semibold text-error">Alasan Penolakan Pengaduan (Wajib)</label>
                    <textarea
                      rows={3}
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="Jelaskan alasan penolakan secara jelas agar pelapor memahami penyebabnya..."
                      required
                      className="w-full p-2.5 rounded-lg bg-surface-container-low text-xs border border-rose-300 focus:border-error outline-none leading-relaxed"
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3 rounded-xl font-label-md text-xs font-bold text-white shadow transition-all flex items-center justify-center gap-2 mt-2 ${
                    decision === "ACCEPT" ? "bg-secondary hover:bg-secondary-container" : "bg-error hover:bg-rose-700"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <span className="material-symbols-outlined text-base animate-spin">progress_activity</span>
                      <span>Menyimpan Disposisi...</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-base">
                        {decision === "ACCEPT" ? "assignment_turned_in" : "cancel"}
                      </span>
                      <span>{decision === "ACCEPT" ? "Verifikasi & Tugaskan Satgas" : "Tolak Laporan Ini"}</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

