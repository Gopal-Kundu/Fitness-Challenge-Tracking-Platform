const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.MODE === 'development' ? '/api' : 'https://fitness-challenge-tracking-platform-beta.vercel.app/api');

let activeRequestsCount = 0;
const loadingSubscribers = new Set<(loading: boolean) => void>();

const notifySubscribers = () => {
  const isLoading = activeRequestsCount > 0;
  loadingSubscribers.forEach((cb) => cb(isLoading));
};

export const subscribeAPILoading = (callback: (loading: boolean) => void) => {
  loadingSubscribers.add(callback);
  callback(activeRequestsCount > 0);
  return () => {
    loadingSubscribers.delete(callback);
  };
};

async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  activeRequestsCount++;
  notifySubscribers();

  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  const config: RequestInit = {
    credentials: 'include',
    ...options,
    headers: {
      ...defaultHeaders,
      ...(options.headers as Record<string, string>),
    },
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }
    return data;
  } catch (error: any) {
    throw error;
  } finally {
    activeRequestsCount = Math.max(0, activeRequestsCount - 1);
    notifySubscribers();
  }
}

// Authentication API
export const authAPI = {
  register: (userData: any) => fetchAPI('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
  login: (credentials: any) => fetchAPI('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  logout: () => fetchAPI('/auth/logout', { method: 'POST' }),
  getMe: () => fetchAPI('/auth/me'),
};

// User API
export const userAPI = {
  getProfile: () => fetchAPI('/users/profile'),
  updateProfile: (profileData: any) => fetchAPI('/users/profile', { method: 'PUT', body: JSON.stringify(profileData) }),
  getAllUsers: () => fetchAPI('/users'),
  assignTrainer: (data: any) => fetchAPI('/users/assign-trainer', { method: 'PUT', body: JSON.stringify(data) }),
};

// Workouts API
export const workoutAPI = {
  getAllWorkouts: () => fetchAPI('/workouts'),
  getWorkoutById: (id: string) => fetchAPI(`/workouts/${id}`),
  createWorkout: (workoutData: any) => fetchAPI('/workouts', { method: 'POST', body: JSON.stringify(workoutData) }),
  assignWorkout: (id: string, assignData: any) => fetchAPI(`/workouts/${id}/assign`, { method: 'POST', body: JSON.stringify(assignData) }),
  completeWorkout: (id: string) => fetchAPI(`/workouts/${id}/complete`, { method: 'POST' }),
};

// Challenges API
export const challengeAPI = {
  getAllChallenges: () => fetchAPI('/challenges'),
  getChallengeById: (id: string) => fetchAPI(`/challenges/${id}`),
  createChallenge: (challengeData: any) => fetchAPI('/challenges', { method: 'POST', body: JSON.stringify(challengeData) }),
  joinChallenge: (id: string) => fetchAPI(`/challenges/${id}/join`, { method: 'POST' }),
  updateChallenge: (id: string, data: any) => fetchAPI(`/challenges/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteChallenge: (id: string) => fetchAPI(`/challenges/${id}`, { method: 'DELETE' }),
};

// Progress API
export const progressAPI = {
  createProgress: (progressData: any) => fetchAPI('/progress', { method: 'POST', body: JSON.stringify(progressData) }),
  addPoints: (id: string, pointsData: any) => fetchAPI(`/progress/${id}/points`, { method: 'PUT', body: JSON.stringify(pointsData) }),
  getChallengeProgress: (challengeId: string) => fetchAPI(`/progress/${challengeId}`),
};

// Leaderboard API
export const leaderboardAPI = {
  getLeaderboard: () => fetchAPI('/leaderboard'),
};

// Trainers API
export const trainerAPI = {
  getTrainerMembers: () => fetchAPI('/trainers/members'),
  createWorkoutPlan: (planData: any) => fetchAPI('/trainers/workout-plan', { method: 'POST', body: JSON.stringify(planData) }),
  createDietPlan: (planData: any) => fetchAPI('/trainers/diet-plan', { method: 'POST', body: JSON.stringify(planData) }),
  addFeedback: (feedbackData: any) => fetchAPI('/trainers/feedback', { method: 'POST', body: JSON.stringify(feedbackData) }),
  completeMemberWorkout: (workoutData: any) => fetchAPI('/trainers/complete-workout', { method: 'POST', body: JSON.stringify(workoutData) }),
};

// Admin API
export const adminAPI = {
  getDashboardStats: () => fetchAPI('/admin/dashboard'),
  addUser: (userData: any) => fetchAPI('/admin/users', { method: 'POST', body: JSON.stringify(userData) }),
  updateUser: (id: string, userData: any) => fetchAPI(`/admin/users/${id}`, { method: 'PUT', body: JSON.stringify(userData) }),
  deleteUser: (id: string) => fetchAPI(`/admin/users/${id}`, { method: 'DELETE' }),
  updateStatus: (id: string, statusData: any) => fetchAPI(`/admin/users/${id}/status`, { method: 'PUT', body: JSON.stringify(statusData) }),
  updateMembership: (id: string, membershipData: any) => fetchAPI(`/admin/users/${id}/membership`, { method: 'PUT', body: JSON.stringify(membershipData) }),
};

export default fetchAPI;
