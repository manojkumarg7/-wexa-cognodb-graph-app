export default function ErrorState({ title = 'Something went wrong', message, onRetry }) {
  return (
    <div
      className="rounded-2xl border border-red-200 bg-danger-soft px-4 py-4 text-sm text-danger"
      role="alert"
    >
      <p className="font-semibold">{title}</p>
      {message ? <p className="mt-1 leading-6 text-red-700/90">{message}</p> : null}
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-3 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-danger ring-1 ring-red-200 transition hover:bg-red-50"
        >
          Try again
        </button>
      ) : null}
    </div>
  );
}
