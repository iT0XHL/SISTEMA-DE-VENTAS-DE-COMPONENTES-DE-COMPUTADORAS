export type OrderCreate = Omit<Order, "id" | "created_at" | "updated_at" | "order_number">

// ---------- USER ----------
export type User = {
  id: string
  email: string
  password_hash?: string
  full_name: string
  role: "customer" | "admin"
  created_at?: string
  updated_at?: string
}

// ---------- CATEGORY ----------
export type Category = {
  id: string
  name: string
  description?: string
  is_active: boolean
  sort_order: number
  created_at?: string
  updated_at?: string
}

// ---------- PRODUCT ----------
export type Product = {
  id: string
  product_code: string
  name: string
  description?: string | null
  long_description?: string | null
  price: number
  stock: number
  min_stock: number
  category_id?: string
  brand?: string
  model?: string
  image_url?: string
  image_urls?: string[] // Usando string[], pues en backend es JSON
  specifications?: Record<string, any>
  features?: Record<string, any>
  is_active: boolean
  weight?: number
  dimensions?: string
  warranty_months: number
  created_at?: string
  updated_at?: string
}

// Solo los campos que se deben enviar al crear un producto, con los obligatorios según tu modelo.
export type ProductCreate = {
  product_code: string
  name: string
  description?: string | null
  long_description?: string | null
  price: number
  stock: number
  min_stock?: number
  category_id?: string
  brand?: string
  model?: string
  image_url?: string
  image_urls?: string[]
  specifications?: Record<string, any>
  features?: Record<string, any>
  is_active: boolean
  weight?: number
  dimensions?: string
  warranty_months?: number
}

// ---------- CART ----------
export type Cart = {
  id: string
  user_id: string
  created_at?: string
  updated_at?: string
}

// ---------- CART ITEM ----------
export type CartItem = {
  id: string
  cart_id: string
  product_id: string
  quantity: number
  price: number
  created_at?: string
  name?: string
  image_url?: string
  stock?: number // <--- añade esto
}

// ---------- ORDER ----------
export type Order = {
  id: string
  order_number: string
  user_id: string
  total_amount: number
  status: string
  payment_method?: string
  shipping_address?: Record<string, any>
  tracking_number?: string
  notes?: string
  created_at?: string
  updated_at?: string
}

// ---------- ORDER ITEM ----------
export type OrderItem = {
  id: string
  order_id: string
  product_id: string
  product_code: string
  product_name: string
  quantity: number
  unit_price: number
  total_price: number
  created_at?: string
}

// ---------- INVOICE ----------
export type Invoice = {
  id: string
  order_id: string
  invoice_number: string
  customer_name?: string
  customer_dni?: string
  created_at?: string
}
