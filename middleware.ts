// middleware.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const PUBLIC_ROUTES = [
  "/",
  "/login",
  "/register-login",
  "/register",
  "/verify-otp",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
  "/verify-otp-password",
];

const PUBLIC_FILE =
  /\.(?:png|jpe?g|gif|webp|svg|ico|bmp|avif|mp3|wav|ogg|mp4|webm|txt|xml|json|js|css|map|woff2?|ttf|eot)$/i;

export function middleware(request: NextRequest) {
  const token = request.cookies.get("sw99_token")?.value;
  const { pathname } = request.nextUrl;

  // ✅ API ও preflight একদমই ব্লক করবেন না
  if (pathname.startsWith("/api") || request.method === "OPTIONS") {
    return NextResponse.next();
  }

  // ✅ স্ট্যাটিক/পাবলিক অ্যাসেট সবসময় allow
  if (
    pathname.startsWith("/_next/static") ||
    pathname.startsWith("/_next/image") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/assets") ||
    pathname.startsWith("/icons") ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    pathname.endsWith(".webmanifest") ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

  // ✅ টোকেন নেই এবং প্রাইভেট রুট
  if (!token && !isPublicRoute) {
    // API নয়, কিন্তু non-GET হলে রিডাইরেক্ট না করে 401 দিন (form/XHR সেফটি)
    if (request.method !== "GET") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const url = request.nextUrl.clone();
    url.pathname = "/register-login?tab=signin";
    url.searchParams.set("next", pathname);
    // ✅ 303 দিলে মেথড GET হয়ে যাবে (307 নয়)
    return NextResponse.redirect(url, 303);
  }

  // ✅ টোকেন থাকলে পাবলিক পেজে ঢুকতে চাইলে ড্যাশবোর্ডে দিন
  if (token && isPublicRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

// ✅ matcher-এ /api এক্সক্লুড করুন
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|manifest.webmanifest|.*\\..*).*)",
  ],
};
