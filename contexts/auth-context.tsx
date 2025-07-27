"use client"

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { jwtDecode } from "jwt-decode"
import Cookies from "js-cookie"
import type { User } from "@/lib/auth"
import { signIn as apiSignIn, signUp as apiSignUp, getToken, logout as apiLogout } from "@/lib/auth"

interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, fullName: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Prefiere cookie sobre localStorage (porque middleware depende de cookie)
    const loadUserFromStorage = () => {
      const cookieToken = Cookies.get("token")
      const localToken = getToken()
      const existingToken = cookieToken || localToken

      if (!existingToken) {
        setUser(null)
        setToken(null)
        setIsLoading(false)
        return
      }
      setToken(existingToken)
      try {
        const decoded: any = jwtDecode(existingToken)
        setUser({
          id: decoded.sub, // o decoded.user_id si tu payload usa ese campo
          email: decoded.email,
          full_name: decoded.full_name,
          role: decoded.role,
        })
      } catch (err) {
        setUser(null)
        setToken(null)
        apiLogout()
        localStorage.removeItem("token")
        Cookies.remove("token")
      }
      setIsLoading(false)
    }

    loadUserFromStorage()
    window.addEventListener("storage", loadUserFromStorage)
    return () => window.removeEventListener("storage", loadUserFromStorage)
  }, [])

  // LOGIN: guarda en localStorage y cookie
  const signIn: AuthContextType["signIn"] = async (email, password) => {
    const { token: tok } = await apiSignIn(email, password)
    setToken(tok)
    localStorage.setItem("token", tok)
    Cookies.set("token", tok, { path: "/", sameSite: "lax" }) // cookie para el middleware

    try {
      const decoded: any = jwtDecode(tok)
      setUser({
        id: decoded.sub, // o decoded.user_id
        email: decoded.email,
        full_name: decoded.full_name,
        role: decoded.role,
      })
    } catch (err) {
      setUser(null)
      setToken(null)
      apiLogout()
      localStorage.removeItem("token")
      Cookies.remove("token")
    }
  }

  // REGISTRO (no inicia sesión automática)
  const signUp: AuthContextType["signUp"] = async (email, password, fullName) => {
    const newUser = await apiSignUp(email, password, fullName)
    setUser(newUser)
  }

  // LOGOUT: limpia todo
  const logout = () => {
    setUser(null)
    setToken(null)
    apiLogout()
    localStorage.removeItem("token")
    Cookies.remove("token")
  }

  return (
    <AuthContext.Provider value={{ user, token, isLoading, signIn, signUp, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
