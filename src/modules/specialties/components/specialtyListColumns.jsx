import SpecialtyActions from "./SpecialtyActions.jsx";
import SpecialtyName from "./SpecialtyName.jsx";
import SpecialtyStatusBadge from "./SpecialtyStatusBadge.jsx";

// Columnas del mockup: nombre con ícono, descripción, estado y acciones
export function getSpecialtyListColumns(onDelete) {
  return [
    {
      key: "name",
      header: "Nombre de la especialidad",
      render: (specialty) => <SpecialtyName specialty={specialty} />,
    },
    { key: "description", header: "Descripción" },
    {
      key: "isActive",
      header: "Estado",
      render: (specialty) => (
        <SpecialtyStatusBadge active={specialty.isActive} />
      ),
    },
    {
      key: "actions",
      header: "Acciones",
      render: (specialty) => (
        <SpecialtyActions specialty={specialty} onDelete={onDelete} />
      ),
    },
  ];
}
