"use client"

import React, { useState, useEffect } from "react"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ordersApi, invoicesApi, productsApi } from "@/lib/api"
import { toast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { CheckCircle } from "lucide-react"
import type { OrderCreate, CartItem, Product } from "@/lib/types"

// Diccionario para labels bonitos de métodos de pago
const paymentLabels: Record<string, string> = {
  credit_card: "Tarjeta de Crédito",
  debit_card: "Tarjeta de Débito",
  bank_transfer: "Transferencia Bancaria",
  cash_on_delivery: "Efectivo",
}

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart()
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [productNames, setProductNames] = useState<Record<string, string>>({})

  // Redirección segura usando useEffect (Evita el bug del Router)
  useEffect(() => {
    if (!user) router.push("/login")
  }, [user, router])

  useEffect(() => {
    if (user && items.length === 0) router.push("/cart")
  }, [items.length, user, router])

  // Fetch product names
  useEffect(() => {
    async function fetchNames() {
      const map: Record<string, string> = {}
      for (const item of items) {
        if (!map[item.product_id]) {
          try {
            const product: Product | null = await productsApi.getById(item.product_id)
            map[item.product_id] = product?.name ?? item.product_id
          } catch {
            map[item.product_id] = item.product_id
          }
        }
      }
      setProductNames(map)
    }
    if (items.length > 0) fetchNames()
  }, [items])

  // Datos del formulario (incluyendo cliente de la boleta)
  const [formData, setFormData] = useState({
    address: "",
    city: "",
    postalCode: "",
    phone: "",
    paymentMethod: "",
    notes: "",
    customerName: "",
    customerDni: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setLoading(true)
    try {
      const paidMethods = ["credit_card", "debit_card"]
      const status = paidMethods.includes(formData.paymentMethod) ? "paid" : "pending"

      // 1. Crear la orden principal incluyendo los items del carrito
      const orderData: OrderCreate & { items: any[] } = {
        user_id: user.id,
        total_amount: total * 1.18,
        status,
        payment_method: formData.paymentMethod,
        shipping_address: {
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          phone: formData.phone,
          notes: formData.notes,
        },
        items: items.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.price,
        })),
      }

      const order = await ordersApi.create(orderData)

      // 2. Crear la factura/boleta si lo necesitas (igual que antes)
      await invoicesApi.create({
        order_id: order.id,
        invoice_number: "", // El backend lo puede autogenerar
        customer_name: formData.customerName,
        customer_dni: formData.customerDni,
      })

      toast({
        title: "¡Compra realizada con éxito!",
        description: "Tu pedido ha sido procesado y guardado en tu historial.",
      })

      clearCart()
      router.push("/orders")
    } catch (error) {
      console.error("Error processing order:", error)
      toast({
        title: "Error al procesar el pedido",
        description: "Hubo un problema al procesar tu compra. Inténtalo de nuevo.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Bloquea render si está redireccionando
  if (!user || items.length === 0) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-4">
            Finalizar Compra
          </h1>
          <p className="text-gray-600">Completa tu información para procesar el pedido</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Shipping Information */}
            <div>
              <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-blue-50">
                <CardHeader>
                  <CardTitle className="text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Información de Envío
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Nombre para boleta */}
                  <div>
                    <Label htmlFor="customerName" className="text-gray-700 font-medium">Nombre para boleta</Label>
                    <Input
                      id="customerName"
                      value={formData.customerName}
                      onChange={(e) => handleInputChange("customerName", e.target.value)}
                      required
                      placeholder="Nombre completo para la boleta"
                      className="mt-2 border-2 border-blue-200 focus:border-blue-500 rounded-lg"
                    />
                  </div>
                  <div>
                    <Label htmlFor="customerDni" className="text-gray-700 font-medium">DNI</Label>
                    <Input
                      id="customerDni"
                      value={formData.customerDni}
                      onChange={(e) => handleInputChange("customerDni", e.target.value)}
                      required
                      placeholder="DNI del comprador"
                      className="mt-2 border-2 border-blue-200 focus:border-blue-500 rounded-lg"
                    />
                  </div>
                  <div>
                    <Label htmlFor="address" className="text-gray-700 font-medium">Dirección</Label>
                    <Textarea
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      required
                      placeholder="Ingresa tu dirección completa"
                      className="mt-2 border-2 border-blue-200 focus:border-blue-500 rounded-lg"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city" className="text-gray-700 font-medium">Ciudad</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => handleInputChange("city", e.target.value)}
                        required
                        className="mt-2 border-2 border-blue-200 focus:border-blue-500 rounded-lg"
                      />
                    </div>
                    <div>
                      <Label htmlFor="postalCode" className="text-gray-700 font-medium">Código Postal</Label>
                      <Input
                        id="postalCode"
                        value={formData.postalCode}
                        onChange={(e) => handleInputChange("postalCode", e.target.value)}
                        required
                        className="mt-2 border-2 border-blue-200 focus:border-blue-500 rounded-lg"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-gray-700 font-medium">Teléfono</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      required
                      className="mt-2 border-2 border-blue-200 focus:border-blue-500 rounded-lg"
                    />
                  </div>
                  <div>
                    <Label htmlFor="paymentMethod" className="text-gray-700 font-medium">Método de Pago</Label>
                    <Select
                      value={formData.paymentMethod}
                      onValueChange={(value) => handleInputChange("paymentMethod", value)}
                    >
                      <SelectTrigger className="mt-2 border-2 border-blue-200 focus:border-blue-500 rounded-lg">
                        <SelectValue placeholder="Selecciona un método de pago" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="credit_card">{paymentLabels["credit_card"]}</SelectItem>
                        <SelectItem value="debit_card">{paymentLabels["debit_card"]}</SelectItem>
                        <SelectItem value="bank_transfer">{paymentLabels["bank_transfer"]}</SelectItem>
                        <SelectItem value="cash_on_delivery">{paymentLabels["cash_on_delivery"]}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="notes" className="text-gray-700 font-medium">Notas Adicionales (Opcional)</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => handleInputChange("notes", e.target.value)}
                      placeholder="Instrucciones especiales para la entrega"
                      className="mt-2 border-2 border-blue-200 focus:border-blue-500 rounded-lg"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
            {/* Order Summary */}
            <div>
              <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-green-50">
                <CardHeader>
                  <CardTitle className="text-2xl bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                    Resumen del Pedido
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm"
                      >
                        <span className="font-medium text-gray-800">
                          {productNames[item.product_id] || item.product_id} x{item.quantity}
                        </span>
                        <span className="font-bold text-blue-600">
                          S/ {(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 rounded-lg space-y-3">
                    <div className="flex justify-between text-gray-700">
                      <span>Subtotal:</span>
                      <span className="font-medium">S/ {total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span>IGV (18%):</span>
                      <span className="font-medium">S/ {(total * 0.18).toFixed(2)}</span>
                    </div>
                    <div className="border-t-2 border-blue-200 pt-3">
                      <div className="flex justify-between text-xl font-bold">
                        <span className="text-gray-800">Total:</span>
                        <span className="text-green-600">S/ {(total * 1.18).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-semibold py-4 text-lg shadow-lg transform hover:scale-105 transition-all duration-300"
                    size="lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Procesando...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-5 w-5" />
                        <span>Confirmar Pedido</span>
                      </div>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
