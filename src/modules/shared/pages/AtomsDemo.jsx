import { Mail, Save } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import Button from "../components/atoms/Button.jsx";
import Input from "../components/atoms/Input.jsx";
import Select from "../components/atoms/Select.jsx";
import Spinner from "../components/atoms/Spinner.jsx";
import Textarea from "../components/atoms/Textarea.jsx";

const DEMO_OPTIONS = [
  { value: "1", label: "Opción 1" },
  { value: "2", label: "Opción 2" },
];

function AtomsDemo() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { email: "", option: "", note: "" } });

  const note = useWatch({ control, name: "note" });

  // Simula un envío lento para ver el Button en estado loading
  async function onSubmit() {
    await new Promise((resolve) => setTimeout(resolve, 1500));
  }

  return (
    <section className="mb-10 space-y-6 rounded-lg border border-slate-200 bg-white p-6">
      <h2 className="text-xl font-semibold">Átomos</h2>

      <div className="flex flex-wrap items-center gap-3">
        <Button>Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="danger">Danger</Button>
        <Button variant="ghost">Ghost</Button>
        <Button disabled>Deshabilitado</Button>
        <Button loading>Cargando</Button>
        <Spinner size={24} />
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="grid gap-5 md:grid-cols-2"
      >
        <Input
          id="demo-email"
          label="Email"
          type="email"
          icon={Mail}
          error={errors.email?.message ?? ""}
          {...register("email", { required: "El email es obligatorio." })}
        />

        <Select
          id="demo-option"
          label="Opción"
          options={DEMO_OPTIONS}
          error={errors.option?.message ?? ""}
          {...register("option", { required: "Elegí una opción." })}
        />

        <div className="md:col-span-2">
          <Textarea
            id="demo-note"
            label="Nota"
            maxLength={100}
            currentLength={note?.length ?? 0}
            error={errors.note?.message ?? ""}
            {...register("note", { required: "La nota es obligatoria." })}
          />
        </div>

        <div className="md:col-span-2">
          <Button type="submit" icon={Save} loading={isSubmitting}>
            Enviar
          </Button>
        </div>
      </form>
    </section>
  );
}

export default AtomsDemo;