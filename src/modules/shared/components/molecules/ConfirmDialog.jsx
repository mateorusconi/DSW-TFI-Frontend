import { useEffect, useId, useRef } from "react";

function ConfirmDialog({
  title,
  message,
  onCancel,
  onConfirm,
  confirmLabel = "Confirmar",
  confirmDisabled = false,
  loading = false,
  error = "",
}) {
  const dialogRef = useRef(null);
  const titleId = useId();
  const messageId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog.open) {
      dialog.showModal();
    }

    return () => {
      dialog.close();
    };
  }, []);

  function handleCancel(event) {
    event.preventDefault();

    if (!loading) {
      onCancel();
    }
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      aria-describedby={messageId}
      aria-busy={loading}
      onCancel={handleCancel}
      className="m-auto w-11/12 max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-xl backdrop:bg-slate-900/50"
    >
      <h2 id={titleId} className="text-xl font-semibold text-slate-900">
        {title}
      </h2>

      <p id={messageId} className="mt-3 text-sm leading-6 text-slate-600">
        {message}
      </p>

      {error && (
        <p
          role="alert"
          className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800"
        >
          {error}
        </p>
      )}

      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          autoFocus
          onClick={onCancel}
          disabled={loading}
          className="rounded-md border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Cancelar
        </button>

        <button
          type="button"
          onClick={onConfirm}
          disabled={loading || confirmDisabled || !onConfirm}
          className="rounded-md bg-red-700 px-4 py-2 text-sm text-white hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Procesando..." : confirmLabel}
        </button>
      </div>
    </dialog>
  );
}

export default ConfirmDialog;
