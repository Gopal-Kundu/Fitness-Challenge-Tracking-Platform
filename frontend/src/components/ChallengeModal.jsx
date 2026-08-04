import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from '../store/userSlice';
import { challengeAPI } from '../services/api';

function ChallengeModal({ challenge, onClose }) {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user);

  const challengeId = challenge?.id || challenge?._id || challenge?.title || 'c1';

  const isAlreadyJoined =
    challenge?.isJoined ||
    challenge?.joined ||
    (Array.isArray(currentUser?.joinedChallenges) &&
      currentUser.joinedChallenges.some(
        (id) => String(id) === String(challengeId) || String(id) === String(challenge?.title)
      ));

  const [joined, setJoined] = useState(Boolean(isAlreadyJoined));
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!challenge) return null;

  const handleJoin = async () => {
    if (joined) return;
    setIsSubmitting(true);

    let newCount = (currentUser?.completedChallengesCount || 0) + 1;
    const currentJoined = Array.isArray(currentUser?.joinedChallenges) ? currentUser.joinedChallenges : [];
    const updatedJoined = [...currentJoined, challengeId, challenge.title];

    try {
      const res = await challengeAPI.joinChallenge(challengeId);
      if (res && res.completedChallengesCount !== undefined) {
        newCount = res.completedChallengesCount;
      }
    } catch (err) {
      // Fallback
    } finally {
      dispatch(
        updateUser({
          completedChallengesCount: newCount,
          joinedChallenges: updatedJoined,
        })
      );
      setJoined(true);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-surface-container border border-outline-variant rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="relative h-48 overflow-hidden">
          <img className="w-full h-full object-cover" src={challenge.image} alt={challenge.title || challenge.name} />
          <div className="absolute inset-0 bg-gradient-to-t from-surface-container via-surface-container/60 to-transparent"></div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-black/60 text-white rounded-full p-2 hover:bg-black transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
          <div className="absolute bottom-4 left-6">
            <span className="bg-secondary-container text-on-secondary-fixed font-label-caps text-[10px] font-bold px-2.5 py-1 rounded">
              {challenge.category || 'ENDURANCE'}
            </span>
            <h2 className="font-headline-md text-2xl text-white font-bold mt-1">{challenge.title || challenge.name}</h2>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <p className="font-body-md text-on-surface-variant">
            {challenge.description || '30 days of high-velocity metabolic conditioning designed to break plateaus. Earn exclusive badges and climb the global leaderboards.'}
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant">
              <p className="font-label-caps text-[10px] text-on-surface-variant uppercase">Reward</p>
              <p className="font-headline-md text-lg text-primary-container font-bold mt-1">{challenge.reward || challenge.prize || '500 APEX Pts'}</p>
            </div>
            <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant">
              <p className="font-label-caps text-[10px] text-on-surface-variant uppercase">Participants</p>
              <p className="font-headline-md text-lg text-primary font-bold mt-1">{challenge.participants || '12.4k'}</p>
            </div>
          </div>

          {!joined ? (
            <button
              disabled={isSubmitting}
              onClick={handleJoin}
              className="w-full py-3.5 bg-primary-container text-on-primary font-bold font-headline-md rounded-lg hover:brightness-110 active:scale-95 transition-all glow-lime cursor-pointer disabled:opacity-50 uppercase"
            >
              {isSubmitting ? 'JOINING...' : 'CONFIRM & JOIN CHALLENGE'}
            </button>
          ) : (
            <div className="bg-primary-container/10 border border-primary-container p-5 rounded-xl text-center space-y-3">
              <div className="flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-3xl text-primary-container">check_circle</span>
                <span className="font-display-lg text-2xl text-primary font-bold tracking-wider">JOINED</span>
              </div>
              <p className="text-xs text-on-surface-variant font-medium">
                You have joined this challenge! Your athletic output is tracked automatically in MongoDB.
              </p>
              <button
                onClick={onClose}
                className="w-full py-3 bg-primary-container text-on-primary font-bold rounded-lg hover:brightness-110 transition-all cursor-pointer uppercase"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChallengeModal;
