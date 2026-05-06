import ProtectedRoute from '@/components/auth/ProtectedRoute'

export default function DirectorLayout({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute requiere="director">{children}</ProtectedRoute>
}
