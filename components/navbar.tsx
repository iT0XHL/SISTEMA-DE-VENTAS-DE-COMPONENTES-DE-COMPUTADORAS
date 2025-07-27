"use client"

import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { useCart } from "@/contexts/cart-context"
import { Button } from "@/components/ui/button"
import { ShoppingCart, User, LogOut, Settings, Sparkles } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle" // <-- Importa el botón de tema

export function Navbar() {
  const { user, logout } = useAuth()
  const { itemCount } = useCart()
  const router = useRouter()

  return (
    <nav className="bg-gradient-to-r from-white via-blue-50 to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-900 shadow-xl border-b border-white/20 dark:border-gray-700/40 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="group flex items-center space-x-2">
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent animate-gradient-x group-hover:scale-105 transition-transform duration-300">
                PCDos2
              </div>
              <Sparkles className="h-5 w-5 text-purple-500 animate-pulse group-hover:animate-spin transition-all duration-300" />
            </Link>
            <div className="hidden md:flex space-x-6">
              <Link
                href="/catalog"
                className="text-gray-700 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 hover:scale-105 font-medium relative group"
              >
                Productos
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link
                href="/contact"
                className="text-gray-700 dark:text-gray-100 hover:text-green-600 dark:hover:text-green-400 transition-all duration-300 hover:scale-105 font-medium relative group"
              >
                Contacto
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-green-500 to-emerald-500 group-hover:w-full transition-all duration-300"></span>
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <ThemeToggle /> {/* Botón de tema SIEMPRE visible */}
            {user ? (
              <>
                <Link href="/cart" className="relative group">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 border-2 border-blue-200 dark:border-gray-700 hover:border-purple-300 hover:from-blue-100 hover:to-purple-100 dark:hover:border-purple-600 dark:hover:from-gray-700 dark:hover:to-gray-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    <ShoppingCart className="h-4 w-4 group-hover:animate-bounce" />
                    {itemCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse shadow-lg">
                        {itemCount}
                      </span>
                    )}
                  </Button>
                </Link>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-900 border-2 border-green-200 dark:border-gray-700 hover:border-emerald-300 hover:from-green-100 hover:to-emerald-100 dark:hover:border-emerald-600 dark:hover:from-gray-700 dark:hover:to-gray-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                      <User className="h-4 w-4 mr-2" />
                      <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent font-semibold">
                        {user.full_name}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-0 shadow-2xl rounded-2xl p-2"
                  >
                    <DropdownMenuItem
                      asChild
                      className="rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-gray-800 dark:hover:to-gray-900 transition-all duration-300"
                    >
                      <Link href="/profile" className="flex items-center">
                        <User className="h-4 w-4 mr-2 text-blue-500" />
                        Mi Perfil
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      asChild
                      className="rounded-xl hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 dark:hover:from-gray-800 dark:hover:to-gray-900 transition-all duration-300"
                    >
                      <Link href="/orders" className="flex items-center">
                        <ShoppingCart className="h-4 w-4 mr-2 text-green-500" />
                        Mis Pedidos
                      </Link>
                    </DropdownMenuItem>
                    {user.role === "admin" && (
                      <DropdownMenuItem
                        onClick={() => router.push("/admin")}
                        className="rounded-xl hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 dark:hover:from-gray-800 dark:hover:to-gray-900 transition-all duration-300"
                      >
                        <Settings className="h-4 w-4 mr-2 text-purple-500" />
                        Panel Admin
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      onClick={logout}
                      className="rounded-xl hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 dark:hover:from-gray-800 dark:hover:to-gray-900 transition-all duration-300 text-red-600"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Cerrar Sesión
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="space-x-2">
                <Link href="/login">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 border-2 border-blue-200 dark:border-gray-700 hover:border-purple-300 hover:from-blue-100 hover:to-purple-100 dark:hover:border-purple-600 dark:hover:from-gray-700 dark:hover:to-gray-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    Iniciar Sesión
                  </Button>
                </Link>
                <Link href="/register">
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white border-0 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Registrarse
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
