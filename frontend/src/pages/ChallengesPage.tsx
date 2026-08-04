import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Header from '../components/Header';
import ChallengeModal from '../components/ChallengeModal';
import { setChallenges } from '../store/challengeSlice';
import { challengeAPI } from '../services/api';

const defaultFeatured = {
  id: 'c-featured',
  title: 'Vanguard Endurance III',
  subtitle: 'LIVE NOW',
  description: '30 days of high-velocity metabolic conditioning designed to break plateaus. Earn the Elite Vanguard Badge and share in a $5,000 prize pool.',
  image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDBEPzNkReYew2BEEGjZRmiwtlVcz-lg0HzkhNjdMdfKJIINkDkeyXipcPsDdHt3gkUDQPewTsGhPpHzL-XYhif2ugzSvk0E3Q61vbKCOq80HFxgQncgl-amWmyuLt4UP_Nr5Qk6bCyp6ZwqQMV8twsJbOUSNFN7qlvJUQ6Uk9B1UKhIHP6QX20SmSdwsRNHotHlJ0INsAAeqzfVw3mSlLRUtFD7whVHGiNjwQClbKxa1DbwHdfXTLWGsPtEchQjMnWlvG5sfW-DqOO'
};

function ChallengesPage() {
  const dispatch = useDispatch();
  const currentUser = useSelector((state: any) => state.user);
  const { challenges } = useSelector((state: any) => state.challenge);
  const [activeChallengeModal, setActiveChallengeModal] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    challengeAPI.getAllChallenges()
      .then((data: any) => {
        const fetched = data?.challenges || data;
        if (Array.isArray(fetched) && fetched.length > 0) {
          dispatch(setChallenges(fetched.map((c: any) => ({
            id: c._id || c.id,
            title: c.title,
            description: c.description,
            image: c.image || defaultFeatured.image,
            category: c.category || 'ENDURANCE',
            status: 'ACTIVE',
            participants: `${c.participants || 12}k`,
            reward: c.reward || '500 APEX Pts'
          }))));
        } else {
          dispatch(setChallenges([]));
        }
      })
      .catch(() => {
        dispatch(setChallenges([]));
      })
      .finally(() => {
        setLoading(false);
      });
  }, [dispatch]);

  const isChallengeJoined = (c: any) => {
    const cid = String(c?.id || c?._id || '');
    const title = c?.title || '';
    const joinedList = Array.isArray(currentUser?.joinedChallenges) ? currentUser.joinedChallenges : [];
    return joinedList.some((item: any) => String(item) === cid || String(item) === title);
  };

  const currentList = Array.isArray(challenges) ? challenges : [];

  const featuredChallenge = currentList[0] ? {
    id: currentList[0].id || currentList[0]._id || 'c-featured',
    title: currentList[0].title,
    subtitle: 'LIVE NOW',
    description: currentList[0].description || defaultFeatured.description,
    image: currentList[0].image || defaultFeatured.image
  } : defaultFeatured;

  const isFeaturedJoined = isChallengeJoined(featuredChallenge);
  const filteredChallenges = currentList;

  return (
    <div className="min-h-screen bg-background text-on-background font-body-md overflow-x-hidden">
      <Header />

      <div className="p-6 md:p-12 max-w-[1440px] mx-auto space-y-12">
        {/* Featured Challenge Hero */}
        <section className="relative h-[480px] rounded-xl overflow-hidden inner-glow group">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent z-10"></div>
            <img
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              src={featuredChallenge.image}
              alt={featuredChallenge.title}
            />
          </div>
          <div className="relative z-20 h-full p-8 md:p-12 flex flex-col justify-end max-w-2xl space-y-4">
            <span className="bg-primary-container text-on-primary-container font-label-caps text-label-caps px-3 py-1 rounded w-fit font-bold">
              {featuredChallenge.subtitle}
            </span>
            <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-primary uppercase leading-none">
              {featuredChallenge.title}
            </h1>
            <p className="font-body-lg text-on-surface-variant line-clamp-3">
              {featuredChallenge.description}
            </p>
            <button
              onClick={() => setActiveChallengeModal(featuredChallenge)}
              className={`py-3 px-8 rounded-lg font-bold transition-all cursor-pointer flex items-center justify-center gap-2 w-fit ${
                isFeaturedJoined
                  ? 'bg-emerald-500/20 border border-emerald-500 text-emerald-400'
                  : 'bg-primary-container text-on-primary-container hover:brightness-110 active:scale-95 glow-lime'
              }`}
            >
              {isFeaturedJoined ? (
                <>
                  <span className="material-symbols-outlined">check_circle</span>
                  Joined
                </>
              ) : (
                'Join Challenge'
              )}
            </button>
          </div>
        </section>

        {/* Challenges Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-gutter">
          {loading ? (
            <div className="col-span-full flex items-center justify-center p-12 text-primary-container font-bold">
              <div className="w-8 h-8 border-2 border-primary-container border-t-transparent rounded-full animate-spin mr-3"></div>
              Loading challenges...
            </div>
          ) : filteredChallenges.length > 0 ? (
            filteredChallenges.map((item) => {
              const joined = isChallengeJoined(item);
              return (
                <div
                  key={item.id}
                  className="bg-surface-container-low border border-outline-variant p-6 rounded-xl space-y-6 electric-glow transition-all duration-300 flex flex-col group"
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <span className="font-label-caps text-[10px] text-secondary-container bg-secondary-container/10 px-2 py-1 rounded">
                        {item.category || 'CHALLENGE'}
                      </span>
                      <h3 className="font-headline-md text-headline-md text-primary">{item.title}</h3>
                    </div>
                    <div className="bg-surface-container-high p-2 rounded">
                      <span className="material-symbols-outlined text-primary-container">
                        {item.status === 'ACTIVE' ? 'timer' : item.status === 'UPCOMING' ? 'lock_clock' : 'group'}
                      </span>
                    </div>
                  </div>
                  <div className="relative h-40 rounded-lg overflow-hidden">
                    <img
                      className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-500"
                      src={item.image}
                      alt={item.title}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-surface-container-low to-transparent"></div>
                  </div>
                  <div className="space-y-4 flex-1">
                    {item.progress !== undefined && (
                      <div>
                        <div className="flex justify-between font-label-caps text-label-caps text-on-surface-variant mb-2">
                          <span>PROGRESS</span>
                          <span className="text-primary-container font-bold">{item.progress}%</span>
                        </div>
                        <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-primary-container to-secondary-container" style={{ width: `${item.progress}%` }}></div>
                        </div>
                      </div>
                    )}
                    {item.description && (
                      <p className="font-body-md text-on-surface-variant line-clamp-2">{item.description}</p>
                    )}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-surface-container p-3 rounded">
                        <p className="font-label-caps text-[10px] text-on-surface-variant">REWARD / PRIZE</p>
                        <p className="text-primary font-bold">{item.reward || item.prize || '500 APEX Pts'}</p>
                      </div>
                      <div className="bg-surface-container p-3 rounded">
                        <p className="font-label-caps text-[10px] text-on-surface-variant">PARTICIPANTS</p>
                        <p className="text-primary font-bold">{item.participants || '10k+'}</p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveChallengeModal(item)}
                    className={`w-full py-3 font-bold rounded transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      joined
                        ? 'bg-emerald-500/20 border border-emerald-500 text-emerald-400 font-bold'
                        : 'bg-primary-container text-on-primary-container hover:brightness-110 active:scale-95'
                    }`}
                  >
                    {joined ? (
                      <>
                        <span className="material-symbols-outlined text-sm">check_circle</span>
                        Joined
                      </>
                    ) : item.progress !== undefined ? (
                      'View Progress'
                    ) : (
                      'Join Challenge'
                    )}
                  </button>
                </div>
              );
            })
          ) : (
            <div className="col-span-full p-12 text-center bg-surface-container rounded-2xl border border-outline-variant text-on-surface-variant font-body-lg font-bold">
              No recent workout
            </div>
          )}
        </section>
      </div>

      {activeChallengeModal && (
        <ChallengeModal challenge={activeChallengeModal} onClose={() => setActiveChallengeModal(null)} />
      )}
    </div>
  );
}

export default ChallengesPage;
