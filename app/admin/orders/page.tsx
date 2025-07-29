"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ordersApi, orderItemsApi, invoicesApi, usersApi } from "@/lib/api"
import { ShoppingCart, Eye, Trash2, Download } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import type { Order, OrderItem, User } from "@/lib/types"

const API_URL = "http://localhost:5000"

const STATUS_OPTIONS = [
  { value: "", label: "Todos" },
  { value: "pending", label: "Pendiente" },
  { value: "paid", label: "Pagado" },
  { value: "shipped", label: "Enviado" },
  { value: "delivered", label: "Entregado" },
  { value: "cancelled", label: "Cancelado" },
  { value: "annulled", label: "Anulado" },
]
const PAYMENT_OPTIONS = [
  { value: "", label: "Todos" },
  { value: "credit_card", label: "Tarjeta de Crédito" },
  { value: "debit_card", label: "Tarjeta de Débito" },
  { value: "bank_transfer", label: "Transferencia Bancaria" },
  { value: "cash_on_delivery", label: "Efectivo" },
]
const statusLabels: Record<string, string> = {
  pending: "Pendiente",
  paid: "Pagado",
  shipped: "Enviado",
  delivered: "Entregado",
  cancelled: "Cancelado",
  annulled: "Anulado",
}
const paymentMethodLabels: Record<string, string> = {
  credit_card: "Tarjeta de Crédito",
  debit_card: "Tarjeta de Débito",
  bank_transfer: "Transferencia Bancaria",
  cash_on_delivery: "Efectivo",
}

export default function AdminOrdersPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [usersMap, setUsersMap] = useState<Record<string, User>>({})
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [orderItems, setOrderItems] = useState<OrderItem[]>([])
  const [itemsLoading, setItemsLoading] = useState(false)
  const [editingStatus, setEditingStatus] = useState<string>("")
  const [statusSaving, setStatusSaving] = useState(false)
  const [invoiceLoading, setInvoiceLoading] = useState(false)

  // Filtros de búsqueda y filtrado
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")

  // Traducción de método de pago (si hay uno nuevo, muestra tal cual)
  const getPaymentMethodText = (method?: string) =>
    paymentMethodLabels[method || ""] || method || "-"

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/")
      return
    }
    usersApi.getAll().then(allUsers => {
      const map: Record<string, User> = {}
      allUsers.forEach(u => (map[u.id] = u))
      setUsersMap(map)
      fetchOrders()
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, router])

  // Refetch cuando cambia algún filtro
  useEffect(() => {
    if (!user || user.role !== "admin") return
    fetchOrders()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, status, paymentMethod, dateFrom, dateTo])

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const filters: any = {}
      if (search.trim()) filters.search = search.trim()
      if (status) filters.status = status
      if (paymentMethod) filters.payment_method = paymentMethod
      if (dateFrom) filters.date_from = dateFrom
      if (dateTo) filters.date_to = dateTo
      const data = await ordersApi.getAll(filters)
      setOrders(
        data.sort(
          (a: Order, b: Order) =>
            new Date(b.created_at || "").getTime() - new Date(a.created_at || "").getTime()
        )
      )
    } catch (error) {
      console.error("Error fetching orders:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchOrderItems = async (orderId: string) => {
    setItemsLoading(true)
    try {
      const items = await orderItemsApi.getByOrderId(orderId)
      setOrderItems(items)
    } catch (error) {
      setOrderItems([])
    } finally {
      setItemsLoading(false)
    }
  }

  const getUserInfo = (userId: string) => {
    const u = usersMap[userId]
    if (!u) return { name: "?", email: "?" }
    return { name: u.full_name, email: u.email }
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
      case "anulado":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) =>
    statusLabels[status] || status

  const handleDeleteOrder = async (orderId: string) => {
    if (!window.confirm("¿Seguro de eliminar el pedido? Esta acción es irreversible.")) return
    await ordersApi.delete(orderId)
    fetchOrders()
  }

  // Descargar boleta: busca la invoice por order_id, luego descarga PDF (con auth header)
  const handleDownloadInvoice = async (orderId: string) => {
    setInvoiceLoading(true)
    try {
      const invoice = await invoicesApi.getByOrderId(orderId)
      if (!invoice || !invoice.id) {
        alert("No hay boleta disponible para este pedido.")
        return
      }
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_URL}/invoices/${invoice.id}/download`, {
        headers: {
          Authorization: `Bearer ${token || ""}`,
        }
      })
      if (!response.ok) {
        alert("Error al descargar la boleta.")
        return
      }
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `boleta-${invoice.invoice_number || invoice.id}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      a.remove()
    } catch (err) {
      alert("Error al descargar la boleta.")
    } finally {
      setInvoiceLoading(false)
    }
  }

  if (!user || user.role !== "admin") return null

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Pedidos</h1>
        <p className="text-gray-600 mt-2">Administra todos los pedidos de la tienda</p>
      </div>

      {/* FILTROS AVANZADOS Y BUSCADOR */}
      <div className="mb-4 flex flex-wrap gap-2 items-center">
        <input
          type="text"
          className="border rounded px-3 py-2 text-sm w-72"
          placeholder="Buscar por N° pedido, nombre o email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          className="border rounded px-3 py-2 text-sm"
          value={status}
          onChange={e => setStatus(e.target.value)}
        >
          {STATUS_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <select
          className="border rounded px-3 py-2 text-sm"
          value={paymentMethod}
          onChange={e => setPaymentMethod(e.target.value)}
        >
          {PAYMENT_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <label className="text-xs text-gray-600 ml-2">Desde</label>
        <input
          type="date"
          className="border rounded px-2 py-2 text-sm"
          value={dateFrom}
          onChange={e => setDateFrom(e.target.value)}
          max={dateTo || undefined}
        />
        <label className="text-xs text-gray-600 ml-2">Hasta</label>
        <input
          type="date"
          className="border rounded px-2 py-2 text-sm"
          value={dateTo}
          onChange={e => setDateTo(e.target.value)}
          min={dateFrom || undefined}
        />
        <Button
          variant="ghost"
          className="text-xs px-2 py-2 ml-2"
          onClick={() => {
            setSearch("")
            setStatus("")
            setPaymentMethod("")
            setDateFrom("")
            setDateTo("")
          }}
        >Limpiar</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ShoppingCart className="h-5 w-5 mr-2" />
            Lista de Pedidos
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Cargando pedidos...</div>
          ) : orders.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No hay pedidos registrados</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>N° Pedido</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Método de Pago</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => {
                  const userInfo = getUserInfo(order.user_id)
                  return (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.order_number || order.id.slice(-8)}</TableCell>
                      <TableCell>{order.created_at ? new Date(order.created_at).toLocaleDateString("es-ES") : ""}</TableCell>
                      <TableCell>
                        {userInfo.name}
                        <br />
                        <span className="text-xs text-gray-500">{userInfo.email}</span>
                      </TableCell>
                      <TableCell>S/ {order.total_amount.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(order.status)}>{getStatusText(order.status)}</Badge>
                      </TableCell>
                      <TableCell>{getPaymentMethodText(order.payment_method)}</TableCell>
                      <TableCell className="space-x-2">
                        <Dialog
                          onOpenChange={open => {
                            if (open) {
                              setSelectedOrder(order)
                              fetchOrderItems(order.id)
                              setEditingStatus(order.status)
                            } else {
                              setSelectedOrder(null)
                              setOrderItems([])
                              setEditingStatus("")
                            }
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-2" />
                              Ver Detalles
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Detalles del Pedido #{order.order_number || order.id.slice(-8)}</DialogTitle>
                            </DialogHeader>
                            {selectedOrder && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="font-medium mb-2">Información del Pedido</h4>
                                    <p className="text-sm text-gray-600">
                                      Fecha: {selectedOrder.created_at ? new Date(selectedOrder.created_at).toLocaleDateString("es-ES") : ""}
                                    </p>
                                    <p className="text-sm text-gray-600">Estado: {getStatusText(selectedOrder.status)}</p>
                                    <p className="text-sm text-gray-600">
                                      Método de pago: {getPaymentMethodText(selectedOrder.payment_method)}
                                    </p>
                                    {selectedOrder.tracking_number && (
                                      <p className="text-sm text-gray-600">
                                        Tracking: {selectedOrder.tracking_number}
                                      </p>
                                    )}
                                    <div className="mt-2">
                                      <Button
                                        size="sm"
                                        variant="secondary"
                                        disabled={invoiceLoading}
                                        onClick={() => handleDownloadInvoice(selectedOrder.id)}
                                      >
                                        <Download className="h-4 w-4 mr-2" />
                                        {invoiceLoading ? "Descargando..." : "Descargar Boleta"}
                                      </Button>
                                    </div>
                                  </div>
                                  <div>
                                    <h4 className="font-medium mb-2">Cliente</h4>
                                    <div className="text-sm text-gray-600">
                                      <p>Nombre: <b>{getUserInfo(selectedOrder.user_id).name}</b></p>
                                      <p>Correo: <b>{getUserInfo(selectedOrder.user_id).email}</b></p>
                                    </div>
                                    <h4 className="font-medium mb-2 mt-4">Dirección de Envío</h4>
                                    <div className="text-sm text-gray-600">
                                      <p>{selectedOrder.shipping_address?.address}</p>
                                      <p>
                                        {selectedOrder.shipping_address?.city},{" "}
                                        {selectedOrder.shipping_address?.postalCode}
                                      </p>
                                      <p>Tel: {selectedOrder.shipping_address?.phone}</p>
                                      {selectedOrder.shipping_address?.notes && (
                                        <p>Notas: {selectedOrder.shipping_address?.notes}</p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  <h4 className="font-medium mb-2">Productos</h4>
                                  <div className="space-y-2">
                                    {itemsLoading ? (
                                      <div className="text-gray-400">Cargando productos...</div>
                                    ) : orderItems.length === 0 ? (
                                      <div className="text-gray-400">No hay productos en este pedido</div>
                                    ) : (
                                      orderItems.map((item) => (
                                        <div
                                          key={item.id}
                                          className="flex justify-between items-center p-2 bg-gray-50 rounded"
                                        >
                                          <span className="text-sm">{item.product_name} <span className="text-xs text-gray-500">({item.product_code})</span></span>
                                          <span className="text-sm">
                                            {item.quantity} x S/ {item.unit_price.toFixed(2)} = S/
                                            {(item.total_price).toFixed(2)}
                                          </span>
                                        </div>
                                      ))
                                    )}
                                  </div>
                                  {/* Subtotal, IGV y Total */}
                                  {orderItems.length > 0 && (
                                    <div className="mt-4 pt-4 border-t space-y-1">
                                      {(() => {
                                        const subtotal = orderItems.reduce((sum, item) => sum + item.total_price, 0)
                                        const igv = +(subtotal * 0.18).toFixed(2)
                                        const total = +(subtotal + igv).toFixed(2)
                                        return (
                                          <>
                                            <div className="flex justify-between">
                                              <span>Subtotal:</span>
                                              <span>S/ {subtotal.toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                              <span>IGV (18%):</span>
                                              <span>S/ {igv.toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between font-semibold">
                                              <span>Total:</span>
                                              <span>S/ {total.toFixed(2)}</span>
                                            </div>
                                          </>
                                        )
                                      })()}
                                    </div>
                                  )}
                                </div>
                                {/* Editar estado */}
                                <div className="pt-4">
                                  <h4 className="font-medium mb-2">Editar Estado del Pedido</h4>
                                  <div className="flex items-center space-x-2">
                                    <select
                                      className="border rounded px-2 py-1"
                                      value={editingStatus}
                                      onChange={e => setEditingStatus(e.target.value)}
                                    >
                                      {STATUS_OPTIONS.filter(opt => !!opt.value).map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                      ))}
                                    </select>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      disabled={statusSaving || editingStatus === selectedOrder.status}
                                      onClick={async () => {
                                        setStatusSaving(true)
                                        await ordersApi.update(selectedOrder.id, { status: editingStatus })
                                        await fetchOrders()
                                        setStatusSaving(false)
                                      }}
                                    >
                                      Guardar Estado
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteOrder(order.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Eliminar
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
