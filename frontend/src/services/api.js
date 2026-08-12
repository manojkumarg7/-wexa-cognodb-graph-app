const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

async function request(path) {
  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`);
  } catch {
    throw new Error(
      'Unable to reach the backend. Make sure the API is running on the configured URL.'
    );
  }

  let payload = null;

  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    const message =
      payload?.message ||
      payload?.error ||
      `Request failed with status ${response.status}`;
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  return payload?.data ?? payload;
}

export function getUsers() {
  return request('/users');
}

export function getUserSkills(userId) {
  return request(`/users/${encodeURIComponent(userId)}/skills`);
}

export function getUserRecommendations(userId) {
  return request(`/users/${encodeURIComponent(userId)}/recommendations`);
}

export function getJobById(jobId) {
  return request(`/jobs/${encodeURIComponent(jobId)}`);
}

export { API_BASE_URL };
