"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { useAuth } from "./auth-context"
import { cartsApi, cartItemsApi } from "@/lib/api"
import type { CartItem } from "@/lib/types"

type CartContextType = {
  items: CartItem[]
  addItem: (product_id: string, quantity?: number) => Promise<void>
  removeItem: (itemId: string) => Promise<void>
  updateQuantity: (itemId: string, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
  total: number
  itemCount: number
  loading: boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  // --- Cargar carrito del usuario al cambiar ---
  useEffect(() => {
    if (!user) {
      setItems([])
      return
    }
    setLoading(true)
    cartsApi.getByUser(user.id)
      .then(cart => {
        if (!cart) {
          setItems([])
          setLoading(false)
          return
        }
        cartItemsApi.getAll()
          .then(data => {
            setItems(data.filter((item: CartItem) => item.cart_id === cart.id))
          })
          .finally(() => setLoading(false))
      })
  }, [user])

  // --- Agregar producto ---
  const addItem = async (product_id: string, quantity = 1) => {
    if (!user) return
    setLoading(true)
    try {
      await cartItemsApi.addOrUpdate(user.id, product_id, quantity)
      const cart = await cartsApi.getByUser(user.id)
      if (!cart) { setItems([]); setLoading(false); return }
      const data = await cartItemsApi.getAll()
      setItems(data.filter((item: CartItem) => item.cart_id === cart.id))
    } finally {
      setLoading(false)
    }
  }

  // --- Cambiar cantidad ---
  const updateQuantity = async (itemId: string, quantity: number) => {
    if (!user) return
    setLoading(true)
    try {
      if (quantity < 1) {
        await removeItem(itemId)
      } else {
        await cartItemsApi.updateQuantity(itemId, quantity)
        const cart = await cartsApi.getByUser(user.id)
        if (!cart) { setItems([]); setLoading(false); return }
        const data = await cartItemsApi.getAll()
        setItems(data.filter((item: CartItem) => item.cart_id === cart.id))
      }
    } finally {
      setLoading(false)
    }
  }

  // --- Eliminar item ---
  const removeItem = async (itemId: string) => {
    if (!user) return
    setLoading(true)
    try {
      await cartItemsApi.delete(itemId)
      const cart = await cartsApi.getByUser(user.id)
      if (!cart) { setItems([]); setLoading(false); return }
      const data = await cartItemsApi.getAll()
      setItems(data.filter((item: CartItem) => item.cart_id === cart.id))
    } finally {
      setLoading(false)
    }
  }

  // --- Vaciar carrito ---
  const clearCart = async () => {
    if (!user) return
    setLoading(true)
    try {
      for (const item of items) {
        await cartItemsApi.delete(item.id)
      }
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  // --- Totales ---
  const total = items.reduce((sum, it) => sum + it.price * it.quantity, 0)
  const itemCount = items.reduce((sum, it) => sum + it.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        total,
        itemCount,
        loading,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used within a CartProvider")
  return ctx
}
