import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from '../store/userSlice';
import { workoutAPI } from '../services/api';

function WorkoutModal({ workout, onClose }) {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user);

  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [completedSets, setCompletedSets] = useState([false, false, false, false]);
  const [isFinished, setIsFinished] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isActive && !isFinished) {
      interval = setInterval(() => {
        setSeconds((sec) => sec + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, isFinished]);

  const toggleSet = (index) => {
    const updated = [...completedSets];
    updated[index] = !updated[index];
    setCompletedSets(updated);
  };

  const allSetsCompleted = completedSets.every((set) => set === true);

  const processWorkoutCompletion = async () => {
    if (!allSetsCompleted) return;
    setIsSubmitting(true);

    const workoutId = workout?.id || workout?._id || 'w1';
    const workoutKcal = parseInt(workout?.calories || workout?.totalKcal || '680', 10) || 680;

    let newCalories = (currentUser?.completedCalories || 0) + workoutKcal;
    let newWorkoutsCount = (currentUser?.completedWorkoutsCount || 0) + 1;

    let recentWorkoutObj = workout ? {
      id: workout.id || workout._id,
      title: workout.title || workout.name,
      description: workout.description || '',
      image: workout.image || '',
      duration: workout.duration || '45 MIN',
      calories: workout.calories || '680 KCAL',
    } : null;

    try {
      const res = await workoutAPI.completeWorkout(workoutId);
      if (res && res.completedCalories !== undefined) {
        newCalories = res.completedCalories;
      }
      if (res && res.completedWorkoutsCount !== undefined) {
        newWorkoutsCount = res.completedWorkoutsCount;
      }
      if (res && res.recentWorkout) {
        recentWorkoutObj = res.recentWorkout;
      }
    } catch (err) {
      // Fallback
    } finally {
      const payload = {
        completedCalories: newCalories,
        completedWorkoutsCount: newWorkoutsCount,
        recentWorkout: recentWorkoutObj,
        lastCompletedWorkout: workout?.title || workout?.name,
      };

      dispatch(updateUser(payload));
      setIsSubmitting(false);
      onClose();
    }
  };

  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!workout) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-surface-container border border-outline-variant rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="relative h-44 overflow-hidden">
          <img className="w-full h-full object-cover" src={workout.image} alt={workout.title || workout.name} />
          <div className="absolute inset-0 bg-gradient-to-t from-surface-container via-surface-container/60 to-transparent"></div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-black/60 text-white rounded-full p-2 hover:bg-black transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
          <div className="absolute bottom-4 left-6">
            <span className="bg-primary-container text-on-primary-container font-label-caps text-[10px] font-bold px-2.5 py-1 rounded">
              {workout.level || workout.intensity || 'ELITE'}
            </span>
            <h2 className="font-headline-md text-2xl text-white font-bold mt-1">{workout.title || workout.name}</h2>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {!isFinished ? (
            <>
              <div className="flex items-center justify-between bg-surface-container-low p-4 rounded-xl border border-outline-variant">
                <div>
                  <p className="font-label-caps text-xs text-on-surface-variant uppercase">Elapsed Time</p>
                  <p className="font-metric-xl text-3xl text-primary-container">{formatTime(seconds)}</p>
                </div>
                <div className="text-right">
                  <p className="font-label-caps text-xs text-on-surface-variant uppercase">Target Output</p>
                  <p className="font-headline-md text-xl text-primary">{workout.calories || workout.totalKcal || '680 KCAL'}</p>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-label-caps text-xs text-on-surface-variant uppercase">Set Log &amp; Wattage Tracker</h4>
                  <span className={`text-xs font-bold ${allSetsCompleted ? 'text-primary-container' : 'text-on-surface-variant'}`}>
                    {completedSets.filter(Boolean).length} / 4 SETS DONE
                  </span>
                </div>
                <div className="space-y-2">
                  {['Set 1: Warmup - 12 Reps @ 60%', 'Set 2: Power Cluster - 8 Reps @ 80%', 'Set 3: Peak Output - 6 Reps @ 90%', 'Set 4: Burnout - 15 Reps @ 70%'].map((setLabel, idx) => (
                    <button
                      key={idx}
                      onClick={() => toggleSet(idx)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer ${
                        completedSets[idx]
                          ? 'bg-primary-container/10 border-primary-container text-primary'
                          : 'bg-surface-container-high border-outline-variant text-on-surface-variant hover:border-primary-container'
                      }`}
                    >
                      <span className="font-body-md text-sm font-semibold">{setLabel}</span>
                      <span className="material-symbols-outlined text-lg">
                        {completedSets[idx] ? 'check_box' : 'check_box_outline_blank'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 pt-2">
                <button
                  onClick={() => setIsActive(!isActive)}
                  className="flex-1 py-3 bg-surface-container-highest border border-outline-variant text-on-surface font-bold rounded-lg hover:bg-surface-container-high transition-colors cursor-pointer"
                >
                  {isActive ? 'Pause' : 'Resume'}
                </button>
                <button
                  disabled={!allSetsCompleted || isSubmitting}
                  onClick={processWorkoutCompletion}
                  className={`flex-1 py-3 font-bold rounded-lg transition-all ${
                    allSetsCompleted
                      ? 'bg-primary-container text-on-primary hover:brightness-110 active:scale-95 glow-lime cursor-pointer'
                      : 'bg-surface-container-highest text-on-surface-variant/50 border border-outline-variant cursor-not-allowed opacity-60'
                  }`}
                >
                  {isSubmitting
                    ? 'LOGGING WORKOUT...'
                    : allSetsCompleted
                    ? 'Complete Workout'
                    : 'Check All Sets to Complete'}
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-primary-container/20 border-2 border-primary-container text-primary-container rounded-full flex items-center justify-center mx-auto">
                <span className="material-symbols-outlined text-3xl">trophy</span>
              </div>
              <h3 className="font-headline-lg text-2xl text-primary font-bold">WORKOUT COMPLETE!</h3>
              <p className="font-body-md text-on-surface-variant">
                You logged {formatTime(seconds)} of peak athletic output!
              </p>
              <button
                disabled={isSubmitting}
                onClick={processWorkoutCompletion}
                className="w-full py-3 bg-primary-container text-on-primary font-bold rounded-lg hover:brightness-110 active:scale-95 transition-all cursor-pointer mt-4"
              >
                {isSubmitting ? 'SAVING PROGRESS...' : 'Close Summary'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default WorkoutModal;
