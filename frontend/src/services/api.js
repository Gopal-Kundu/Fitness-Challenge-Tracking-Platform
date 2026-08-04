const API_BASE_URL = '/api';

let activeRequestsCount = 0;
const loadingSubscribers = new Set();

const notifySubscribers = () => {
  const isLoading = activeRequestsCount > 0;
  loadingSubscribers.forEach((cb) => cb(isLoading));
};

export const subscribeAPILoading = (callback) => {
  loadingSubscribers.add(callback);
  callback(activeRequestsCount > 0);
  return () => loadingSubscribers.delete(callback);
};

async function fetchAPI(endpoint, options = {}) {
  activeRequestsCount++;
  notifySubscribers();

  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const config = {
    credentials: 'include',
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }
    return data;
  } catch (error) {
    throw error;
  } finally {
    activeRequestsCount = Math.max(0, activeRequestsCount - 1);
    notifySubscribers();
  }
}

// Authentication API
export const authAPI = {
  register: (userData) => fetchAPI('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
  login: (credentials) => fetchAPI('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  logout: () => fetchAPI('/auth/logout', { method: 'POST' }),
  getMe: () => fetchAPI('/auth/me'),
};

// User API
export const userAPI = {
  getProfile: () => fetchAPI('/users/profile'),
  updateProfile: (profileData) => fetchAPI('/users/profile', { method: 'PUT', body: JSON.stringify(profileData) }),
  getAllUsers: () => fetchAPI('/users'),
  assignTrainer: (data) => fetchAPI('/users/assign-trainer', { method: 'PUT', body: JSON.stringify(data) }),
};

// Workouts API
export const workoutAPI = {
  getAllWorkouts: () => fetchAPI('/workouts'),
  getWorkoutById: (id) => fetchAPI(`/workouts/${id}`),
  createWorkout: (workoutData) => fetchAPI('/workouts', { method: 'POST', body: JSON.stringify(workoutData) }),
  assignWorkout: (id, assignData) => fetchAPI(`/workouts/${id}/assign`, { method: 'POST', body: JSON.stringify(assignData) }),
  completeWorkout: (id) => fetchAPI(`/workouts/${id}/complete`, { method: 'POST' }),
};

// Challenges API
export const challengeAPI = {
  getAllChallenges: () => fetchAPI('/challenges'),
  getChallengeById: (id) => fetchAPI(`/challenges/${id}`),
  createChallenge: (challengeData) => fetchAPI('/challenges', { method: 'POST', body: JSON.stringify(challengeData) }),
  joinChallenge: (id) => fetchAPI(`/challenges/${id}/join`, { method: 'POST' }),
  updateChallenge: (id, data) => fetchAPI(`/challenges/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteChallenge: (id) => fetchAPI(`/challenges/${id}`, { method: 'DELETE' }),
};

// Progress API
export const progressAPI = {
  createProgress: (progressData) => fetchAPI('/progress', { method: 'POST', body: JSON.stringify(progressData) }),
  addPoints: (id, pointsData) => fetchAPI(`/progress/${id}/points`, { method: 'PUT', body: JSON.stringify(pointsData) }),
  getChallengeProgress: (challengeId) => fetchAPI(`/progress/${challengeId}`),
};

// Leaderboard API
export const leaderboardAPI = {
  getLeaderboard: () => fetchAPI('/leaderboard'),
};

// Trainers API
export const trainerAPI = {
  getTrainerMembers: () => fetchAPI('/trainers/members'),
  createWorkoutPlan: (planData) => fetchAPI('/trainers/workout-plan', { method: 'POST', body: JSON.stringify(planData) }),
  createDietPlan: (planData) => fetchAPI('/trainers/diet-plan', { method: 'POST', body: JSON.stringify(planData) }),
  addFeedback: (feedbackData) => fetchAPI('/trainers/feedback', { method: 'POST', body: JSON.stringify(feedbackData) }),
  completeMemberWorkout: (workoutData) => fetchAPI('/trainers/complete-workout', { method: 'POST', body: JSON.stringify(workoutData) }),
};

// Admin API
export const adminAPI = {
  getDashboardStats: () => fetchAPI('/admin/dashboard'),
  addUser: (userData) => fetchAPI('/admin/users', { method: 'POST', body: JSON.stringify(userData) }),
  updateUser: (id, userData) => fetchAPI(`/admin/users/${id}`, { method: 'PUT', body: JSON.stringify(userData) }),
  deleteUser: (id) => fetchAPI(`/admin/users/${id}`, { method: 'DELETE' }),
  updateStatus: (id, statusData) => fetchAPI(`/admin/users/${id}/status`, { method: 'PUT', body: JSON.stringify(statusData) }),
  updateMembership: (id, membershipData) => fetchAPI(`/admin/users/${id}/membership`, { method: 'PUT', body: JSON.stringify(membershipData) }),
};
