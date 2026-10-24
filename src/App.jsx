import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import SpecialtiesListPage from "./modules/specialties/pages/SpecialtiesListPage.jsx";
import LoginPatientPage from "./modules/auth/pages/LoginPages/Patient/LoginPatientPage.jsx";
import LoginAdminPage from "./modules/auth/pages/LoginPages/Admin/LoginAdminPage.jsx";
import "./App.css";

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
    path: "/admin/especialidades",
    element: <SpecialtiesListPage />,
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
