export default function EmptyState({ title, description }) {
  return (
    <div className="rounded-2xl border border-dashed border-line bg-surface/70 px-5 py-8 text-center">
      <p className="text-sm font-semibold text-ink">{title}</p>
      {description ? (
        <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
      ) : null}
    </div>
  );
}
