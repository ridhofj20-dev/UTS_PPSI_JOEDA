import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LAMPUNG REPORT — Smart Public Complaint Management System",
  description: "Platform Pengaduan Masyarakat Cerdas Kota Bandar Lampung. Lapor Mudah, Tindak Cepat, Bandar Lampung Lebih Baik.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="bg-surface font-body text-on-surface antialiased min-h-screen flex flex-col justify-between">
        <main className="flex-grow">{children}</main>
        <footer className="w-full bg-primary-container text-on-primary py-space-md border-t border-outline-variant/20">
          <div className="max-w-7xl mx-auto px-margin flex flex-col md:flex-row items-center justify-between gap-space-sm text-center md:text-left">
            <div className="flex items-center gap-space-sm">
              <img
                src="/assets/logo-pemkot-bandar-lampung.jpg"
                alt="Logo Pemerintah Kota Bandar Lampung"
                className="h-7 w-auto object-contain rounded"
              />
              <img
                src="/assets/logo-teknokrat.png"
                alt="Logo Universitas Teknokrat Indonesia"
                className="h-7 w-auto object-contain"
              />
              <span className="font-headline-sm text-sm tracking-tight text-surface-bright font-bold">
                LAMPUNG REPORT
              </span>
            </div>
            <p className="font-body-sm text-xs text-on-primary-container">
              Copyright©2026 by Ridho Fatahilah Joeda and Dr. Erliyan Redy Susanto, M.Kom
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}

