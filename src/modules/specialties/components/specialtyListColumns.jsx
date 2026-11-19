import SpecialtyActions from "./SpecialtyActions.jsx";

export function getSpecialtyListColumns(onDelete) {
  return [
    { key: "name", header: "Nombre de la especialidad" },
    { key: "description", header: "Descripción" },
    {
      key: "actions",
      header: "Acciones",
      render: (specialty) => (
        <SpecialtyActions specialty={specialty} onDelete={onDelete} />
      ),
    },
  ];
}
