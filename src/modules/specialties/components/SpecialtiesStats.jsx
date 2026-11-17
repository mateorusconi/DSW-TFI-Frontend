import Card from "../../shared/components/atoms/Card.jsx";
import "./SpecialtiesStats.css";

function SpecialtiesStats({ total }) {
  // Se conservan las estadísticas de ejemplo hasta contar con datos de la API.
  const stats = [
    {
      key: "total",
      title: "Total especialidades",
      value: total,
      description: "Especialidades de esta prueba",
    },
    {
      key: "most-demanded",
      title: "Más demandada",
      value: "Cardiología",
      description: "Dato de ejemplo",
    },
    {
      key: "new-this-month",
      title: "Nuevas este mes",
      value: "03",
      description: "Dato de ejemplo",
    },
  ];

  return (
    <ul className="specialties-stats" aria-label="Resumen de especialidades">
      {stats.map((stat) => (
        <li key={stat.key}>
          <Card className="specialties-stat">
            <h2>{stat.title}</h2>
            <p>{stat.value}</p>
            <small>{stat.description}</small>
          </Card>
        </li>
      ))}
    </ul>
  );
}

export default SpecialtiesStats;
