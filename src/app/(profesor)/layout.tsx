import ProtectedRoute from '@/components/auth/ProtectedRoute.jsx'
import BottomNavProfesor from '@/components/layout/BottomNavProfesor'
import SidebarProfesor from '@/components/layout/SidebarProfesor'
import TopBarProfesor from '@/components/layout/TopBarProfesor'
import AccionRapidaMenu from '@/components/profesor/AccionRapidaMenu'
import SearchGlobalModal from '@/components/profesor/SearchGlobalModal'

export default function ProfesorLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requiere="profesor">
      <div className="flex min-h-screen bg-crema-100">
        <SidebarProfesor />
        <div className="flex-1 md:ml-[84px] pb-20 md:pb-0">
          <TopBarProfesor />
          <main>{children}</main>
        </div>
        <BottomNavProfesor />
        <SearchGlobalModal />
        <AccionRapidaMenu />
      </div>
    </ProtectedRoute>
  )
}
