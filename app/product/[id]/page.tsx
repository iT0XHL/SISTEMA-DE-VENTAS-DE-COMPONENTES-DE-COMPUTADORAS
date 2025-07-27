"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import { productsApi, categoriesApi } from "@/lib/api"
import { toast } from "@/hooks/use-toast"
import { ShoppingCart, ArrowLeft, Truck, Shield, RefreshCw } from "lucide-react"
import type { Product, Category } from "@/lib/types"
import { ChevronLeft, ChevronRight } from "lucide-react"

function MagnifierImage({
  src,
  alt,
  zoom = 2,
  size = 220,
  className = "",
}: {
  src: string
  alt: string
  zoom?: number
  size?: number
  className?: string
}) {
  const [show, setShow] = useState(false)
  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  const imgRef = useRef<HTMLImageElement>(null)
  const [imgRect, setImgRect] = useState({ width: 1, height: 1 })

  useEffect(() => {
    function updateRect() {
      if (imgRef.current) {
        const rect = imgRef.current.getBoundingClientRect()
        setImgRect({ width: rect.width, height: rect.height })
      }
    }
    updateRect()
    window.addEventListener("resize", updateRect)
    return () => window.removeEventListener("resize", updateRect)
  }, [])

  function handleImgLoad() {
    if (imgRef.current) {
      const rect = imgRef.current.getBoundingClientRect()
      setImgRect({ width: rect.width, height: rect.height })
    }
  }

  function handleMove(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    if (!imgRef.current) return
    const rect = imgRef.current.getBoundingClientRect()
    setMouse({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  // Solo muestra la lupa si el mouse está sobre la imagen
  const isInside =
    mouse.x > 0 &&
    mouse.y > 0 &&
    mouse.x < imgRect.width &&
    mouse.y < imgRect.height

  // Calcula la posición de la imagen en la lupa
  // El punto debajo del cursor debe quedar justo en el centro de la lupa
  const backgroundPosition = {
    x: (mouse.x / imgRect.width) * 100,
    y: (mouse.y / imgRect.height) * 100,
  }

  return (
    <div
      className={`relative w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center select-none ${className}`}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onMouseMove={handleMove}
      style={{ cursor: "zoom-in" }}
    >
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        style={{
          maxHeight: "380px",
          maxWidth: "100%",
          objectFit: "contain",
          display: "block",
          pointerEvents: "none",
          userSelect: "none",
        }}
        onLoad={handleImgLoad}
        draggable={false}
      />
      {show && isInside && (
        <div
          style={{
            position: "absolute",
            left: mouse.x - size / 2,
            top: mouse.y - size / 2,
            width: size,
            height: size,
            borderRadius: "50%",
            boxShadow: "0 4px 28px #0003",
            pointerEvents: "none",
            border: "2px solid #fff",
            overflow: "hidden",
            zIndex: 20,
            backgroundImage: `url(${src})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: `${imgRect.width * zoom}px ${imgRect.height * zoom}px`,
            backgroundPosition: `${backgroundPosition.x}% ${backgroundPosition.y}%`,
          }}
        />
      )}
    </div>
  )
}

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { addItem } = useCart()
  const { user } = useAuth()

  const [product, setProduct] = useState<Product | null>(null)
  const [category, setCategory] = useState<Category | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)

  // Normaliza el parámetro id a string o null
  const rawId = params.id
  const id =
    typeof rawId === "string"
      ? rawId
      : Array.isArray(rawId)
      ? rawId[0]
      : null

  useEffect(() => {
    if (!id) {
      router.push("/catalog")
      return
    }
    fetchProduct(id)
    // eslint-disable-next-line
  }, [id, router])

  const fetchProduct = async (productId: string) => {
    setLoading(true)
    try {
      const fetched = await productsApi.getById(productId)
      if (!fetched) {
        router.push("/catalog")
        return
      }
      setProduct(fetched)
      if (fetched.category_id) {
        const cat = await categoriesApi.getById(fetched.category_id)
        setCategory(cat ?? null)
      }
    } catch (err) {
      console.error("Error fetching product:", err)
      router.push("/catalog")
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = () => {
  if (!user) {
    toast({
      title: "Inicio de sesión requerido",
      description: "Debes iniciar sesión para agregar productos al carrito",
      variant: "destructive",
    })
    return
  }
  if (!product) return

  try {
    addItem(product.id, quantity)
    toast({
      title: "Producto agregado",
      description: `${quantity} × ${product.name} agregado${quantity > 1 ? "s" : ""} al carrito`,
    })
  } catch (err: any) {
    toast({
      title: "Error al agregar",
      description: err instanceof Error ? err.message : "No se pudo agregar al carrito",
      variant: "destructive",
    })
  }
}


  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gray-200 h-96 rounded-lg"></div>
            <div className="space-y-4">
              <div className="bg-gray-200 h-8 rounded"></div>
              <div className="bg-gray-200 h-4 rounded w-3/4"></div>
              <div className="bg-gray-200 h-6 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return null
  }

  // Galería real con TODAS las imágenes: image_url + image_urls
  const productImages = [
    ...(product.image_url ? [product.image_url] : []),
    ...(Array.isArray(product.image_urls) ? product.image_urls : []),
  ]
  if (productImages.length === 0) {
    productImages.push(`/placeholder.svg?height=500&width=500&query=${encodeURIComponent(product.name)}`)
  }

  const priceWithoutIGV = product.price
  const igvAmount = priceWithoutIGV * 0.18
  const priceWithIGV = priceWithoutIGV + igvAmount

  // Navegación por flechas
  function nextImg() {
    setSelectedImage((idx) => (idx + 1) % productImages.length)
  }
  function prevImg() {
    setSelectedImage((idx) => (idx - 1 + productImages.length) % productImages.length)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Botón de volver */}
      <Button variant="ghost" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Volver
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Sección de imágenes */}
        <div className="space-y-4">
          {/* Contenedor con flechas laterales */}
          <div className="relative">
            <MagnifierImage src={productImages[selectedImage]} alt={product.name} zoom={2.2} size={220} />
            {/* Flecha izquierda */}
            {productImages.length > 1 && (
              <button
                type="button"
                onClick={prevImg}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/90 rounded-full p-2 text-white z-10"
                style={{ fontSize: 22 }}
                tabIndex={-1}
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}
            {/* Flecha derecha */}
            {productImages.length > 1 && (
              <button
                type="button"
                onClick={nextImg}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/90 rounded-full p-2 text-white z-10"
                style={{ fontSize: 22 }}
                tabIndex={-1}
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Miniaturas */}
          <div className={`grid gap-2`} style={{ gridTemplateColumns: `repeat(${productImages.length}, minmax(0, 1fr))` }}>
            {productImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`relative h-20 w-full rounded-lg overflow-hidden border-2 ${selectedImage === idx ? "border-blue-500" : "border-transparent"}`}
                style={{ background: "#f4f5f7" }}
              >
                <Image src={img} alt={`${product.name} ${idx + 1}`} fill className="object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Sección de detalles */}
        <div className="space-y-6">
          {category && (
            <Badge variant="secondary" className="mb-2">
              {category.name}
            </Badge>
          )}
          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-blue-600">
              S/ {priceWithIGV.toFixed(2)}
              <span className="text-sm text-gray-500 ml-2">(Incluye IGV)</span>
            </div>
            <div className="text-sm text-gray-600">
              Precio sin IGV: S/ {priceWithoutIGV.toFixed(2)} + IGV S/ {igvAmount.toFixed(2)}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Stock disponible:</span>
            <Badge className="bg-black text-white shadow-lg">
              {product.stock > 0 ? `${product.stock} unidades` : "Sin stock"}
            </Badge>
          </div>
          {/* DESCRIPCIÓN LARGA SOLO */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Descripción</h3>
            <p className="text-gray-700 leading-relaxed">
              {product.long_description || "Sin descripción detallada."}
            </p>
          </div>
          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Especificaciones Técnicas</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.entries(product.specifications).map(([key, val]) => (
                  <div key={key} className="flex justify-between py-2 px-3 bg-gray-50 rounded">
                    <span className="font-medium capitalize">{key.replace("_", " ")}:</span>
                    <span className="text-gray-700">{String(val)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Selector de cantidad y añadir al carrito */}
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium">Cantidad:</label>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </Button>
                <span className="w-12 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                  disabled={quantity >= product.stock}
                >
                  +
                </Button>
              </div>
            </div>
            <Button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="w-full"
              size="lg"
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              {product.stock === 0
                ? "Sin Stock"
                : `Agregar al Carrito - S/ ${(priceWithIGV * quantity).toFixed(2)}`}
            </Button>
          </div>
          {/* Beneficios */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Truck className="h-4 w-4" />
              <span>Envío disponible</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Shield className="h-4 w-4" />
              <span>Garantía oficial</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <RefreshCw className="h-4 w-4" />
              <span>30 días devolución</span>
            </div>
          </div>
        </div>
      </div>
      {/* Información adicional */}
      <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Información de Envío</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span>Lima Metropolitana:</span>
              <span className="font-medium">1-2 días hábiles</span>
            </div>
            <div className="flex justify-between">
              <span>Provincias:</span>
              <span className="font-medium">3-5 días hábiles</span>
            </div>
            <div className="flex justify-between">
              <span>Costo de envío:</span>
              <span className="font-medium">Según ubicación</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Garantía y Soporte</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
  <span>Garantía del fabricante:</span>
  <span className="font-medium">
    {product.warranty_months ? `${product.warranty_months} meses` : "No especificada"}
  </span>
</div>

            <div className="flex justify-between">
              <span>Soporte técnico:</span>
              <span className="font-medium">24/7</span>
            </div>
            <div className="flex justify-between">
              <span>Instalación:</span>
              <span className="font-medium">Disponible</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
