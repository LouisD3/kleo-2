import { Routes, Route, Navigate } from 'react-router-dom'
import SeleccionarPerfil from './pages/SeleccionarPerfil.jsx'
import DashboardProfesor from './pages/profesor/DashboardProfesor.jsx'
import GenerarTarea from './pages/profesor/GenerarTarea.jsx'
import DetalleTarea from './pages/profesor/DetalleTarea.jsx'
import DashboardAlumno from './pages/alumno/DashboardAlumno.jsx'
import RealizarTarea from './pages/alumno/RealizarTarea.jsx'
import ResultadoTarea from './pages/alumno/ResultadoTarea.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<SeleccionarPerfil />} />
      <Route path="/profesor" element={<DashboardProfesor />} />
      <Route path="/profesor/generar" element={<GenerarTarea />} />
      <Route path="/profesor/tarea/:tareaId" element={<DetalleTarea />} />
      <Route path="/alumno" element={<DashboardAlumno />} />
      <Route path="/alumno/tarea/:tareaId" element={<RealizarTarea />} />
      <Route path="/alumno/resultado/:tareaId" element={<ResultadoTarea />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
