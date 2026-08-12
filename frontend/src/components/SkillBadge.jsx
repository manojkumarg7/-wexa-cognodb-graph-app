export default function SkillBadge({ name, category, tone = 'default' }) {
  const styles =
    tone === 'match'
      ? 'bg-accent-soft text-accent-dark ring-teal-200'
      : tone === 'related'
        ? 'bg-sky-50 text-sky-800 ring-sky-200'
        : 'bg-slate-100 text-slate-700 ring-slate-200';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${styles}`}
    >
      <span>{name}</span>
      {category ? <span className="font-medium opacity-70">· {category}</span> : null}
    </span>
  );
}
