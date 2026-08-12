export default function Header() {
  return (
    <header className="border-b border-line/80 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            Wexa AI · CognoDB
          </p>
          <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight text-ink sm:text-[1.75rem]">
            Job & Skill Recommendation
          </h1>
        </div>
        <div className="hidden rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-accent-dark sm:block">
          Graph-powered matching
        </div>
      </div>
    </header>
  );
}
