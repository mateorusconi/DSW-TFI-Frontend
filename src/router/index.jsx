import { createBrowserRouter, Navigate } from 'react-router-dom'
import { PATHS } from './paths'

import ProtectedRoute from '../modules/auth/components/ProtectedRoute'
import GuestRoute from '../modules/auth/components/GuestRoute'

import AdminLayout from '../modules/shared/components/templates/AdminLayout'
import PatientLayout from '../modules/shared/components/templates/PatientLayout'

import LoginPatientPage from '../modules/auth/pages/LoginPatientPage'
import LoginAdminPage from '../modules/auth/pages/LoginAdminPage'
import AdminHomePage from '../modules/home/pages/AdminHomePage'
import SpecialtiesListPage from '../modules/specialties/pages/SpecialtiesListPage'
import SpecialtyFormPage from '../modules/specialties/pages/SpecialtiesFormPage.jsx'
import DoctorsListPage from '../modules/doctors/pages/DoctorsListPage'
import DoctorFormPage from '../modules/doctors/pages/DoctorFormPage'
import DoctorAvailabilityPage from '../modules/availabilities/pages/DoctorAvailabilityPage'
import AppointmentsSearchPage from '../modules/appointments/pages/AppointmentsSearchPage'
import BookAppointmentPage from '../modules/appointments/pages/BookAppointmentPage'
import MyAppointmentsPage from '../modules/appointments/pages/MyAppointmentsPage'
import NotFoundPage from '../modules/shared/pages/NotFoundPage'

// Cada integrante reemplaza SOLO su página; este archivo se toca únicamente para agregar una ruta nueva.
export const router = createBrowserRouter([
  { path: '/', element: <Navigate to={PATHS.patientLogin} replace /> },

  // Logins públicos: cada página compone el marco compartido AuthLayout.
  // Logins públicos: GuestRoute manda a su inicio a quien ya está logueado.
  {
    element: <GuestRoute />,
    children: [
      { path: PATHS.patientLogin, element: <LoginPatientPage /> },
      { path: PATHS.adminLogin, element: <LoginAdminPage /> },
    ],
  },

  // Administrador: ProtectedRoute → AdminLayout (sidebar) → página
  {
    path: '/admin',
    element: <ProtectedRoute allowedRole="ADMINISTRADOR" />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true, element: <AdminHomePage /> },
          { path: 'specialties', element: <SpecialtiesListPage /> },
          { path: 'specialties/new', element: <SpecialtyFormPage /> },
          { path: 'specialties/:id/edit', element: <SpecialtyFormPage /> },
          { path: 'doctors', element: <DoctorsListPage /> },
          { path: 'doctors/new', element: <DoctorFormPage /> },
          { path: 'doctors/:id/edit', element: <DoctorFormPage /> },
          { path: 'doctors/availability', element: <DoctorAvailabilityPage /> },
          { path: 'doctors/:id/availability', element: <DoctorAvailabilityPage /> },
          { path: 'patients', element: <AppointmentsSearchPage /> },
        ],
      },
    ],
  },

  // Paciente: ProtectedRoute → PatientLayout (navbar) → página
  {
        path: '/patient',
    element: <ProtectedRoute allowedRole="PACIENTE" />,
    children: [
      {
        element: <PatientLayout />,
        children: [
          { index: true, element: <Navigate to="book" replace /> },
          { path: 'book', element: <BookAppointmentPage /> },
          { path: 'appointments', element: <MyAppointmentsPage /> },
        ],
      },
    ],
  },

  // La demo no es una ruta de la aplicación en producción.
  ...(import.meta.env.DEV
    ? [{
        path: '/componentes',
        lazy: async () => {
          const { default: Component } = await import('../modules/shared/pages/ComponentsDemoPage.jsx')
          return { Component }
        },
      }]
    : []),

  { path: '*', element: <NotFoundPage /> },
])
