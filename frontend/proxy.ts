import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
export function proxy(request: NextRequest) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const ip = forwardedFor ? forwardedFor.split(",")[0] : request.headers.get("x-real-ip") || "IP не определен";

  // Выводим в консоль
  console.log(`апрос от IP:${ip} -> ${request.nextUrl.pathname}`);

  return NextResponse.next();
}

// Опционально: настройте, для каких маршрутов запускать middleware
export const config = {
  matcher: [
    /*
     * Запускать для всех маршрутов, кроме:
     * - API маршрутов (если не нужны)
     * - статических файлов (изображения, шрифты и т.д.)
     * - favicon.ico
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};