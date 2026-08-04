import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from '../store/userSlice';
import { workoutAPI } from '../services/api';

function SessionModal({ onClose }) {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user);

  const [seconds, setSeconds] = useState(0);
  const [bpm, setBpm] = useState(138);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);

    const bpmTimer = setInterval(() => {
      setBpm(130 + Math.floor(Math.random() * 20));
    }, 3000);

    return () => {
      clearInterval(timer);
      clearInterval(bpmTimer);
    };
  }, []);

  const formatTime = (totalSec) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndSession = async () => {
    setIsSubmitting(true);
    let newCalories = (currentUser?.completedCalories || 0) + 680;
    let newWorkoutsCount = (currentUser?.completedWorkoutsCount || 0) + 1;

    try {
      console.log('[SESSION MODAL API] Executing completeWorkout(w1)...');
      const res = await workoutAPI.completeWorkout('w1');
      console.log('[SESSION MODAL API] Response:', res);

      if (res && res.completedCalories !== undefined) {
        newCalories = res.completedCalories;
      }
      if (res && res.completedWorkoutsCount !== undefined) {
        newWorkoutsCount = res.completedWorkoutsCount;
      }
    } catch (err) {
      console.warn('[SESSION MODAL API ERROR] Using fallback increment:', err);
    } finally {
      dispatch(updateUser({
        completedCalories: newCalories,
        completedWorkoutsCount: newWorkoutsCount,
      }));
      setIsSubmitting(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-surface-container border border-outline-variant rounded-2xl max-w-md w-full p-6 space-y-6 shadow-2xl">
        <div className="flex justify-between items-center border-b border-outline-variant pb-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-primary-container animate-ping"></span>
            <h3 className="font-headline-md text-xl text-primary font-bold">LIVE TELEMETRY ACTIVE</h3>
          </div>
          <button onClick={onClose} className="text-on-surface-variant hover:text-primary cursor-pointer">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant">
            <p className="font-label-caps text-[10px] text-on-surface-variant uppercase">Session Time</p>
            <p className="font-metric-xl text-3xl text-primary-container mt-1">{formatTime(seconds)}</p>
          </div>
          <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant">
            <p className="font-label-caps text-[10px] text-on-surface-variant uppercase">Heart Rate</p>
            <p className="font-metric-xl text-3xl text-red-500 mt-1 flex items-center justify-center gap-1">
              {bpm} <span className="text-xs font-normal text-on-surface-variant">BPM</span>
            </p>
          </div>
        </div>

        <div className="bg-surface-container-high p-4 rounded-xl border border-outline-variant space-y-2">
          <div className="flex justify-between text-xs font-label-caps text-on-surface-variant">
            <span>METABOLIC RATE</span>
            <span className="text-primary-container font-bold">ZONE 4 (88% MAX)</span>
          </div>
          <div className="h-2 w-full bg-surface-container-lowest rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-secondary-container via-primary-container to-red-500 w-[88%] animate-pulse"></div>
          </div>
        </div>

        <button
          disabled={isSubmitting}
          onClick={handleEndSession}
          className="w-full py-3.5 bg-red-600 hover:bg-red-500 text-white font-bold font-headline-md rounded-lg transition-colors cursor-pointer disabled:opacity-50"
        >
          {isSubmitting ? 'SAVING PROGRESS...' : 'END SESSION & SAVE LOGS'}
        </button>
      </div>
    </div>
  );
}

export default SessionModal;
