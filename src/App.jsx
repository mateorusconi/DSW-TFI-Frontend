import { RouterProvider } from 'react-router-dom'
import { router } from './router'

// En SCRUM-23 se suma acá el <AuthProvider> envolviendo al RouterProvider.
function App() {
  return <RouterProvider router={router} />
}

export default App
