"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { categoriesApi } from "@/lib/api"
import { toast } from "@/hooks/use-toast"
import { Plus, Edit, Trash2, Tag } from "lucide-react"
import type { Category } from "@/lib/types"

const initialFormState = {
  name: "",
  description: "",
  is_active: true,
  sort_order: 0,
}

export default function AdminCategoriesPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState({ ...initialFormState })
  const [search, setSearch] = useState("")

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/")
      return
    }
    fetchCategories()
    // eslint-disable-next-line
  }, [user, router])

  const fetchCategories = async () => {
    setLoading(true)
    try {
      const data = await categoriesApi.getAll()
      setCategories(data)
    } catch (error) {
      toast({ title: "Error al obtener categorías", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | boolean | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const resetForm = () => {
    setFormData({ ...initialFormState })
    setEditingCategory(null)
  }

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name || "",
      description: category.description || "",
      is_active: category.is_active,
      sort_order: category.sort_order ?? 0,
    })
    setDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const categoryData = {
      name: formData.name,
      description: formData.description || undefined,
      is_active: formData.is_active,
      sort_order: Number(formData.sort_order) || 0,
    }

    try {
      if (editingCategory) {
        await categoriesApi.update(editingCategory.id, categoryData)
        toast({ title: "Categoría actualizada correctamente" })
      } else {
        await categoriesApi.create(categoryData as Omit<Category, "id" | "created_at" | "updated_at">)
        toast({ title: "Categoría creada correctamente" })
      }
      setDialogOpen(false)
      resetForm()
      fetchCategories()
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al guardar la categoría",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (categoryId: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta categoría?")) {
      return
    }
    try {
      await categoriesApi.delete(categoryId)
      toast({ title: "Categoría eliminada correctamente" })
      fetchCategories()
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar la categoría",
        variant: "destructive",
      })
    }
  }

  // FILTRADO POR BÚSQUEDA (nombre o descripción)
  const filteredCategories = categories.filter(cat =>
    (cat.name || "").toLowerCase().includes(search.trim().toLowerCase()) ||
    (cat.description || "").toLowerCase().includes(search.trim().toLowerCase())
  )

  if (!user || user.role !== "admin") {
    return null
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Categorías</h1>
          <p className="text-gray-600 mt-2">Administra las categorías de productos de tu tienda</p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Nueva Categoría
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingCategory ? "Editar Categoría" : "Nueva Categoría"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  rows={2}
                />
              </div>
              <div>
                <Label htmlFor="sort_order">Orden</Label>
                <Input
                  id="sort_order"
                  type="number"
                  value={formData.sort_order}
                  onChange={(e) => handleInputChange("sort_order", e.target.value)}
                  placeholder="0"
                  min={0}
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => handleInputChange("is_active", e.target.checked)}
                />
                <Label htmlFor="is_active">Categoría activa</Label>
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">{editingCategory ? "Actualizar" : "Crear"} Categoría</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Barra de búsqueda */}
      <div className="mb-4 flex">
        <input
          type="text"
          className="border rounded px-3 py-2 text-sm w-72"
          placeholder="Buscar categoría por nombre o descripción..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Tag className="h-5 w-5 mr-2" />
            Lista de Categorías
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Cargando categorías...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Orden</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell>{category.description}</TableCell>
                    <TableCell>{category.sort_order}</TableCell>
                    <TableCell>
                      <Badge variant={category.is_active ? "default" : "secondary"}>
                        {category.is_active ? "Activa" : "Inactiva"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(category)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(category.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
