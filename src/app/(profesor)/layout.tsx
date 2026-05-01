import ProtectedRoute from '@/components/auth/ProtectedRoute.jsx'

export default function ProfesorLayout({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute requiere="profesor">{children}</ProtectedRoute>
}
