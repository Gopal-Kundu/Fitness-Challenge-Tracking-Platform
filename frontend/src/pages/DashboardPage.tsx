import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Header from '../components/Header';
import WorkoutModal from '../components/WorkoutModal';
import ChallengeModal from '../components/ChallengeModal';
import AdminPage from './AdminPage';
import TrainerPage from './TrainerPage';
import { workoutAPI, challengeAPI, userAPI, authAPI } from '../services/api';
import { updateUser } from '../store/userSlice';

function DashboardPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const reduxUser = useSelector((state: any) => state.user);

  const [activeWorkout, setActiveWorkout] = useState<any>(null);
  const [activeChallenge, setActiveChallenge] = useState<any>(null);

  const [workouts, setWorkouts] = useState<any[]>([]);
  const [challenges, setChallenges] = useState<any[]>([]);

  const fetchDashboardData = () => {
    Promise.all([
      workoutAPI.getAllWorkouts().catch(() => []),
      challengeAPI.getAllChallenges().catch(() => []),
      userAPI.getProfile().catch(() => authAPI.getMe().catch(() => null))
    ]).then(([workoutRes, challengeRes, userRes]) => {
      const fetchedWorkouts = Array.isArray(workoutRes) ? workoutRes : (workoutRes?.workouts || []);
      const fetchedChallenges = Array.isArray(challengeRes) ? challengeRes : (challengeRes?.challenges || []);
      const user = userRes?.user || userRes;

      if (Array.isArray(fetchedWorkouts)) setWorkouts(fetchedWorkouts);
      if (Array.isArray(fetchedChallenges)) setChallenges(fetchedChallenges);
      if (user) {
        dispatch(updateUser(user));
      }
    });
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Role-based main dashboard router
  if (reduxUser?.role === 'admin') {
    return <AdminPage />;
  }

  if (reduxUser?.role === 'trainer') {
    return <TrainerPage />;
  }

  const handleCloseWorkoutModal = () => {
    setActiveWorkout(null);
    fetchDashboardData();
  };

  const totalCaloriesBurned = reduxUser?.completedCalories || 0;
  const totalWorkoutsCount = reduxUser?.completedWorkoutsCount || 0;
  const completedChallengesCount = reduxUser?.completedChallengesCount || 0;

  const recentWorkout = reduxUser?.recentWorkout || workouts[0] || null;

  const featuredChallenge = challenges[0] || null;
  const isFeaturedJoined =
    featuredChallenge &&
    Array.isArray(reduxUser?.joinedChallenges) &&
    reduxUser.joinedChallenges.some(
      (item: any) =>
        String(item) === String(featuredChallenge.id) ||
        String(item) === String(featuredChallenge._id) ||
        String(item) === String(featuredChallenge.title)
    );

  // Extract first name only
  const fullName = reduxUser?.name || 'Member';
  const firstName = fullName.trim().split(' ')[0];

  return (
    <div className="min-h-screen bg-background text-on-background font-body-md overflow-x-hidden">
      <Header />

      <main className="p-6 md:p-12 max-w-[1440px] mx-auto space-y-gutter">
        {/* Top Hero Section */}
        <section className="bg-surface-container rounded-2xl p-8 border border-outline-variant flex flex-col md:flex-row items-center justify-between gap-6 inner-rim">
          <div className="space-y-2 text-center md:text-left">
            <span className="font-label-caps text-label-caps text-primary-container tracking-widest uppercase">
              Live Performance Ecosystem
            </span>
            <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface uppercase font-bold">
              Welcome back, {firstName}
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
              Track your athletic output, calories burned, and recent training modules in real time.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/workouts')}
              className="bg-primary-container text-on-primary-container font-headline-md text-headline-md px-8 py-4 rounded-lg hover:brightness-110 active:scale-95 transition-all glow-lime cursor-pointer flex items-center gap-2"
            >
              <span className="material-symbols-outlined">bolt</span>
              START SESSION
            </button>
          </div>
        </section>

        {/* Live Metrics Row - Dynamic Calories, Challenges Finished, Workouts Done */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant space-y-2">
            <div className="flex justify-between items-center text-on-surface-variant font-label-caps text-xs">
              <span>CALORIES BURNED</span>
              <span className="material-symbols-outlined text-orange-500">local_fire_department</span>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="font-metric-xl text-4xl text-primary-container font-bold">
                {totalCaloriesBurned.toLocaleString()}
              </span>
              <span className="text-sm font-bold text-on-surface-variant">KCAL</span>
            </div>
            <p className="text-xs text-primary-container font-bold">Total energy output from workouts &amp; challenges</p>
          </div>

          <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant space-y-2">
            <div className="flex justify-between items-center text-on-surface-variant font-label-caps text-xs">
              <span>CHALLENGES FINISHED</span>
              <span className="material-symbols-outlined text-secondary-container">emoji_events</span>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="font-metric-xl text-4xl text-white font-bold">{completedChallengesCount}</span>
              <span className="text-sm font-bold text-on-surface-variant">COMPLETED</span>
            </div>
            <p className="text-xs text-secondary-container font-bold">Community Challenges Conquered</p>
          </div>

          <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant space-y-2">
            <div className="flex justify-between items-center text-on-surface-variant font-label-caps text-xs">
              <span>WORKOUTS DID</span>
              <span className="material-symbols-outlined text-primary">fitness_center</span>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="font-metric-xl text-4xl text-white font-bold">{totalWorkoutsCount}</span>
              <span className="text-sm font-bold text-on-surface-variant">SESSIONS</span>
            </div>
            <p className="text-xs text-primary font-bold">Completed Training Modules</p>
          </div>
        </section>

        {/* Bento Grid Main Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
          {/* Main Recent Workout Card */}
          {recentWorkout ? (
            <div className="lg:col-span-8 bg-surface-container rounded-2xl border border-outline-variant relative overflow-hidden flex flex-col justify-between p-8 group min-h-[340px] shadow-2xl">
              {/* Background Workout Image at 90% Opacity */}
              <img
                src={recentWorkout.image || 'https://lh3.googleusercontent.com/aida-public/AB6AXuD-0zr73DAIZO_i825DqpQ0OCkbZTQSfSruBKmNQhTAyglBvIGDMw_DQ8fqB7yvdmSr9HtB5B_ixPFASWrXh2-paCUnuGiIoTx88yKHx_VI79N8fnTagdiUmVfaqainAYrnHPN2YYusMBAK41WDv2_NDovsLAxvv4yv3qQnuNHYrKpVUOOTkFn1bE5tJVxzTKiDwFD4cFoMrKeheffdQcyf-a4iSBCosQQcRvZtrOcG3VKdiwJWIhN5p5Y8soMkAt008wA0KMzYHgsC'}
                alt={recentWorkout.title || recentWorkout.name}
                className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500 z-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/35 z-0"></div>

              <div className="relative z-10 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="bg-primary-container text-on-primary-container font-label-caps text-[10px] font-bold px-3 py-1 rounded shadow-lg">
                    RECENT WORKOUT
                  </span>
                  <span className="font-label-caps text-xs text-white font-bold bg-black/75 px-3 py-1.5 rounded-lg border border-white/20 backdrop-blur-md shadow-md">
                    {recentWorkout.duration || '45 MIN'} • {recentWorkout.calories || '680 KCAL'}
                  </span>
                </div>
                <h2 className="font-display-lg text-2xl md:text-3xl text-white font-bold uppercase drop-shadow-lg">
                  {recentWorkout.title || recentWorkout.name}
                </h2>
                <p className="font-body-md text-gray-200 max-w-xl leading-relaxed drop-shadow-md bg-black/40 p-3 rounded-xl border border-white/10 backdrop-blur-sm">
                  {recentWorkout.description || 'High-velocity interval protocol focusing on anaerobic threshold extension and rapid power recovery.'}
                </p>
              </div>

              <div className="relative z-10 flex flex-wrap gap-4 pt-4">
                <button
                  onClick={() => setActiveWorkout(recentWorkout)}
                  className="bg-primary-container text-on-primary-container font-bold px-6 py-3 rounded-lg hover:brightness-110 active:scale-95 transition-all cursor-pointer glow-lime shadow-2xl"
                >
                  START TRAINING
                </button>
              </div>
            </div>
          ) : (
            <div className="lg:col-span-8 bg-surface-container rounded-2xl p-8 border border-outline-variant flex flex-col items-center justify-center space-y-3 min-h-[250px]">
              <span className="material-symbols-outlined text-4xl text-on-surface-variant">fitness_center</span>
              <p className="font-body-lg text-on-surface-variant font-bold">No recent workout</p>
            </div>
          )}

          {/* Side Progress & Leaderboard Snapshot */}
          <div className="lg:col-span-4 space-y-6">
            {featuredChallenge && (
              <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-headline-md text-lg text-primary font-bold">ACTIVE CHALLENGE</h3>
                  <span className="font-label-caps text-[10px] text-secondary-container font-bold">LIVE</span>
                </div>
                <p className="font-body-md text-sm text-on-surface-variant">
                  {featuredChallenge.title || featuredChallenge.name} — Active Community Challenge
                </p>
                <button
                  onClick={() => setActiveChallenge(featuredChallenge)}
                  className={`w-full py-2.5 rounded text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    isFeaturedJoined
                      ? 'bg-emerald-500/20 border border-emerald-500 text-emerald-400 font-bold'
                      : 'bg-surface-container-high border border-outline-variant text-primary hover:border-primary-container'
                  }`}
                >
                  {isFeaturedJoined ? (
                    <>
                      <span className="material-symbols-outlined text-sm">check_circle</span>
                      JOINED
                    </>
                  ) : (
                    'JOIN CHALLENGE'
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {activeWorkout && (
        <WorkoutModal workout={activeWorkout} onClose={handleCloseWorkoutModal} />
      )}
      {activeChallenge && (
        <ChallengeModal challenge={activeChallenge} onClose={() => setActiveChallenge(null)} />
      )}
    </div>
  );
}

export default DashboardPage;
