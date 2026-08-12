import SkillBadge from './SkillBadge';

export default function JobCard({ job, selected, onSelect }) {
  const matchingSkills = job.matchingSkills || [];

  return (
    <button
      type="button"
      onClick={() => onSelect(job.jobId)}
      className={`w-full rounded-2xl border p-4 text-left transition ${
        selected
          ? 'border-accent bg-accent-soft/40 shadow-sm ring-2 ring-accent/20'
          : 'border-line bg-surface hover:border-accent/40 hover:shadow-sm'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-ink">{job.jobTitle || job.title}</h3>
          <p className="mt-1 text-sm font-medium text-accent-dark">
            {job.companyName}
          </p>
        </div>
        {typeof job.matchCount === 'number' ? (
          <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-accent-dark ring-1 ring-teal-200">
            {job.matchCount} match{job.matchCount === 1 ? '' : 'es'}
          </span>
        ) : null}
      </div>

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
        <span>{job.location}</span>
        <span>{job.experience}</span>
      </div>

      <div className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
          Matching skills
        </p>
        {matchingSkills.length === 0 ? (
          <p className="mt-2 text-sm text-muted">No matching skills listed.</p>
        ) : (
          <div className="mt-2 flex flex-wrap gap-2">
            {matchingSkills.map((skill) => (
              <SkillBadge
                key={skill.id}
                name={skill.name}
                category={skill.category}
                tone="match"
              />
            ))}
          </div>
        )}
      </div>
    </button>
  );
}
