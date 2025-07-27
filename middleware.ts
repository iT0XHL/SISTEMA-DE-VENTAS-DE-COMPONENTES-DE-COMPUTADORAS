import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtVerify } from "jose"

// PROTIP: Para debug en local, puedes hardcodear el secret temporalmente así:
// const secret = new TextEncoder().encode("TU_SECRET_AQUI")

// Para producción usa siempre la variable de entorno NEXT_PUBLIC_SECRET_KEY
const secret = new TextEncoder().encode(process.env.NEXT_PUBLIC_SECRET_KEY || process.env.SECRET_KEY || "DEV_SECRET")

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  const token = req.cookies.get("token")?.value

  if (pathname.startsWith("/admin")) {
    if (!token) {
      // No hay token en cookie, redirige a login
      const url = req.nextUrl.clone()
      url.pathname = "/login"
      return NextResponse.redirect(url)
    }

    try {
      // Intenta verificar el JWT
      const { payload } = await jwtVerify(token, secret)

      // Si el usuario NO es admin, redirige al home
      if (payload.role !== "admin") {
        const url = req.nextUrl.clone()
        url.pathname = "/"
        return NextResponse.redirect(url)
      }

      // Si todo bien, deja pasar
      return NextResponse.next()
    } catch (err) {
      // JWT inválido o expirado
      const url = req.nextUrl.clone()
      url.pathname = "/login"
      return NextResponse.redirect(url)
    }
  }

  // Si no es /admin, pasa normal
  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
