"use client"

import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { UserIcon, AtSign, ShieldCheck, Trash2 } from "lucide-react"
import { usersApi } from "@/lib/api"
import type { User } from "@/lib/types"

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [msg, setMsg] = useState<string | null>(null)

  // Barra de búsqueda y filtro
  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")

  async function fetchUsers() {
    setLoading(true)
    try {
      const data = await usersApi.getAll()
      setUsers(data)
    } catch {
      setUsers([])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  async function handleDelete(user: User) {
    if (!window.confirm(`¿Seguro que quieres eliminar al usuario "${user.full_name}"?`)) return
    setDeletingId(user.id)
    try {
      await usersApi.delete(user.id)
      setMsg(`Usuario "${user.full_name}" eliminado correctamente.`)
      setUsers((prev) => prev.filter((u) => u.id !== user.id))
    } catch {
      setMsg("Error al eliminar el usuario.")
    }
    setDeletingId(null)
    setTimeout(() => setMsg(null), 2000)
  }

  // Filtrado local
  const filteredUsers = users.filter(u => {
    const matchesSearch =
      u.full_name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    const matchesRole = roleFilter === "all" || u.role === roleFilter
    return matchesSearch && matchesRole
  })

  return (
    <div className="max-w-6xl mx-auto py-10 px-2 sm:px-4">
      <Card className="shadow-md border-none bg-white">
        <CardHeader>
          <CardTitle className="text-3xl flex items-center gap-2 font-bold">
            <UserIcon className="text-blue-600 w-7 h-7" />
            Gestión de Usuarios
          </CardTitle>
          <p className="text-gray-500 text-base mt-2">Vista de usuarios registrados.</p>
          <div className="flex flex-wrap gap-2 mt-4">
            <input
              type="text"
              className="border rounded px-3 py-2 text-sm w-60"
              placeholder="Buscar usuario o email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <select
              className="border rounded px-2 py-2 text-sm"
              value={roleFilter}
              onChange={e => setRoleFilter(e.target.value)}
            >
              <option value="all">Todos los roles</option>
              <option value="admin">Admin</option>
              <option value="customer">Cliente</option>
            </select>
          </div>
        </CardHeader>
        <CardContent>
          {msg && (
            <div className="mb-4 text-green-600 text-sm animate-pulse">{msg}</div>
          )}
          {loading ? (
            <div className="text-center py-16 text-lg animate-pulse">Cargando usuarios...</div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-16">No hay usuarios encontrados.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border-separate border-spacing-y-2">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-50 to-violet-50 border-b">
                    <th className="py-4 px-6 text-left font-semibold text-gray-700 text-base tracking-wide">
                      Nombre
                    </th>
                    <th className="py-4 px-6 text-left font-semibold text-gray-700 text-base tracking-wide">
                      Email
                    </th>
                    <th className="py-4 px-6 text-left font-semibold text-gray-700 text-base tracking-wide">
                      Rol
                    </th>
                    <th className="py-4 px-6 text-left font-semibold text-gray-700 text-base tracking-wide">
                      Registro
                    </th>
                    <th className="py-4 px-6 text-left font-semibold text-gray-700 text-base tracking-wide">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u) => (
                    <tr
                      key={u.id}
                      className="bg-white/70 hover:bg-violet-50/80 transition-colors duration-200 border-b border-gray-100 shadow-sm rounded-lg group"
                    >
                      <td className="py-4 px-6 font-semibold flex items-center gap-2">
                        <UserIcon className="w-4 h-4 text-gray-400" />
                        {u.full_name}
                      </td>
                      <td className="py-4 px-6">
                        <span className="flex items-center gap-1 text-gray-800">
                          <AtSign className="w-4 h-4 text-gray-400" />
                          {u.email}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <Badge
                          className={`px-3 py-1 font-semibold text-white flex items-center gap-1 shadow ${
                            u.role === "admin"
                              ? "bg-gradient-to-r from-green-500 to-green-700"
                              : "bg-gradient-to-r from-blue-500 to-blue-700"
                          }`}
                        >
                          <ShieldCheck className="w-4 h-4" />
                          {u.role === "admin" ? "Admin" : "Cliente"}
                        </Badge>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-xs font-mono text-gray-700">
                          {u.created_at
                            ? new Date(u.created_at).toLocaleDateString()
                            : "--"}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(u)}
                          disabled={deletingId === u.id}
                          className="flex items-center gap-1 shadow hover:scale-105 transition-transform duration-150"
                        >
                          <Trash2 className="w-4 h-4" />
                          {deletingId === u.id ? "Eliminando..." : "Eliminar"}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
