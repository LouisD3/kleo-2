import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import useAuthStore from './store/useAuthStore.js'
import ProtectedRoute from './components/auth/ProtectedRoute.jsx'
import Spinner from './components/ui/Spinner.jsx'

import SeleccionarPerfil from './pages/SeleccionarPerfil.jsx'
import Login from './pages/auth/Login.jsx'
import Registro from './pages/auth/Registro.jsx'
import AccesoAlumno from './pages/auth/AccesoAlumno.jsx'
import VerificarCorreo from './pages/auth/VerificarCorreo.jsx'
import RecuperarContrasena from './pages/auth/RecuperarContrasena.jsx'
import RestablecerContrasena from './pages/auth/RestablecerContrasena.jsx'
import DashboardProfesor from './pages/profesor/DashboardProfesor.jsx'
import GenerarTarea from './pages/profesor/GenerarTarea.jsx'
import DetalleTarea from './pages/profesor/DetalleTarea.jsx'
import GestionClase from './pages/profesor/GestionClase.jsx'
import DashboardAlumno from './pages/alumno/DashboardAlumno.jsx'
import RealizarTarea from './pages/alumno/RealizarTarea.jsx'
import ResultadoTarea from './pages/alumno/ResultadoTarea.jsx'
import AvisoPrivacidad from './pages/legal/AvisoPrivacidad.jsx'
import TerminosUso from './pages/legal/TerminosUso.jsx'

export default function App() {
  const { cargando, inicializar } = useAuthStore()

  useEffect(() => {
    inicializar()
  }, [])

  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<SeleccionarPerfil />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Registro />} />
      <Route path="/acceso-alumno" element={<AccesoAlumno />} />
      <Route path="/verificar-correo" element={<VerificarCorreo />} />
      <Route path="/recuperar-contrasena" element={<RecuperarContrasena />} />
      <Route path="/restablecer-contrasena" element={<RestablecerContrasena />} />
      <Route path="/legal/privacidad" element={<AvisoPrivacidad />} />
      <Route path="/legal/terminos" element={<TerminosUso />} />

      {/* Profesor */}
      <Route path="/profesor" element={<ProtectedRoute requiere="profesor"><DashboardProfesor /></ProtectedRoute>} />
      <Route path="/profesor/generar" element={<ProtectedRoute requiere="profesor"><GenerarTarea /></ProtectedRoute>} />
      <Route path="/profesor/tarea/:tareaId" element={<ProtectedRoute requiere="profesor"><DetalleTarea /></ProtectedRoute>} />
      <Route path="/profesor/clase" element={<ProtectedRoute requiere="profesor"><GestionClase /></ProtectedRoute>} />

      {/* Alumno */}
      <Route path="/alumno" element={<ProtectedRoute requiere="alumno"><DashboardAlumno /></ProtectedRoute>} />
      <Route path="/alumno/tarea/:tareaId" element={<ProtectedRoute requiere="alumno"><RealizarTarea /></ProtectedRoute>} />
      <Route path="/alumno/resultado/:tareaId" element={<ProtectedRoute requiere="alumno"><ResultadoTarea /></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
