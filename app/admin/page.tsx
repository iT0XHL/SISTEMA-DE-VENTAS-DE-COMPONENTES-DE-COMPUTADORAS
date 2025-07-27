"use client"

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { statsApi } from "@/lib/api"
import { Package, Users, ShoppingCart, DollarSign } from "lucide-react"
import Link from "next/link"

export default function AdminPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isLoading) return // Espera a que el contexto termine de hidratarse

    if (!user) {
      router.push("/login")
      return
    }

    if (user.role !== "admin") {
      router.push("/")
      return
    }

    fetchStats()
    // eslint-disable-next-line
  }, [user, isLoading])

  const fetchStats = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await statsApi.getAdminStats()
      setStats(data)
    } catch (error: any) {
      setError(error.message || "Error al obtener estadísticas")
    } finally {
      setLoading(false)
    }
  }

  // Mientras el contexto de auth se hidrata, evita mostrar la página
  if (isLoading) return null
  if (!user || user.role !== "admin") return null

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
        <p className="text-gray-600 mt-2">Gestiona tu tienda de componentes de PC</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-800 rounded">{error}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Productos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "..." : stats.totalProducts}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "..." : stats.totalUsers}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pedidos</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "..." : stats.totalOrders}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "..." : `S/ ${stats.totalRevenue.toFixed(2)}`}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Gestión de Productos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Administra el inventario, precios y disponibilidad de productos
            </p>
            <Link href="/admin/products">
              <Button className="w-full">Gestionar Productos</Button>
            </Link>
          </CardContent>
        </Card>
<Card>
  <CardHeader>
    <CardTitle>Gestión de Categorías</CardTitle>
  </CardHeader>
  <CardContent>
    <p className="text-gray-600 mb-4">
      Administra las categorías de productos disponibles en la tienda
    </p>
    <Link href="/admin/categories">
      <Button className="w-full">Gestionar Categorías</Button>
    </Link>
  </CardContent>
</Card>

        <Card>
          <CardHeader>
            <CardTitle>Gestión de Pedidos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Revisa y gestiona los pedidos de los clientes
            </p>
            <Link href="/admin/orders">
              <Button className="w-full">Ver Pedidos</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
  <CardHeader>
    <CardTitle>Gestión de Usuarios</CardTitle>
  </CardHeader>
  <CardContent>
    <p className="text-gray-600 mb-4">
      Administra las cuentas de usuarios
    </p>
    <Link href="/admin/users">
      <Button className="w-full">Gestionar Usuarios</Button>
    </Link>
  </CardContent>
</Card>

      </div>
    </div>
  )
}
