import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";

import LoginPatientPage from "./modules/auth/pages/LoginPages/Patient/LoginPatientPage.jsx";
import LoginAdminPage from "./modules/auth/pages/LoginPages/Admin/LoginAdminPage.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/paciente/login" replace />,
  },
  {
    path: "/paciente/login",
    element: <LoginPatientPage />,
  },
  {
    path: "/admin/login",
    element: <LoginAdminPage />,
  },
  {
    path: "*",
    element: <h1>Página no encontrada</h1>,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;