import ProtectedRoute from '@/components/auth/ProtectedRoute.jsx'

export default function AlumnoLayout({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute requiere="alumno">{children}</ProtectedRoute>
}
