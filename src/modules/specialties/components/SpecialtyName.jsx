import { Baby, Bone, Brain, Eye, FlaskConical, Heart, Stethoscope } from "lucide-react";

// Ícono según el nombre, como en el mockup; las que no están en la lista usan el estetoscopio.
// Se guardan los elementos ya armados (no los componentes) para no crear componentes durante el render.
const ICONS = [
  [/cardio/i, <Heart key="heart" size={20} aria-hidden="true" />],
  [/neuro/i, <Brain key="brain" size={20} aria-hidden="true" />],
  [/derma/i, <FlaskConical key="flask" size={20} aria-hidden="true" />],
  [/pediatr/i, <Baby key="baby" size={20} aria-hidden="true" />],
  [/trauma/i, <Bone key="bone" size={20} aria-hidden="true" />],
  [/oftalm/i, <Eye key="eye" size={20} aria-hidden="true" />],
];
const DEFAULT_ICON = <Stethoscope size={20} aria-hidden="true" />;

function SpecialtyName({ specialty }) {
  const icon = ICONS.find(([pattern]) => pattern.test(specialty.name))?.[1] ?? DEFAULT_ICON;

  return (
    <div className="flex items-center gap-3">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-700">
        {icon}
      </span>
      <span className="font-semibold text-primary-700">{specialty.name}</span>
    </div>
  );
}

export default SpecialtyName;
