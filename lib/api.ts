// src/lib/api.ts
import type {
  Product, ProductCreate, Category, Order, User, Cart, CartItem, OrderItem, Invoice,
} from "./types"

const API_URL = "http://localhost:5000"

type OrderCreate = Omit<Order, "id" | "created_at" | "updated_at" | "order_number">

// Helper para query-strings
function buildQuery(params: Record<string, any>) {
  const esc = encodeURIComponent
  return Object.entries(params)
    .filter(([, v]) => v != null && v !== "" && v !== "all")
    .map(([k, v]) => `${esc(k)}=${esc(v)}`)
    .join("&")
}

// Helper para auth headers JWT (cliente)
function getAuthHeaders(): Record<string, string> {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      return {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };
    }
  }
  return { "Content-Type": "application/json" };
}

// ----------- PRODUCTS -----------
export const productsApi = {
  async getAll(filters?: { search?: string; category?: string; brand?: string; sortBy?: string }): Promise<Product[]> {
    let url = `${API_URL}/products/`
    if (filters && Object.keys(filters).length > 0) {
      const qs = buildQuery(filters)
      if (qs) url += `?${qs}`
    }
    const res = await fetch(url)
    if (!res.ok) throw new Error("Error al obtener productos")
    return res.json()
  },

  async getById(id: string): Promise<Product | null> {
    const res = await fetch(`${API_URL}/products/${id}`)
    if (res.status === 404) return null
    if (!res.ok) throw new Error("Error al obtener producto")
    return res.json()
  },
  
  async create(product: ProductCreate): Promise<Product> {
    const res = await fetch(`${API_URL}/products/`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(product),
    })
    if (!res.ok) throw new Error("Error al crear producto")
    return res.json()
  },

  async update(id: string, updates: Partial<Product>): Promise<Product> {
    const res = await fetch(`${API_URL}/products/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(updates),
    })
    if (!res.ok) throw new Error("Error al actualizar producto")
    return res.json()
  },

  async delete(id: string): Promise<void> {
    const res = await fetch(`${API_URL}/products/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    })
    if (!res.ok) throw new Error("Error al eliminar producto")
  },

  async getBrands(): Promise<string[]> {
  const res = await fetch(`${API_URL}/products/brands`)
  if (!res.ok) throw new Error("Error al obtener marcas")
  return res.json()
},
}

// ----------- CATEGORIES -----------
export const categoriesApi = {
  async getAll(): Promise<Category[]> {
    const res = await fetch(`${API_URL}/categories/`)
    if (!res.ok) throw new Error("Error al obtener categorías")
    return res.json()
  },

  async getById(id: string): Promise<Category | null> {
    const res = await fetch(`${API_URL}/categories/${id}`)
    if (res.status === 404) return null
    if (!res.ok) throw new Error("Error al obtener categoría")
    return res.json()
  },

  async create(category: Omit<Category, "id" | "created_at" | "updated_at">): Promise<Category> {
    const res = await fetch(`${API_URL}/categories/`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(category),
    })
    if (!res.ok) throw new Error("Error al crear categoría")
    return res.json()
  },

  async update(id: string, updates: Partial<Category>): Promise<Category> {
    const res = await fetch(`${API_URL}/categories/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(updates),
    })
    if (!res.ok) throw new Error("Error al actualizar categoría")
    return res.json()
  },

  async delete(id: string): Promise<void> {
    const res = await fetch(`${API_URL}/categories/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    })
    if (!res.ok) throw new Error("Error al eliminar categoría")
  },
}

// ----------- ORDERS -----------
// Soporta filtros avanzados:
//  - search: texto libre (nro orden, usuario, email)
//  - status: estado (pending, paid, ...)
//  - payment_method: método de pago
//  - date_from, date_to: YYYY-MM-DD (filtra por fecha de orden)
export const ordersApi = {
  /**
   * getAll admite estos filtros (si tu backend lo soporta como query-params):
   *  - search: texto para buscar por nro de orden, usuario o email
   *  - status: estado de la orden (pending, paid, etc)
   *  - payment_method: método de pago
   *  - date_from: fecha inicio (YYYY-MM-DD)
   *  - date_to: fecha fin (YYYY-MM-DD)
   * Puedes combinarlos libremente.
   */
  async getAll(filters?: {
    search?: string
    status?: string
    payment_method?: string
    date_from?: string
    date_to?: string
  }): Promise<Order[]> {
    let url = `${API_URL}/orders/`
    if (filters && Object.keys(filters).length > 0) {
      const qs = buildQuery(filters)
      if (qs) url += `?${qs}`
    }
    const res = await fetch(url, { headers: getAuthHeaders() })
    if (!res.ok) throw new Error("Error al obtener órdenes")
    return res.json()
  },

  async getById(id: string): Promise<Order | null> {
    const res = await fetch(`${API_URL}/orders/${id}`, { headers: getAuthHeaders() })
    if (res.status === 404) return null
    if (!res.ok) throw new Error("Error al obtener orden")
    return res.json()
  },

  async create(order: OrderCreate): Promise<Order> {
    const res = await fetch(`${API_URL}/orders/`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(order),
    })
    if (!res.ok) throw new Error("Error al crear orden")
    return res.json()
  },

  async update(id: string, updates: Partial<Order>): Promise<Order> {
    const res = await fetch(`${API_URL}/orders/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(updates),
    })
    if (!res.ok) throw new Error("Error al actualizar orden")
    return res.json()
  },

  async delete(id: string): Promise<void> {
    const res = await fetch(`${API_URL}/orders/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    })
    if (!res.ok) throw new Error("Error al eliminar orden")
  },
}

// ----------- USERS -----------
export const usersApi = {
  async getAll(): Promise<User[]> {
    const res = await fetch(`${API_URL}/users/`, { headers: getAuthHeaders() })
    if (!res.ok) throw new Error("Error al obtener usuarios")
    return res.json()
  },

  async getById(id: string): Promise<User | null> {
    const res = await fetch(`${API_URL}/users/${id}`, { headers: getAuthHeaders() })
    if (res.status === 404) return null
    if (!res.ok) throw new Error("Error al obtener usuario")
    return res.json()
  },

  async create(user: Omit<User, "id" | "created_at" | "updated_at">): Promise<User> {
    const res = await fetch(`${API_URL}/users/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" }, // registro: no requiere auth
      body: JSON.stringify(user),
    })
    if (!res.ok) throw new Error("Error al crear usuario")
    return res.json()
  },

  async update(id: string, updates: Partial<User>): Promise<User> {
    const res = await fetch(`${API_URL}/users/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(updates),
    })
    if (!res.ok) throw new Error("Error al actualizar usuario")
    return res.json()
  },

  async delete(id: string): Promise<void> {
    const res = await fetch(`${API_URL}/users/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    })
    if (!res.ok) throw new Error("Error al eliminar usuario")
  },
}

// ----------- CARTS -----------
export const cartsApi = {
  async getAll(): Promise<Cart[]> {
    const res = await fetch(`${API_URL}/cart/`, { headers: getAuthHeaders() })
    if (!res.ok) throw new Error("Error al obtener carritos")
    return res.json()
  },

  async getById(id: string): Promise<Cart | null> {
    const res = await fetch(`${API_URL}/cart/${id}`, { headers: getAuthHeaders() })
    if (res.status === 404) return null
    if (!res.ok) throw new Error("Error al obtener carrito")
    return res.json()
  },

  // Obtener carrito activo de un usuario (MEJOR USAR ESTO PARA FLUJO NORMAL)
  async getByUser(user_id: string): Promise<Cart | null> {
    const res = await fetch(`${API_URL}/cart/user/${user_id}`, { headers: getAuthHeaders() })
    if (res.status === 404) return null
    if (!res.ok) throw new Error("Error al obtener carrito del usuario")
    return res.json()
  },

  // Normalmente NO necesitas create/update/delete de carrito desde frontend, pero los dejo por si acaso:
  async create(cart: Omit<Cart, "id" | "created_at" | "updated_at">): Promise<Cart> {
    const res = await fetch(`${API_URL}/cart/`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(cart),
    })
    if (!res.ok) throw new Error("Error al crear carrito")
    return res.json()
  },

  async update(id: string, updates: Partial<Cart>): Promise<Cart> {
    const res = await fetch(`${API_URL}/cart/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(updates),
    })
    if (!res.ok) throw new Error("Error al actualizar carrito")
    return res.json()
  },

  async delete(id: string): Promise<void> {
    const res = await fetch(`${API_URL}/cart/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    })
    if (!res.ok) throw new Error("Error al eliminar carrito")
  },
}

// ----------- CART ITEMS -----------
export const cartItemsApi = {
  async getAll(): Promise<CartItem[]> {
    const res = await fetch(`${API_URL}/cart_items/`, { headers: getAuthHeaders() })
    if (!res.ok) throw new Error("Error al obtener items del carrito")
    return res.json()
  },

  async getById(id: string): Promise<CartItem | null> {
    const res = await fetch(`${API_URL}/cart_items/${id}`, { headers: getAuthHeaders() })
    if (res.status === 404) return null
    if (!res.ok) throw new Error("Error al obtener item del carrito")
    return res.json()
  },

  // Para agregar producto (sumar cantidad si ya existe)
  async addOrUpdate(user_id: string, product_id: string, quantity: number): Promise<CartItem> {
    const res = await fetch(`${API_URL}/cart_items/add`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ user_id, product_id, quantity }),
    })
    if (!res.ok) {
      const msg = await res.json().catch(() => ({}))
      throw new Error(msg.message || "Error al agregar item al carrito")
    }
    return res.json()
  },

  // Para actualizar cantidad de un ítem del carrito
  async updateQuantity(id: string, quantity: number): Promise<CartItem> {
    const res = await fetch(`${API_URL}/cart_items/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({ quantity }),
    })
    if (!res.ok) throw new Error("Error al actualizar cantidad")
    return res.json()
  },

  // Para eliminar ítem del carrito
  async delete(id: string): Promise<void> {
    const res = await fetch(`${API_URL}/cart_items/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    })
    if (!res.ok) throw new Error("Error al eliminar item del carrito")
  },
}

// ----------- ORDER ITEMS ----------- 
export const orderItemsApi = {
  async getAll(): Promise<OrderItem[]> {
    const res = await fetch(`${API_URL}/order_items/`, { headers: getAuthHeaders() })
    if (!res.ok) throw new Error("Error al obtener items de la orden")
    return res.json()
  },

  async getById(id: string): Promise<OrderItem | null> {
    const res = await fetch(`${API_URL}/order_items/${id}`, { headers: getAuthHeaders() })
    if (res.status === 404) return null
    if (!res.ok) throw new Error("Error al obtener item de la orden")
    return res.json()
  },

  async getByOrderId(orderId: string): Promise<OrderItem[]> {   // <-- agregado
    const res = await fetch(`${API_URL}/order_items/?order_id=${orderId}`, { headers: getAuthHeaders() })
    if (!res.ok) throw new Error("Error al obtener items de la orden")
    return res.json()
  },

  async create(item: Omit<OrderItem, "id" | "created_at">): Promise<OrderItem> {
    const res = await fetch(`${API_URL}/order_items/`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(item),
    })
    if (!res.ok) throw new Error("Error al crear item de la orden")
    return res.json()
  },

  async update(id: string, updates: Partial<OrderItem>): Promise<OrderItem> {
    const res = await fetch(`${API_URL}/order_items/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(updates),
    })
    if (!res.ok) throw new Error("Error al actualizar item de la orden")
    return res.json()
  },

  async delete(id: string): Promise<void> {
    const res = await fetch(`${API_URL}/order_items/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    })
    if (!res.ok) throw new Error("Error al eliminar item de la orden")
  },
}


// ----------- INVOICES -----------
export const invoicesApi = {
  async getAll(): Promise<Invoice[]> {
    const res = await fetch(`${API_URL}/invoices/`, { headers: getAuthHeaders() })
    if (!res.ok) throw new Error("Error al obtener facturas")
    return res.json()
  },
  async getByOrderId(order_id: string): Promise<Invoice | null> {
    const res = await fetch(`${API_URL}/invoices/?order_id=${order_id}`, { headers: getAuthHeaders() });
    if (!res.ok) return null;
    const data = await res.json();
    return Array.isArray(data) && data.length > 0 ? data[0] : null;
  },
  async getById(id: string): Promise<Invoice | null> {
    const res = await fetch(`${API_URL}/invoices/${id}`, { headers: getAuthHeaders() })
    if (res.status === 404) return null
    if (!res.ok) throw new Error("Error al obtener factura")
    return res.json()
  },

  async create(invoice: Omit<Invoice, "id" | "created_at">): Promise<Invoice> {
    const res = await fetch(`${API_URL}/invoices/`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(invoice),
    })
    if (!res.ok) throw new Error("Error al crear factura")
    return res.json()
  },

  async update(id: string, updates: Partial<Invoice>): Promise<Invoice> {
    const res = await fetch(`${API_URL}/invoices/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(updates),
    })
    if (!res.ok) throw new Error("Error al actualizar factura")
    return res.json()
  },

  async delete(id: string): Promise<void> {
    const res = await fetch(`${API_URL}/invoices/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    })
    if (!res.ok) throw new Error("Error al eliminar factura")
  },
}

// ----------- ADMIN STATS (NUEVO) -----------
export const statsApi = {
  async getAdminStats(): Promise<{
    totalProducts: number
    totalUsers: number
    totalOrders: number
    totalRevenue: number
  }> {
    const res = await fetch(`${API_URL}/admin/stats`, {
      headers: getAuthHeaders(),
    })
    if (!res.ok) throw new Error("No autorizado o error de red")
    return res.json()
  },
}
