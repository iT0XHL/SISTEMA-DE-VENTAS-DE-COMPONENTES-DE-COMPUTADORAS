"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { productsApi, categoriesApi } from "@/lib/api"
import { toast } from "@/hooks/use-toast"
import { Plus, Edit, Trash2, Package, XCircle } from "lucide-react"
import Image from "next/image"
import type { Product, Category } from "@/lib/types"

const initialFormState = {
  product_code: "",
  name: "",
  description: "",
  long_description: "",
  price: "",
  stock: "",
  min_stock: "",
  category_id: "",
  brand: "",
  model: "",
  image_url: "",
  image_urls: "",
  specifications: "",
  features: "",
  is_active: true,
  weight: "",
  dimensions: "",
  warranty_months: "",
}

// Parsear especificaciones "clave: valor, clave2: valor2"
function parseSpecs(str: string) {
  const obj: Record<string, any> = {}
  str.split(",").forEach((item) => {
    const [key, value] = item.split(":").map((s) => s.trim())
    if (key) obj[key] = value ?? true
  })
  return obj
}

// Parsear características "Bluetooth, RGB"
function parseFeatures(str: string) {
  const obj: Record<string, boolean> = {}
  str.split(",").forEach((item) => {
    const key = item.trim()
    if (key) obj[key] = true
  })
  return obj
}

export default function AdminProductsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [brands, setBrands] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState({ ...initialFormState })

  // Filtros y búsqueda
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [brandFilter, setBrandFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all") // <-- Añadido filtro de estado

  // Obtener categorías y marcas una sola vez al cargar (solo si eres admin)
  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/")
      return
    }
    fetchCategories()
    fetchBrands()
    // eslint-disable-next-line
  }, [user, router])

  // Obtener productos cada vez que cambie la búsqueda o los filtros
  useEffect(() => {
    if (!user || user.role !== "admin") return
    fetchProducts()
    // eslint-disable-next-line
  }, [search, categoryFilter, brandFilter, statusFilter]) // <-- Añadido statusFilter

  // --- FUNCIONES FETCH ---
  const fetchProducts = async () => {
    setLoading(true)
    try {
      const filters: any = {}
      if (search) filters.search = search
      if (categoryFilter !== "all") filters.category = categoryFilter
      if (brandFilter !== "all") filters.brand = brandFilter
      if (statusFilter !== "all") {
        filters.is_active = statusFilter === "active" ? "true" : "false" // <-- Añadido
      }
      const data = await productsApi.getAll(filters)
      setProducts(data)
    } catch (error) {
      console.error("Error fetching products:", error)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const data = await categoriesApi.getAll()
      setCategories(data)
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }

  const fetchBrands = async () => {
    try {
      const data = await productsApi.getBrands()
      setBrands(data)
    } catch (error) {
      console.error("Error fetching brands:", error)
      setBrands([])
    }
  }

  // --- HANDLERS FORM ---
  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const resetForm = () => {
    setFormData({ ...initialFormState })
    setEditingProduct(null)
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      product_code: product.product_code || "",
      name: product.name || "",
      description: product.description || "",
      long_description: product.long_description || "",
      price: product.price?.toString() || "",
      stock: product.stock?.toString() || "",
      min_stock: product.min_stock?.toString() || "",
      category_id: product.category_id || "",
      brand: product.brand || "",
      model: product.model || "",
      image_url: product.image_url || "",
      image_urls: (product.image_urls || []).join(", "),
      specifications: product.specifications
        ? Object.entries(product.specifications)
            .map(([k, v]) => `${k}: ${v}`)
            .join(", ")
        : "",
      features: product.features
        ? Object.keys(product.features)
            .filter((k) => product.features && product.features[k])
            .join(", ")
        : "",
      is_active: product.is_active,
      weight: product.weight?.toString() || "",
      dimensions: product.dimensions || "",
      warranty_months: product.warranty_months?.toString() || "",
    })
    setDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    let parsedImageUrls: string[] | undefined = undefined
    if (formData.image_urls.trim()) {
      parsedImageUrls = formData.image_urls.split(",").map(s => s.trim()).filter(Boolean)
    }

    const productData = {
      product_code: formData.product_code,
      name: formData.name,
      description: formData.description || null,
      long_description: formData.long_description || null,
      price: Number(formData.price),
      stock: Number(formData.stock),
      min_stock: formData.min_stock ? Number(formData.min_stock) : undefined,
      category_id: formData.category_id || undefined,
      brand: formData.brand || undefined,
      model: formData.model || undefined,
      image_url: formData.image_url || undefined,
      image_urls: parsedImageUrls,
      specifications: parseSpecs(formData.specifications),
      features: parseFeatures(formData.features),
      is_active: formData.is_active,
      weight: formData.weight ? Number(formData.weight) : undefined,
      dimensions: formData.dimensions || undefined,
      warranty_months: formData.warranty_months ? Number(formData.warranty_months) : undefined,
    }

    try {
      if (editingProduct) {
        await productsApi.update(editingProduct.id, productData)
        toast({ title: "Producto actualizado correctamente" })
      } else {
        await productsApi.create(productData)
        toast({ title: "Producto creado correctamente" })
      }
      setDialogOpen(false)
      resetForm()
      fetchProducts()
      fetchBrands() // Opcional: refresca marcas al crear/editar producto
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al guardar el producto",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (productId: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este producto?")) {
      return
    }

    try {
      await productsApi.delete(productId)
      toast({ title: "Producto eliminado correctamente" })
      fetchProducts()
      fetchBrands() // Opcional: refresca marcas al borrar producto
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el producto",
        variant: "destructive",
      })
    }
  }

  // --- BOTÓN LIMPIAR FILTROS ---
  const clearFilters = () => {
    setSearch("")
    setCategoryFilter("all")
    setBrandFilter("all")
    setStatusFilter("all") // <-- Añadido
  }

  if (!user || user.role !== "admin") {
    return null
  }

  // Opciones de marcas (únicas) a partir de productos cargados
  const uniqueBrands = Array.from(new Set(products.map(p => p.brand).filter(Boolean) as string[]))

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Productos</h1>
          <p className="text-gray-600 mt-2">Administra el inventario de tu tienda</p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Producto
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingProduct ? "Editar Producto" : "Nuevo Producto"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* TODO: el form original va aquí, lo dejé igual */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="product_code">Código del Producto</Label>
                  <Input
                    id="product_code"
                    value={formData.product_code}
                    onChange={(e) => handleInputChange("product_code", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="name">Nombre del Producto</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    required
                  />
                </div>
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
                <Label htmlFor="long_description">Descripción Larga</Label>
                <Textarea
                  id="long_description"
                  value={formData.long_description}
                  onChange={(e) => handleInputChange("long_description", e.target.value)}
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="price">Precio (S/)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="stock">Stock</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={formData.stock}
                    onChange={(e) => handleInputChange("stock", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="min_stock">Stock Mínimo</Label>
                  <Input
                    id="min_stock"
                    type="number"
                    value={formData.min_stock}
                    onChange={(e) => handleInputChange("min_stock", e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="category">Categoría</Label>
                <Select
                  value={formData.category_id}
                  onValueChange={(value) => handleInputChange("category_id", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="brand">Marca</Label>
                  <Input
                    id="brand"
                    value={formData.brand}
                    onChange={(e) => handleInputChange("brand", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="model">Modelo</Label>
                  <Input
                    id="model"
                    value={formData.model}
                    onChange={(e) => handleInputChange("model", e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="image_url">URL de Imagen Principal</Label>
                <Input
                  id="image_url"
                  value={formData.image_url}
                  onChange={(e) => handleInputChange("image_url", e.target.value)}
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
              </div>
              <div>
                <Label htmlFor="image_urls">URLs de Imágenes adicionales (separadas por coma)</Label>
                <Input
                  id="image_urls"
                  value={formData.image_urls}
                  onChange={(e) => handleInputChange("image_urls", e.target.value)}
                  placeholder="https://a.jpg, https://b.jpg"
                />
              </div>
              <div>
                <Label htmlFor="specifications">
                  Especificaciones (ejemplo: color: negro, velocidad: 3.4GHz, memoria: 16GB)
                </Label>
                <Input
                  id="specifications"
                  value={formData.specifications}
                  onChange={(e) => handleInputChange("specifications", e.target.value)}
                  placeholder="color: negro, velocidad: 3.4GHz, memoria: 16GB"
                />
              </div>
              <div>
                <Label htmlFor="features">
                  Características (ejemplo: Bluetooth, RGB, Overclock)
                </Label>
                <Input
                  id="features"
                  value={formData.features}
                  onChange={(e) => handleInputChange("features", e.target.value)}
                  placeholder="Bluetooth, RGB, Overclock"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="weight">Peso (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.01"
                    value={formData.weight}
                    onChange={(e) => handleInputChange("weight", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="dimensions">Dimensiones</Label>
                  <Input
                    id="dimensions"
                    value={formData.dimensions}
                    onChange={(e) => handleInputChange("dimensions", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="warranty_months">Garantía (meses)</Label>
                  <Input
                    id="warranty_months"
                    type="number"
                    value={formData.warranty_months}
                    onChange={(e) => handleInputChange("warranty_months", e.target.value)}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => handleInputChange("is_active", e.target.checked)}
                />
                <Label htmlFor="is_active">Producto activo</Label>
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">{editingProduct ? "Actualizar" : "Crear"} Producto</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Barra de búsqueda y filtros */}
      <div className="flex flex-wrap gap-2 mb-4 items-center">
        <input
          type="text"
          className="border rounded px-3 py-2 text-sm w-56"
          placeholder="Buscar por nombre o código..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          className="border rounded px-2 py-2 text-sm"
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
        >
          <option value="all">Todas las categorías</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        <select
          className="border rounded px-2 py-2 text-sm"
          value={brandFilter}
          onChange={e => setBrandFilter(e.target.value)}
        >
          <option value="all">Todas las marcas</option>
          {brands.map(brand => (
            <option key={brand} value={brand}>{brand}</option>
          ))}
        </select>
        <select
          className="border rounded px-2 py-2 text-sm"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
        >
          <option value="all">Todos</option>
          <option value="active">Solo activos</option>
          <option value="inactive">Solo inactivos</option>
        </select>
        <Button
          variant="ghost"
          className="text-gray-600 px-2"
          title="Limpiar filtros"
          onClick={clearFilters}
        >
          <XCircle className="h-5 w-5 mr-1" /> Limpiar
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Package className="h-5 w-5 mr-2" />
            Lista de Productos
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Cargando productos...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Imagen</TableHead>
                  <TableHead>Código</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Precio</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Stock Mín.</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="relative h-12 w-12">
                        <Image
                          src={
                            product.image_url ||
                            `/placeholder.svg?height=48&width=48&query=${encodeURIComponent(product.name) || "/placeholder.svg"}`
                          }
                          alt={product.name}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                    </TableCell>
                    <TableCell>{product.product_code}</TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{categories.find((cat) => cat.id === product.category_id)?.name}</TableCell>
                    <TableCell>S/ {product.price.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant={product.stock > 0 ? "default" : "destructive"}>{product.stock}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={product.min_stock > 0 ? "secondary" : "outline"}>{product.min_stock}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={product.is_active ? "default" : "secondary"}>
                        {product.is_active ? "Activo" : "Inactivo"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(product)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(product.id)}
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
