import ProtectedRoute from '@/components/auth/ProtectedRoute.jsx'
import BottomNavProfesor from '@/components/layout/BottomNavProfesor'
import SidebarProfesor from '@/components/layout/SidebarProfesor'
import AccionRapidaMenu from '@/components/profesor/AccionRapidaMenu'
import SearchGlobalModal from '@/components/profesor/SearchGlobalModal'

export default function ProfesorLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requiere="profesor">
      <div className="flex min-h-screen bg-crema-100">
        <SidebarProfesor />
        <main className="flex-1 md:ml-64 pb-20 md:pb-0">{children}</main>
        <BottomNavProfesor />
        <SearchGlobalModal />
        <AccionRapidaMenu />
      </div>
    </ProtectedRoute>
  )
}
