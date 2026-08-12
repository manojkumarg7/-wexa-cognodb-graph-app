import SkillBadge from './SkillBadge';
import LoadingState from './LoadingState';
import EmptyState from './EmptyState';
import ErrorState from './ErrorState';

export default function JobDetails({
  job,
  relatedSkills = [],
  loading,
  error,
  onRetry,
}) {
  if (loading) {
    return <LoadingState label="Loading job details..." />;
  }

  if (error) {
    return (
      <ErrorState title="Could not load job details" message={error} onRetry={onRetry} />
    );
  }

  if (!job) {
    return (
      <EmptyState
        title="Select a job"
        description="Click a recommended job to see company details and required skills."
      />
    );
  }

  const uniqueRelatedSkills = relatedSkills.filter(
    (skill, index, list) =>
      skill?.id && list.findIndex((item) => item.id === skill.id) === index
  );

  return (
    <section className="rounded-2xl border border-line bg-surface p-5 shadow-sm shadow-slate-200/40">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
        Job details
      </p>
      <h2 className="mt-2 text-xl font-bold text-ink">{job.title}</h2>
      <p className="mt-1 text-sm font-semibold text-accent-dark">{job.companyName}</p>

      <dl className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl bg-slate-50 px-3 py-2.5">
          <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">
            Industry
          </dt>
          <dd className="mt-1 text-sm font-medium text-ink">{job.industry}</dd>
        </div>
        <div className="rounded-xl bg-slate-50 px-3 py-2.5">
          <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">
            Location
          </dt>
          <dd className="mt-1 text-sm font-medium text-ink">{job.location}</dd>
        </div>
        <div className="rounded-xl bg-slate-50 px-3 py-2.5 sm:col-span-2">
          <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">
            Experience
          </dt>
          <dd className="mt-1 text-sm font-medium text-ink">{job.experience}</dd>
        </div>
      </dl>

      <div className="mt-5">
        <h3 className="text-sm font-semibold text-ink">Required skills</h3>
        {(job.requiredSkills || []).length === 0 ? (
          <div className="mt-3">
            <EmptyState
              title="No required skills"
              description="This job does not list required skills yet."
            />
          </div>
        ) : (
          <div className="mt-3 flex flex-wrap gap-2">
            {job.requiredSkills.map((skill) => (
              <SkillBadge
                key={skill.id}
                name={skill.name}
                category={skill.category}
              />
            ))}
          </div>
        )}
      </div>

      <div className="mt-5">
        <h3 className="text-sm font-semibold text-ink">Related skills</h3>
        <p className="mt-1 text-sm text-muted">
          Adjacent skills from the graph that can strengthen this recommendation.
        </p>
        {uniqueRelatedSkills.length === 0 ? (
          <div className="mt-3">
            <EmptyState
              title="No related skills"
              description="No RELATED_TO connections were returned for the matching skills."
            />
          </div>
        ) : (
          <div className="mt-3 flex flex-wrap gap-2">
            {uniqueRelatedSkills.map((skill) => (
              <SkillBadge
                key={skill.id}
                name={skill.name}
                category={skill.category}
                tone="related"
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
