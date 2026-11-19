// Primera letra de las dos primeras palabras: "Ana López" → "AL"
function getInitials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("");
}

function DoctorIdentity({ doctor }) {
  return (
    <div className="flex items-center gap-3">
      <span
        aria-hidden="true"
        className="flex size-10 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sm font-semibold text-sky-900"
      >
        {getInitials(doctor.name)}
      </span>

      <div className="min-w-0">
        <p className="truncate font-semibold text-slate-900">{doctor.name}</p>
        <p className="text-sm text-slate-500">Mat. {doctor.licenseNumber}</p>
      </div>
    </div>
  );
}

export default DoctorIdentity;