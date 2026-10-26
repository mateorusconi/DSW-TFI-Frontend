import { createBrowserRouter, Navigate } from 'react-router-dom'
import { PATHS } from './paths'

import ProtectedRoute from '../modules/auth/components/ProtectedRoute'
import AdminLayout from '../modules/shared/components/templates/AdminLayout'
import PatientLayout from '../modules/shared/components/templates/PatientLayout'

import LoginPatientPage from '../modules/auth/pages/LoginPatientPage'
import LoginAdminPage from '../modules/auth/pages/LoginAdminPage'
import AdminHomePage from '../modules/home/pages/AdminHomePage'
import SpecialtiesListPage from '../modules/specialties/pages/SpecialtiesListPage'
import SpecialtyFormPage from '../modules/specialties/pages/SpecialtyFormPage'
import DoctorsListPage from '../modules/doctors/pages/DoctorsListPage'
import DoctorFormPage from '../modules/doctors/pages/DoctorFormPage'
import DoctorAvailabilityPage from '../modules/availabilities/pages/DoctorAvailabilityPage'
import AppointmentsSearchPage from '../modules/appointments/pages/AppointmentsSearchPage'
import BookAppointmentPage from '../modules/appointments/pages/BookAppointmentPage'
import MyAppointmentsPage from '../modules/appointments/pages/MyAppointmentsPage'
import ComponentsDemoPage from '../modules/shared/pages/ComponentsDemoPage'
import NotFoundPage from '../modules/shared/pages/NotFoundPage'

// Cada integrante reemplaza SOLO su página; este archivo se toca únicamente para agregar una ruta nueva.
export const router = createBrowserRouter([
  { path: '/', element: <Navigate to={PATHS.patientLogin} replace /> },

  // Logins: sueltos por ahora (en SCRUM-20/21 pasan adentro de AuthLayout)
  { path: PATHS.patientLogin, element: <LoginPatientPage /> },
  { path: PATHS.adminLogin, element: <LoginAdminPage /> },

  // Administrador: ProtectedRoute → AdminLayout (sidebar) → página
  {
    path: '/admin',
    element: <ProtectedRoute allowedRole="ADMINISTRADOR" />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true, element: <AdminHomePage /> },
          { path: 'especialidades', element: <SpecialtiesListPage /> },
          { path: 'especialidades/nueva', element: <SpecialtyFormPage /> },
          { path: 'especialidades/:id/editar', element: <SpecialtyFormPage /> },
          { path: 'medicos', element: <DoctorsListPage /> },
          { path: 'medicos/nuevo', element: <DoctorFormPage /> },
          { path: 'medicos/:id/editar', element: <DoctorFormPage /> },
          { path: 'medicos/disponibilidad', element: <DoctorAvailabilityPage /> },
          { path: 'medicos/:id/disponibilidad', element: <DoctorAvailabilityPage /> },
          { path: 'turnos', element: <AppointmentsSearchPage /> },
        ],
      },
    ],
  },

  // Paciente: ProtectedRoute → PatientLayout (navbar) → página
  {
    path: '/paciente',
    element: <ProtectedRoute allowedRole="PACIENTE" />,
    children: [
      {
        element: <PatientLayout />,
        children: [
          { index: true, element: <Navigate to="reservar" replace /> },
          { path: 'reservar', element: <BookAppointmentPage /> },
          { path: 'mis-turnos', element: <MyAppointmentsPage /> },
        ],
      },
    ],
  },

  // Solo para desarrollo: muestra los componentes compartidos
  { path: PATHS.componentsDemo, element: <ComponentsDemoPage /> },

  { path: '*', element: <NotFoundPage /> },
])
