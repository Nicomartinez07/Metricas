import { LoginForm } from "@/components/auth/LoginForm"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function LoginPage() {
  const session = await getServerSession(authOptions)
  
  if (session) {
    redirect('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Automotriz</h1>
            <p className="text-gray-600 mt-2">Control de Calidad de Servicio</p>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  )
}