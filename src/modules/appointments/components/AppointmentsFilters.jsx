import { useForm, useWatch } from "react-hook-form";
import Input from "../../shared/components/atoms/Input.jsx";

const EMPTY_FILTERS = { dni: "", specialtyId: "", doctorId: "", date: "" };
const SELECT_CLASS = "min-h-10 w-full rounded-md border border-slate-300 px-3";

export default function AppointmentsFilters({
  appliedFilters,
  specialties,
  doctors,
  optionsUnavailable,
  onApply,
}) {
  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: EMPTY_FILTERS,
    values: appliedFilters,
  });

  const specialtyId = useWatch({ control, name: "specialtyId" });
  const visibleDoctors = specialtyId
    ? doctors.filter((doctor) => doctor.specialty?.id === specialtyId)
    : doctors;

  function clearFilters() {
    reset(EMPTY_FILTERS);
    onApply({ ...EMPTY_FILTERS });
  }

  return (
    <form onSubmit={handleSubmit(onApply)} className="mb-4 space-y-4" noValidate>
      <fieldset>
        <legend className="mb-3 font-semibold">Criterios de búsqueda</legend>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Input
            id="appointment-dni"
            label="DNI del paciente"
            inputMode="numeric"
            error={errors.dni?.message ?? ""}
            {...register("dni", {
              pattern: {
                value: /^\d{7,8}$/,
                message: "Ingresá un DNI de 7 u 8 dígitos.",
              },
            })}
          />

          <div className="grid content-start gap-1.5">
            <label htmlFor="appointment-specialty">Especialidad</label>
            <select
              id="appointment-specialty"
              className={SELECT_CLASS}
              disabled={optionsUnavailable}
              {...register("specialtyId", {
                onChange: () => setValue("doctorId", ""),
              })}
            >
              <option value="">Todas las especialidades</option>
              {specialties.map((specialty) => (
                <option key={specialty.id} value={specialty.id}>
                  {specialty.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid content-start gap-1.5">
            <label htmlFor="appointment-doctor">Médico</label>
            <select
              id="appointment-doctor"
              className={SELECT_CLASS}
              disabled={optionsUnavailable}
              {...register("doctorId")}
            >
              <option value="">Todos los médicos</option>
              {visibleDoctors.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.name}
                </option>
              ))}
            </select>
          </div>

          <Input id="appointment-date" label="Fecha" type="date" {...register("date")} />
        </div>
      </fieldset>

      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" className="rounded-md bg-sky-900 px-4 py-2 text-white">
          Aplicar filtros
        </button>
        <button type="button" className="px-2 py-2 text-sky-900 underline" onClick={clearFilters}>
          Limpiar
        </button>
      </div>
    </form>
  );
}
