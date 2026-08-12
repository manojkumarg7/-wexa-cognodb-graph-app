export default function LoadingState({ label = 'Loading...' }) {
  return (
    <div
      className="flex items-center gap-3 rounded-2xl border border-line bg-surface px-4 py-5 text-sm text-muted"
      role="status"
      aria-live="polite"
    >
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-accent/30 border-t-accent" />
      <span>{label}</span>
    </div>
  );
}
