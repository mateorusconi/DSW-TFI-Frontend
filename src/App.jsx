import { useState } from 'react'
import LoginPatientPage from './modules/auth/pages/LoginPages/Patient/LoginPatientPage.jsx'
import LoginAdminPage from './modules/auth/pages/LoginPages/Admin/LoginAdminPage.jsx'
function App() {
  const [pantalla, setPantalla] = useState('paciente')

  return (
    <>
      <nav aria-label="Seleccionar acceso">
        <button
          type="button"
          onClick={() => setPantalla('paciente')}
        >
          Paciente
        </button>

        <button
          type="button"
          onClick={() => setPantalla('admin')}
        >
          Administrador
        </button>
      </nav>

{pantalla === 'paciente'
  ? <LoginPatientPage />
  : <LoginAdminPage />}
    </>
  )
}

export default App