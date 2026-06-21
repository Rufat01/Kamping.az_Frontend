import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // Google ilə qeydiyyatdan keçmiş, profili tamamlanmamış istifadəçiləri yönləndir
  if (token && token.profileCompleted === false && !pathname.startsWith("/complete-profile")) {
    return NextResponse.redirect(new URL("/complete-profile", req.url));
  }

  // Profili artıq tamamlanmış istifadəçilərin /complete-profile-ə girişini bağla
  if (token && token.profileCompleted === true && pathname.startsWith("/complete-profile")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Dashboard qorunması
  if (pathname.startsWith("/dashboard") && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon\\.ico|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.svg|.*\\.webp|.*\\.ico).*)",
  ],
};
