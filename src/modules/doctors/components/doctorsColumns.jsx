import DoctorActions from "./DoctorActions.jsx";
import DoctorIdentity from "./DoctorIdentity.jsx";

// Recibe onDelete porque qué hacer al borrar lo decide la página (hijo → padre)
export function getDoctorsColumns(onDelete) {
  return [
    {
      key: "name",
      header: "Doctor",
      render: (doctor) => <DoctorIdentity doctor={doctor} />,
    },
    {
      key: "specialty",
      header: "Especialidad",
      render: (doctor) => (
        <span className="inline-flex rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-800">
          {doctor.specialty?.name ?? "Sin especialidad"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Acciones",
      render: (doctor) => <DoctorActions doctor={doctor} onDelete={onDelete} />,
    },
  ];
}