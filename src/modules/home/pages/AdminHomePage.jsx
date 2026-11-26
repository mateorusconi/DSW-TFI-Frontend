import { Plus } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../../../router/paths.js";
import Button from "../../shared/components/atoms/Button.jsx";
import PageHeader from "../../shared/components/molecules/PageHeader.jsx";
import { toLocalISODate } from "../../shared/helpers/dates.js";
import DashboardStats from "../components/DashboardStats.jsx";
import DoctorsDirectory from "../components/DoctorsDirectory.jsx";

// Tablero según el mockup v1.4: tarjetas de indicadores y directorio de médicos
function AdminHomePage() {
  const navigate = useNavigate();
  // La fecha de "hoy" se fija al entrar, así la tarjeta de turnos no cambia sola a medianoche
  const [today] = useState(() => toLocalISODate(new Date()));

  return (
    <div>
      <PageHeader
        title="Vista General de Gestión"
        subtitle="Configure el personal médico y las especialidades del departamento."
        actions={
          <div className="flex flex-wrap gap-2">
            <Button icon={Plus} onClick={() => navigate(PATHS.doctorNew)}>
              Agregar Nuevo Doctor
            </Button>
            <Button
              variant="secondary"
              icon={Plus}
              className="border-primary-700! text-primary-700!"
              onClick={() => navigate(PATHS.specialtyNew)}
            >
              Agregar Nueva Especialidad
            </Button>
          </div>
        }
      />

      <DashboardStats date={today} />

      <DoctorsDirectory />
    </div>
  );
}

export default AdminHomePage;
