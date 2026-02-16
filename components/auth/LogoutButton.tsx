'use client' // <--- Esto es lo que permite usar signOut()

import { signOut } from "next-auth/react"
import { LogOut } from "lucide-react"

export function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/login' })}
      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
    >
      <LogOut className="w-4 h-4" />
      <span className="hidden sm:inline">Salir</span>
    </button>
  )
}