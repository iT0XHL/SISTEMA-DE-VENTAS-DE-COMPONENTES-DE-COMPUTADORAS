"use client"

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User as UserIcon, Mail, Shield, Calendar } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { usersApi, ordersApi } from "@/lib/api"
import type { Order, User } from "@/lib/types"

export default function ProfilePage() {
  const { user } = useAuth()
  const router = useRouter()

  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({ full_name: "", email: "" })
  const [ordersCount, setOrdersCount] = useState(0)
  const [totalSpent, setTotalSpent] = useState(0)

  // Cuando carga el componente, si no hay usuario lo mandamos a login,
  // si lo hay, traemos sus datos reales y estadísticas
  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    // Carga perfil
    usersApi
      .getById(user.id)
      .then((profile) => {
        if (profile) {
          setFormData({
            full_name: profile.full_name,
            email: profile.email,
          })
        }
      })
      .catch((err) => {
        console.error("Error al cargar perfil:", err)
      })

    // Carga estadísticas de órdenes
    ordersApi
      .getAll()
      .then((orders: Order[]) => {
        const mine = orders.filter((o) => o.user_id === user.id)
        setOrdersCount(mine.length)
        setTotalSpent(mine.reduce((sum, o) => sum + o.total_amount, 0))
      })
      .catch((err) => {
        console.error("Error al cargar órdenes:", err)
      })
  }, [user, router])

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    if (!user) return
    try {
      const updated: User = await usersApi.update(user.id, {
        full_name: formData.full_name,
        email: formData.email,
      })
      setFormData({
        full_name: updated.full_name,
        email: updated.email,
      })
      toast({
        title: "Perfil actualizado",
        description: "Tus datos se han guardado correctamente",
      })
      setIsEditing(false)
    } catch (err: any) {
      toast({
        title: "Error al actualizar",
        description:
          err instanceof Error
            ? err.message
            : "No se pudo actualizar tu perfil",
        variant: "destructive",
      })
    }
  }

  const handleCancel = () => {
    if (user) {
      setFormData({
        full_name: user.full_name,
        email: user.email,
      })
    }
    setIsEditing(false)
  }

  if (!user) {
    return null
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Encabezado */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Mi Perfil</h1>
        <p className="text-gray-600">Gestiona tu información personal</p>
      </div>

      {/* Información personal */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <UserIcon className="h-5 w-5 mr-2" /> Información Personal
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="full_name">Nombre Completo</Label>
            {isEditing ? (
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => handleInputChange("full_name", e.target.value)}
              />
            ) : (
              <p className="mt-1 text-gray-900">{formData.full_name}</p>
            )}
          </div>

          <div>
            <Label htmlFor="email">Correo Electrónico</Label>
            {isEditing ? (
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
            ) : (
              <p className="mt-1 text-gray-900 flex items-center">
                <Mail className="h-4 w-4 mr-2 text-gray-500" />
                {formData.email}
              </p>
            )}
          </div>

          <div>
            <Label>Rol de Usuario</Label>
            <p className="mt-1 text-gray-900 flex items-center">
              <Shield className="h-4 w-4 mr-2 text-gray-500" />
              {user.role === "admin" ? "Administrador" : "Cliente"}
            </p>
          </div>

          <div className="flex space-x-2 pt-4">
            {isEditing ? (
              <>
                <Button onClick={handleSave}>Guardar Cambios</Button>
                <Button variant="outline" onClick={handleCancel}>
                  Cancelar
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)}>Editar Perfil</Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas de cuenta */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2" /> Estadísticas de Cuenta
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{ordersCount}</p>
              <p className="text-sm text-gray-600">Pedidos Realizados</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">
                S/ {totalSpent.toFixed(2)}
              </p>
              <p className="text-sm text-gray-600">Total Gastado</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
