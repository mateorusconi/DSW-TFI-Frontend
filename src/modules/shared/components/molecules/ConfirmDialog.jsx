import { useEffect, useId, useRef } from "react";

function ConfirmDialog({
  title,
  message,
  onCancel,
  onConfirm,
  confirmLabel = "Confirmar",
  confirmDisabled = false,
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
    onCancel();
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      aria-describedby={messageId}
      onCancel={handleCancel}
      className="m-auto w-11/12 max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-xl backdrop:bg-slate-900/50"
    >
      <h2 id={titleId} className="text-xl font-semibold text-slate-900">
        {title}
      </h2>

      <p id={messageId} className="mt-3 text-sm leading-6 text-slate-600">
        {message}
      </p>

      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          autoFocus
          onClick={onCancel}
          className="rounded-md border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50"
        >
          Cancelar
        </button>

        <button
          type="button"
          onClick={onConfirm}
          disabled={confirmDisabled || !onConfirm}
          className="rounded-md bg-red-700 px-4 py-2 text-sm text-white hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {confirmLabel}
        </button>
      </div>
    </dialog>
  );
}

export default ConfirmDialog;