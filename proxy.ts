// proxy.ts
import { withAuth } from "next-auth/middleware"

export const proxy = withAuth({
  // Opciones adicionales si las necesitas
})

export const config = {
  matcher: [
    '/((?!api/auth|login|_next/static|_next/image|favicon.ico).*)',
  ]
}