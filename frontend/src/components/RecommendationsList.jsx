import JobCard from './JobCard';
import LoadingState from './LoadingState';
import EmptyState from './EmptyState';
import ErrorState from './ErrorState';

export default function RecommendationsList({
  recommendations,
  selectedJobId,
  onSelectJob,
  loading,
  error,
  onRetry,
}) {
  if (loading) {
    return <LoadingState label="Finding recommended jobs..." />;
  }

  if (error) {
    return (
      <ErrorState
        title="Could not load recommendations"
        message={error}
        onRetry={onRetry}
      />
    );
  }

  if (!recommendations || recommendations.length === 0) {
    return (
      <EmptyState
        title="No recommendations yet"
        description="No jobs currently match this user's skills through the graph."
      />
    );
  }

  return (
    <div className="grid gap-3">
      {recommendations.map((job) => (
        <JobCard
          key={job.jobId}
          job={job}
          selected={selectedJobId === job.jobId}
          onSelect={onSelectJob}
        />
      ))}
    </div>
  );
}
