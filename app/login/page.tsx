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
          <LoginForm />
        </div>
      </div>
    </div>
  )
}