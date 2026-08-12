import { useCallback, useEffect, useMemo, useState } from 'react';
import Header from '../components/Header';
import UserSelector from '../components/UserSelector';
import UserProfile from '../components/UserProfile';
import RecommendationsList from '../components/RecommendationsList';
import JobDetails from '../components/JobDetails';
import ErrorState from '../components/ErrorState';
import LoadingState from '../components/LoadingState';
import {
  getJobById,
  getUserRecommendations,
  getUserSkills,
  getUsers,
} from '../services/api';

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [usersError, setUsersError] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');

  const [profile, setProfile] = useState(null);
  const [skills, setSkills] = useState([]);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState('');

  const [recommendations, setRecommendations] = useState([]);
  const [recommendationsLoading, setRecommendationsLoading] = useState(false);
  const [recommendationsError, setRecommendationsError] = useState('');

  const [selectedJobId, setSelectedJobId] = useState('');
  const [jobDetails, setJobDetails] = useState(null);
  const [jobLoading, setJobLoading] = useState(false);
  const [jobError, setJobError] = useState('');

  const loadUsers = useCallback(async () => {
    setUsersLoading(true);
    setUsersError('');

    try {
      const data = await getUsers();
      const list = Array.isArray(data) ? data : [];
      setUsers(list);
      setSelectedUserId((current) => current || list[0]?.id || '');
    } catch (error) {
      setUsers([]);
      setSelectedUserId('');
      setUsersError(error.message);
    } finally {
      setUsersLoading(false);
    }
  }, []);

  const loadUserData = useCallback(async (userId) => {
    if (!userId) {
      setProfile(null);
      setSkills([]);
      setRecommendations([]);
      setSelectedJobId('');
      setJobDetails(null);
      return;
    }

    setProfileLoading(true);
    setRecommendationsLoading(true);
    setProfileError('');
    setRecommendationsError('');
    setSelectedJobId('');
    setJobDetails(null);
    setJobError('');

    try {
      const [skillsPayload, recommendationsPayload] = await Promise.all([
        getUserSkills(userId),
        getUserRecommendations(userId),
      ]);

      setProfile(skillsPayload?.user || null);
      setSkills(Array.isArray(skillsPayload?.skills) ? skillsPayload.skills : []);
      setRecommendations(
        Array.isArray(recommendationsPayload?.recommendations)
          ? recommendationsPayload.recommendations
          : []
      );
    } catch (error) {
      setProfile(null);
      setSkills([]);
      setRecommendations([]);
      setProfileError(error.message);
      setRecommendationsError(error.message);
    } finally {
      setProfileLoading(false);
      setRecommendationsLoading(false);
    }
  }, []);

  const loadJobDetails = useCallback(async (jobId) => {
    if (!jobId) {
      setJobDetails(null);
      return;
    }

    setJobLoading(true);
    setJobError('');

    try {
      const job = await getJobById(jobId);
      setJobDetails(job);
    } catch (error) {
      setJobDetails(null);
      setJobError(error.message);
    } finally {
      setJobLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  useEffect(() => {
    loadUserData(selectedUserId);
  }, [selectedUserId, loadUserData]);

  useEffect(() => {
    loadJobDetails(selectedJobId);
  }, [selectedJobId, loadJobDetails]);

  const selectedRecommendation = useMemo(
    () => recommendations.find((job) => job.jobId === selectedJobId) || null,
    [recommendations, selectedJobId]
  );

  return (
    <div className="min-h-screen">
      <Header />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <section className="rounded-3xl border border-line bg-white/90 p-5 shadow-sm shadow-slate-200/50 sm:p-7">
          <div className="max-w-2xl">
            <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
              Find roles that fit your skills
            </h2>
            <p className="mt-3 text-sm leading-7 text-muted sm:text-base">
              Select a candidate to explore their skills and graph-powered job
              recommendations from CognoDB — including matching skills, companies,
              and related skill suggestions.
            </p>
          </div>

          <div className="mt-6 max-w-md">
            {usersLoading ? (
              <LoadingState label="Loading users..." />
            ) : usersError ? (
              <ErrorState
                title="Could not load users"
                message={usersError}
                onRetry={loadUsers}
              />
            ) : (
              <UserSelector
                users={users}
                selectedUserId={selectedUserId}
                onChange={setSelectedUserId}
              />
            )}
          </div>
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-6">
            <UserProfile
              user={profile}
              skills={skills}
              loading={profileLoading}
              error={profileError}
              onRetry={() => loadUserData(selectedUserId)}
            />

            <section>
              <div className="mb-3 flex items-end justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-ink">Recommended jobs</h2>
                  <p className="mt-1 text-sm text-muted">
                    Multi-hop matches: User → Skill ← Job
                  </p>
                </div>
              </div>

              <RecommendationsList
                recommendations={recommendations}
                selectedJobId={selectedJobId}
                onSelectJob={setSelectedJobId}
                loading={recommendationsLoading}
                error={recommendationsError}
                onRetry={() => loadUserData(selectedUserId)}
              />
            </section>
          </div>

          <div>
            <JobDetails
              job={jobDetails}
              relatedSkills={selectedRecommendation?.relatedSkills || []}
              loading={jobLoading}
              error={jobError}
              onRetry={() => loadJobDetails(selectedJobId)}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
