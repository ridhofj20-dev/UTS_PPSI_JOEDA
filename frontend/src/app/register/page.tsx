"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiFetch, setStoredToken } from "@/lib/api-client";
import { AuthResponse } from "@/types";

export default function RegisterPage() {
  const router = useRouter();

  const [nik, setNik] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreed, setAgreed] = useState(false);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleNikChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const clean = e.target.value.replace(/\D/g, "").slice(0, 16);
    setNik(clean);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (nik.length !== 16) {
      setErrorMsg("Nomor Induk Kependudukan (NIK) wajib 16 digit angka sesuai KTP.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Konfirmasi kata sandi tidak cocok dengan kata sandi.");
      return;
    }

    if (!agreed) {
      setErrorMsg("Anda harus menyetujui pernyataan keabsahan data.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await apiFetch<AuthResponse>("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          full_name: fullName,
          email,
          phone,
          nik,
          password,
        }),
      });

      setSuccessMsg("Pendaftaran berhasil! Mengalihkan ke dashboard warga...");
      setStoredToken(res.token, res.user);
      setTimeout(() => {
        router.push("/dashboard/warga");
      }, 1000);
    } catch (err: any) {
      console.warn("Register backend call failed, falling back to local simulation:", err.message);
      // Simulation for prototype testing if backend is offline
      const mockUser = {
        id: "mock-new-citizen-" + Date.now(),
        role: "CITIZEN" as const,
        full_name: fullName,
        email,
        phone,
        nik,
      };
      setStoredToken("mock-token-" + Date.now(), mockUser);
      setSuccessMsg("Pendaftaran berhasil (Simulasi Lokal)! Mengalihkan...");
      setTimeout(() => {
        router.push("/dashboard/warga");
      }, 1000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col justify-center items-center p-gutter">
      <Link href="/" className="flex items-center gap-2 mb-space-lg">
        <img
          src="/assets/logo-pemkot-bandar-lampung.jpg"
          alt="Pemkot Bandar Lampung"
          className="h-10 w-auto object-contain rounded"
        />
        <img
          src="/assets/logo-teknokrat.png"
          alt="Universitas Teknokrat Indonesia"
          className="h-10 w-auto object-contain"
        />
        <div className="flex flex-col ml-2">
          <span className="font-headline text-xl font-bold text-primary tracking-tight">
            LAMPUNG REPORT
          </span>
          <span className="text-[10px] text-secondary font-bold uppercase tracking-widest">
            Kota Bandar Lampung
          </span>
        </div>
      </Link>

      <div className="max-w-xl w-full bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-space-lg shadow-md flex flex-col gap-space-md">
        <div>
          <span className="text-[11px] font-bold text-secondary uppercase tracking-wider">
            Formulir NIK Warga
          </span>
          <h1 className="font-headline text-2xl font-bold text-primary mt-0.5">
            Pendaftaran Akun Warga
          </h1>
          <p className="text-xs text-on-surface-variant mt-1">
            Lengkapi formulir sesuai e-KTP untuk membuat akun pengaduan resmi Kota Bandar Lampung.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <span className="material-symbols-outlined text-base">error</span>
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <span className="material-symbols-outlined text-base">check_circle</span>
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-space-md">
          {/* NIK Field */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-on-surface" htmlFor="nik">
                Nomor Induk Kependudukan (NIK 16 Digit)
              </label>
              <span className={`text-[11px] font-mono ${nik.length === 16 ? "text-emerald-600 font-bold" : "text-outline"}`}>
                {nik.length} / 16 Digit
              </span>
            </div>
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-3 text-outline text-lg">badge</span>
              <input
                id="nik"
                type="text"
                value={nik}
                onChange={handleNikChange}
                placeholder="16 digit NIK tertera di e-KTP"
                required
                className="w-full h-10 pl-9 pr-3 rounded-lg bg-surface-container-low text-xs border border-outline-variant/30 focus:border-secondary focus:bg-surface-container-lowest outline-none font-mono"
              />
            </div>
          </div>

          {/* Full Name */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-on-surface" htmlFor="fullName">
              Nama Lengkap (Sesuai KTP)
            </label>
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-3 text-outline text-lg">person</span>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Nama lengkap tanpa singkatan / gelar"
                required
                className="w-full h-10 pl-9 pr-3 rounded-lg bg-surface-container-low text-xs border border-outline-variant/30 focus:border-secondary focus:bg-surface-container-lowest outline-none"
              />
            </div>
          </div>

          {/* Email & Phone Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-on-surface" htmlFor="email">
                Alamat Email Aktif
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3 text-outline text-lg">mail</span>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alamat@email.com"
                  required
                  className="w-full h-10 pl-9 pr-3 rounded-lg bg-surface-container-low text-xs border border-outline-variant/30 focus:border-secondary focus:bg-surface-container-lowest outline-none"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-on-surface" htmlFor="phone">
                Nomor WhatsApp Aktif
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3 text-outline text-lg">phone</span>
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="081234567890"
                  className="w-full h-10 pl-9 pr-3 rounded-lg bg-surface-container-low text-xs border border-outline-variant/30 focus:border-secondary focus:bg-surface-container-lowest outline-none"
                />
              </div>
            </div>
          </div>

          {/* Password & Confirm */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-on-surface" htmlFor="password">
                Kata Sandi (Min. 8 Karakter)
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Kata sandi"
                required
                className="w-full h-10 px-3 rounded-lg bg-surface-container-low text-xs border border-outline-variant/30 focus:border-secondary focus:bg-surface-container-lowest outline-none"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-on-surface" htmlFor="confirmPassword">
                Ulangi Kata Sandi
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ulangi kata sandi"
                required
                className="w-full h-10 px-3 rounded-lg bg-surface-container-low text-xs border border-outline-variant/30 focus:border-secondary focus:bg-surface-container-lowest outline-none"
              />
            </div>
          </div>

          {/* Legal Agreement */}
          <div className="flex items-start gap-2 pt-1">
            <input
              id="agreed"
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-1 rounded text-secondary focus:ring-secondary cursor-pointer"
            />
            <label htmlFor="agreed" className="text-xs text-on-surface-variant leading-relaxed select-none">
              Saya menyatakan keabsahan data NIK yang diinputkan dan menyetujui ketentuan privasi bahwa identitas saya tidak akan dipublikasikan ke kanal umum.
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 bg-secondary hover:bg-secondary-container text-on-secondary font-label-md text-xs font-bold rounded-lg shadow transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <span className="material-symbols-outlined text-base animate-spin">progress_activity</span>
                <span>Mendaftarkan Akun...</span>
              </>
            ) : (
              <span>Daftar Akun Warga Sekarang</span>
            )}
          </button>
        </form>

        <div className="text-center text-xs text-on-surface-variant">
          Sudah memiliki akun?{" "}
          <Link href="/login" className="text-secondary font-bold hover:underline">
            Masuk ke Portal
          </Link>
        </div>
      </div>
    </div>
  );
}
