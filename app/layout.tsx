import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/contexts/auth-context"
import { CartProvider } from "@/contexts/cart-context"
import { Navbar } from "@/components/navbar"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "next-themes"        // <-- Agrega esto

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "PCDos2 - Componentes de PC",
  description: "Tienda online de componentes para computadoras",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      {/* <body className={inter.className}> */}
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={true}>
          <AuthProvider>
            <CartProvider>
              <Navbar />
              <main>{children}</main>
              <Toaster />
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
