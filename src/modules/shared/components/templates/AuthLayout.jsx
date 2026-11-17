import { Outlet } from "react-router-dom";
import Card from "../atoms/Card.jsx";
import "./AuthLayout.css";

// Admite composición directa con children o rutas hijas mediante Outlet.
function AuthLayout({ children, brand, className = "" }) {
  return (
    <main className={`auth-layout ${className}`}>
      {brand}
      <Card className="auth-layout__card">{children ?? <Outlet />}</Card>
    </main>
  );
}

export default AuthLayout;
