import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import api from '../lib/axios'

interface User {
  id: number
  name: string
  email: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  loading: boolean
  login: (token: string, user: User) => void
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(localStorage.getItem('auth_token'))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const verify = async () => {
      const stored = localStorage.getItem('auth_token')
      if (!stored) {
        setLoading(false)
        return
      }
      try {
        const res = await api.get('/auth/me')
        setUser(res.data)
        setToken(stored)
      } catch {
        localStorage.removeItem('auth_token')
        setToken(null)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    verify()
  }, [])

  const login = (newToken: string, newUser: User) => {
    localStorage.setItem('auth_token', newToken)
    setToken(newToken)
    setUser(newUser)
  }

  const logout = async () => {
    try {
      await api.post('/auth/logout')
    } catch {
      // token may already be invalid
    } finally {
      localStorage.removeItem('auth_token')
      setToken(null)
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}