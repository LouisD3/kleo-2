import ProtectedRoute from '@/components/auth/ProtectedRoute.jsx'
import BottomNavProfesor from '@/components/layout/BottomNavProfesor'
import SidebarProfesor from '@/components/layout/SidebarProfesor'

export default function ProfesorLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requiere="profesor">
      <div className="flex min-h-screen bg-gray-50">
        <SidebarProfesor />
        <main className="flex-1 md:ml-60 pb-16 md:pb-0">{children}</main>
        <BottomNavProfesor />
      </div>
    </ProtectedRoute>
  )
}
