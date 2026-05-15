import ProtectedRoute from '@/components/auth/ProtectedRoute.jsx'
import BottomNavProfesor from '@/components/layout/BottomNavProfesor'
import TopBarProfesor from '@/components/layout/TopBarProfesor'
import AccionRapidaMenu from '@/components/profesor/AccionRapidaMenu'
import SearchGlobalModal from '@/components/profesor/SearchGlobalModal'

export default function ProfesorLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requiere="profesor">
      <div className="min-h-screen bg-crema-100">
        <TopBarProfesor />
        <main className="pb-20 md:pb-0">{children}</main>
        <BottomNavProfesor />
        <SearchGlobalModal />
        <AccionRapidaMenu />
      </div>
    </ProtectedRoute>
  )
}
