import { LoaderCircle } from "lucide-react";

function Spinner({ size = 18 }) {
  return <LoaderCircle size={size} className="animate-spin" aria-hidden="true" />;
}

export default Spinner;