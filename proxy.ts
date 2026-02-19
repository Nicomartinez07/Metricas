// proxy.ts
import { withAuth } from "next-auth/middleware"

export const proxy = withAuth({
  // Opciones adicionales si las necesitas
})

export { default } from "next-auth/middleware"

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - /api/webhook (para Google Forms)
     * - /api/auth (NextAuth)
     * - /login
     * - _next/static
     * - _next/image
     * - favicon.ico
     * /public/MGlogo_black.png
     */
    '/((?!api/webhook|api/auth|login|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|ico|webp)$).*)', ]
}