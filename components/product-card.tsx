import React, { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import { ShoppingCart, Zap } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import type { Product } from "@/lib/types"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const [quantity, setQuantity] = useState<number>(1)
  const { addItem } = useCart()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)

  const handleAddToCart = async () => {
    if (!user) {
      toast({
        title: "Inicio de sesión requerido",
        description: "Debes iniciar sesión para agregar productos al carrito",
        variant: "destructive",
      })
      return
    }
    setLoading(true)
    try {
      await addItem(product.id, quantity)
      toast({
        title: "Producto agregado",
        description: `${product.name} se agregó al carrito (x${quantity})`,
      })
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.message || "No se pudo agregar el producto",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const imageSrc =
    product.image_url && product.image_url !== ""
      ? product.image_url
      : `/placeholder.svg?height=200&width=300&query=${encodeURIComponent(product.name)}`

  return (
    <Link href={`/product/${product.id}`} passHref>
      <Card className="group h-full flex flex-col cursor-pointer hover:shadow-2xl transition-transform duration-500 transform hover:scale-105 hover:-translate-y-2 bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 border-0 shadow-lg backdrop-blur-sm hover:bg-gradient-to-br hover:from-white hover:via-blue-100/50 hover:to-purple-100/50">
        <CardHeader className="relative p-0 overflow-hidden rounded-t-2xl h-48">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 opacity-50 group-hover:opacity-70 transition-opacity duration-500" />
          <Image
            src={imageSrc}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute top-2 left-2 opacity-100 transition-transform duration-500">
            <Badge className="bg-black text-white shadow-lg animate-bounce-subtle border-0">
              <Zap className="h-3 w-3 mr-1" />
              {product.stock > 0 ? `${product.stock} disponibles` : "Sin stock"}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="relative flex-1 p-4">
          <h3 className="text-lg font-semibold mb-2 line-clamp-2 group-hover:text-blue-600">
            {product.name}
          </h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {product.description ?? "Sin descripción disponible."}
          </p>
          <p className="text-xs text-gray-500 mb-2 font-mono bg-gray-100 px-2 py-1 rounded">
            Código: {product.product_code}
          </p>
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            S/ {product.price.toFixed(2)}
          </span>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <div className="flex items-center justify-end gap-2 w-full">
            <Input
              type="number"
              min={1}
              max={product.stock}
              value={quantity}
              onChange={e =>
                setQuantity(
                  Math.max(1, Math.min(product.stock, Number(e.target.value)))
                )
              }
              className="w-12 h-8 py-0 px-2 text-xs"
              disabled={loading || product.stock === 0}
            />
            <span className="text-xs text-gray-600">de {product.stock}</span>
            <Button
              onClick={e => {
                e.preventDefault()
                handleAddToCart()
              }}
              disabled={loading || product.stock === 0}
              size="sm"
              className="px-2 py-1 h-8 text-xs font-medium min-w-0 bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 shadow transition-transform duration-300 hover:scale-105 hover:shadow-lg disabled:from-gray-400 disabled:to-gray-500"
            >
              <ShoppingCart className="h-4 w-4 mr-1" />
              {product.stock === 0 ? "Sin Stock" : loading ? "Agregando..." : "Agregar"}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}
