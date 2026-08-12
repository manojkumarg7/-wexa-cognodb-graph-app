import SkillBadge from './SkillBadge';
import LoadingState from './LoadingState';
import EmptyState from './EmptyState';
import ErrorState from './ErrorState';

export default function UserProfile({ user, skills, loading, error, onRetry }) {
  if (loading) {
    return <LoadingState label="Loading profile and skills..." />;
  }

  if (error) {
    return (
      <ErrorState
        title="Could not load user profile"
        message={error}
        onRetry={onRetry}
      />
    );
  }

  if (!user) {
    return (
      <EmptyState
        title="No user selected"
        description="Choose a user to view their profile and skills."
      />
    );
  }

  return (
    <section className="rounded-2xl border border-line bg-surface p-5 shadow-sm shadow-slate-200/40">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
            User profile
          </p>
          <h2 className="mt-2 text-xl font-bold text-ink">{user.name}</h2>
          <p className="mt-1 text-sm text-muted">{user.email}</p>
        </div>
        <span className="mt-3 inline-flex w-fit rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 sm:mt-0">
          {skills.length} skill{skills.length === 1 ? '' : 's'}
        </span>
      </div>

      <div className="mt-5">
        <h3 className="text-sm font-semibold text-ink">Skills</h3>
        {skills.length === 0 ? (
          <div className="mt-3">
            <EmptyState
              title="No skills found"
              description="This user does not have any skills in the graph yet."
            />
          </div>
        ) : (
          <div className="mt-3 flex flex-wrap gap-2">
            {skills.map((skill) => (
              <SkillBadge
                key={skill.id}
                name={skill.name}
                category={skill.category}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
