import { NextResponse } from "next/server";
import type { NextRequest } from "next/request";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Proteksi rute dashboard jika diperlukan melalui cookie / token
  // Catatan: Pada arsitektur SPA / Hybrid Next.js, pengecekan token JWT juga dijalankan pada layer client
  // melalui getStoredToken() dan redirectByRole().
  if (pathname.startsWith("/dashboard")) {
    // Izinkan navigasi normal; verifikasi sesi dijalankan di Dashboard layouts
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
