import { useId, useState } from "react";
import { Search } from "lucide-react";
import Input from "../atoms/Input.jsx";

function SearchBar({
  placeholder = "Buscar...",
  onSearch,
  minLength = 3,
}) {
  const inputId = useId();
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    const searchText = text.trim();

    if (searchText !== "" && searchText.length < minLength) {
      setError(`Escribí al menos ${minLength} letras.`);
      return;
    }

    setError("");
    onSearch(searchText);
  }

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start"
    >
      <div className="min-w-0 flex-1">
        <Input
          id={inputId}
          label="Buscar"
          type="search"
          placeholder={placeholder}
          maxLength={100}
          value={text}
          error={error}
          className="min-h-10 w-full px-3"
          onChange={(event) => {
            setText(event.target.value);
            setError("");
          }}
        />
      </div>

      <button
        type="submit"
        className="inline-flex min-h-10 items-center justify-center gap-2 self-start rounded-md bg-sky-900 px-4 text-sm text-white hover:bg-sky-800 sm:mt-7"
      >
        <Search size={18} aria-hidden="true" />
        Buscar
      </button>
    </form>
  );
}

export default SearchBar;