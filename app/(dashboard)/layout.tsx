import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { LogOut, BarChart3 } from "lucide-react"
import { LogoutButton } from "@/components/auth/LogoutButton"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4"> {/* Contenedor principal alineado al centro */}
              <img
                src="/MGlogo_black.png"
                alt="Geely Logo"
                className="h-10 w-auto object-contain" // Tamaño controlado por altura para que no deforme
              />
              <div className="flex flex-col justify-center border-l border-gray-200 pl-4"> {/* Opcional: una línea divisoria suave */}
                <h1 className="text-lg font-bold text-gray-900 leading-none">Dashboard MG</h1>
                <p className="text-[10px] uppercase tracking-wider text-gray-500 mt-1">Control de Calidad</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-900">{session.user?.name}</p>
                <p className="text-xs text-gray-500">{session.user?.email}</p>
              </div>
              <LogoutButton /> {/* <--- Ahora es un componente limpio */}
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}
