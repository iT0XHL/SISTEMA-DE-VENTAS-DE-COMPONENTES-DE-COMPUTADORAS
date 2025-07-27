"use client"

import { useState, useEffect } from "react"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { productsApi, categoriesApi } from "@/lib/api"
import { Search, Filter, Sparkles } from "lucide-react"
import { useSearchParams } from "next/navigation"
import type { Product, Category } from "@/lib/types"

export default function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [brands, setBrands] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedBrand, setSelectedBrand] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("newest")

  const searchParams = useSearchParams()

  useEffect(() => {
    fetchCategories()
    fetchBrands()

    // Chequear si hay filtro por categoría en la URL
    const categoryParam = searchParams.get("category")
    if (categoryParam) {
      setSelectedCategory(categoryParam)
    }
    // eslint-disable-next-line
  }, [searchParams])

  useEffect(() => {
    fetchProducts()
    // eslint-disable-next-line
  }, [searchTerm, selectedCategory, selectedBrand, sortBy])

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
    }
  }

  // Filtrar: solo manda al backend si el filtro es distinto de "all" o ""
  const fetchProducts = async () => {
    setLoading(true)
    try {
      const filters: any = {}
      if (searchTerm.trim() !== "") filters.search = searchTerm
      if (selectedCategory !== "all") filters.category = selectedCategory
      if (selectedBrand !== "all") filters.brand = selectedBrand
      if (sortBy && sortBy !== "newest") filters.sortBy = sortBy

      const data = await productsApi.getAll(filters)
      setProducts(data)
    } catch (error) {
      console.error("Error fetching products:", error)
    } finally {
      setLoading(false)
    }
  }

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedCategory("all")
    setSelectedBrand("all")
    setSortBy("newest")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-100">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="text-center mb-8 animate-fade-in-up">
            <h1 className="text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent animate-gradient-x">
                Catálogo de Productos
              </span>
            </h1>
            <div className="flex items-center justify-center gap-2 text-gray-600">
              <Sparkles className="h-5 w-5 text-purple-500 animate-pulse" />
              <span>Descubre los mejores componentes para tu PC</span>
              <Sparkles className="h-5 w-5 text-blue-500 animate-pulse animation-delay-1000" />
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20 mb-6 animate-fade-in-up animation-delay-300 hover:shadow-2xl transition-all duration-500">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="relative md:col-span-1 group">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors duration-300" />
                <Input
                  placeholder="Buscar productos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-2 border-gray-200 focus:border-blue-500 transition-all duration-300 hover:border-blue-300"
                />
              </div>

              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="border-2 border-gray-200 focus:border-purple-500 transition-all duration-300 hover:border-purple-300">
                  <SelectValue placeholder="Todas las categorías" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las categorías</SelectItem>
                  {categories
                    .slice()
                    .sort((a, b) => a.sort_order - b.sort_order)
                    .map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>

              <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                <SelectTrigger className="border-2 border-gray-200 focus:border-green-500 transition-all duration-300 hover:border-green-300">
                  <SelectValue placeholder="Todas las marcas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las marcas</SelectItem>
                  {brands.map((brand) => (
                    <SelectItem key={brand} value={brand}>
                      {brand}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="border-2 border-gray-200 focus:border-orange-500 transition-all duration-300 hover:border-orange-300">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Más Recientes</SelectItem>
                  <SelectItem value="name">Nombre A-Z</SelectItem>
                  <SelectItem value="price_asc">Precio: Menor a Mayor</SelectItem>
                  <SelectItem value="price_desc">Precio: Mayor a Menor</SelectItem>
                  <SelectItem value="stock">Mayor Stock</SelectItem>
                </SelectContent>
              </Select>

              <Button
                onClick={clearFilters}
                variant="outline"
                className="bg-gradient-to-r from-red-500 to-pink-500 text-white border-0 hover:from-red-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Filter className="h-4 w-4 mr-2" />
                Limpiar Filtros
              </Button>
            </div>
          </div>

          {/* Results Summary */}
          <div className="flex justify-between items-center mb-6 text-sm text-gray-600 animate-fade-in-up animation-delay-500">
            <span className="bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full shadow-md">
              <span className="font-semibold text-blue-600">{products.filter(p => p.is_active).length}</span> productos encontrados
            </span>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse rounded-2xl h-96 shadow-lg"
                style={{ animationDelay: `${i * 100}ms` }}
              ></div>
            ))}
          </div>
        ) : products.filter(p => p.is_active).length === 0 ? (
          <div className="text-center py-12 animate-fade-in-up">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl max-w-md mx-auto">
              <p className="text-gray-500 text-lg mb-4">No se encontraron productos</p>
              <Button
                onClick={clearFilters}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transform hover:scale-105 transition-all duration-300"
              >
                Limpiar filtros
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products
              .filter((product) => product.is_active)
              .map((product, index) => (
                <div key={product.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                  <ProductCard product={product} />
                </div>
              ))
            }
          </div>
        )}
      </div>
    </div>
  )
}
