'use client'

import { signIn } from "next-auth/react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Mail, Lock, Sparkles } from "lucide-react"

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    setLoading(false)

    if (result?.error) {
      setError('Email o contraseña incorrectos')
    } else {
      router.push('/')
      router.refresh()
    }
  }

  const handleDemoLogin = async () => {
    setLoading(true)
    setError('')
    setEmail('taller@mg.com')
    setPassword('taller123')

    const result = await signIn('credentials', {
      email: 'taller@mg.com',
      password: 'taller123',
      redirect: false,
    })

    setLoading(false)

    if (result?.error) {
      setError('Error al ingresar con usuario demo')
    } else {
      router.push('/')
      router.refresh()
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 shadow-lg">
          <img
            src="/MGlogo_black.png"
            alt="Logo"
            width={50}
            height={50}
            className="w-14 h-14 object-contain" // Aún más grande, casi todo el contenedor
          />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">¡Bienvenido!</h2>
        <p className="text-gray-500">Ingresa tus credenciales para continuar</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
       <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-600 mb-1.5">
          Email
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="email"
            name="email"  // ← Agregado
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"  // ← Agregado
            required
            placeholder="tu@email.com"
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-800 placeholder-gray-400 focus:placeholder-transparent focus:ring-2 focus:ring-blue-500 focus:border-transparent transition shadow-sm"
          />
        </div>
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-600 mb-1.5">
          Contraseña
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="password"
            name="password"  // ← Agregado
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"  // ← Agregado
            required
            placeholder="••••••••"
            className="w-full pl-10 pr-12 py-3 rounded-xl border border-gray-200 bg-white text-gray-800 placeholder-gray-400 focus:placeholder-transparent focus:ring-2 focus:ring-blue-500 focus:border-transparent transition shadow-sm"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-red-600 rounded-full"></span>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 text-white font-semibold py-3.5 px-4 rounded-xl transition duration-200 shadow-md hover:shadow-lg"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Ingresando...
            </span>
          ) : 'Ingresar'}
        </button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-3 bg-white text-gray-400">
            o continúa con
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={handleDemoLogin}
        disabled={loading}
        className="w-full bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3.5 px-4 rounded-xl transition duration-200 border border-gray-200 shadow-sm hover:shadow-md flex items-center justify-center gap-2"
      >
        <span className="w-5 h-5 bg-gradient-to-br from-green-400 to-blue-500 rounded-full"></span>
        Usuario Taller
      </button>
    </div>
  )
}