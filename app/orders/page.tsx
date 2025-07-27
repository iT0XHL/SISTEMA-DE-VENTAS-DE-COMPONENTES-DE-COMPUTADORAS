"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download, FileText } from "lucide-react"
import { useRouter } from "next/navigation"

const paymentLabels: Record<string, string> = {
  credit_card: "Tarjeta de Crédito",
  debit_card: "Tarjeta de Débito",
  bank_transfer: "Transferencia Bancaria",
  cash_on_delivery: "Efectivo",
}

interface Invoice {
  invoice_id: string
  invoice_number: string
  created_at: string
  pdf_available: boolean
  order_number: string
  order_status: string
  payment_method: string
  total_amount: number
  items: {
    product_name: string
    quantity: number
    unit_price: number
    total_price: number
  }[]
}

export default function InvoicesPage() {
  const { user, token } = useAuth() // Asegúrate de exponer el token JWT en tu context
  const router = useRouter()
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }
    fetchInvoices()
    // eslint-disable-next-line
  }, [user])

  const fetchInvoices = async () => {
    if (!user || !token) return
    setLoading(true)
    try {
      const res = await fetch("http://localhost:5000/invoices/mine", {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error("No se pudo obtener las boletas")
      const data = await res.json()
      setInvoices(data)
    } catch (error) {
      console.error("Error fetching invoices:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadInvoice = async (invoice: Invoice) => {
    if (!token) return
    try {
      const res = await fetch(`http://localhost:5000/invoices/${invoice.invoice_id}/download`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error("No se pudo descargar la boleta")
      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `boleta-${invoice.invoice_number}.pdf`
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      alert("Error descargando la boleta")
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "shipped":
        return "bg-blue-100 text-blue-800"
      case "delivered":
        return "bg-purple-100 text-purple-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "paid":
        return "Pagado"
      case "pending":
        return "Pendiente"
      case "shipped":
        return "Enviado"
      case "delivered":
        return "Entregado"
      case "cancelled":
        return "Cancelado"
      default:
        return status
    }
  }

  if (!user) return null

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <FileText className="h-7 w-7 text-blue-600" /> Mis Boletas
        </h1>
        <p className="text-gray-600 mt-2">Historial de todas tus boletas de venta</p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-32"></div>
          ))}
        </div>
      ) : invoices.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="h-20 w-20 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">No tienes boletas aún</h2>
          <p className="text-gray-600 mb-6">Cuando compres, verás tus boletas aquí</p>
          <Button onClick={() => router.push("/catalog")}>Explorar Productos</Button>
        </div>
      ) : (
        <div className="space-y-6">
          {invoices.map((inv) => (
            <Card key={inv.invoice_id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">
                      Boleta #{inv.invoice_number}
                    </CardTitle>
                    <p className="text-sm text-gray-600">
                      {new Date(inv.created_at).toLocaleDateString("es-PE", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(inv.order_status)}>{getStatusText(inv.order_status)}</Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={!inv.pdf_available}
                      onClick={() => handleDownloadInvoice(inv)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Descargar Boleta
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Productos:</h4>
                      <ul className="space-y-1">
                        {inv.items.map((item, index) => (
                          <li key={index} className="text-sm text-gray-600">
                            {item.product_name} x{item.quantity} - S/ {(item.total_price).toFixed(2)}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Detalles:</h4>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>
  Método de pago: {paymentLabels[inv.payment_method] || inv.payment_method}
</p>
                        <p>
                          Total: <span className="font-semibold text-lg">S/ {inv.total_amount.toFixed(2)}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
