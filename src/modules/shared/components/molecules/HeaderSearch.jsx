import { Search } from "lucide-react";
import { useId, useState } from "react";

// Buscador chico con lupa, como el de los encabezados del mockup.
// Busca al apretar Enter; con el campo vacío vuelve a mostrar todo.
function HeaderSearch({
  placeholder = "Buscar...",
  label = "Buscar",
  onSearch,
  className = "",
}) {
  const inputId = useId();
  const [text, setText] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    onSearch(text.trim());
  }

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      className={`w-full sm:w-72 ${className}`}
    >
      <label htmlFor={inputId} className="sr-only">
        {label}
      </label>
      <div className="relative">
        <Search
          size={18}
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
        />
        <input
          id={inputId}
          type="search"
          value={text}
          maxLength={100}
          placeholder={placeholder}
          onChange={(event) => setText(event.target.value)}
          className="min-h-10 w-full bg-white pr-3 pl-10 text-sm"
        />
      </div>
    </form>
  );
}

export default HeaderSearch;
