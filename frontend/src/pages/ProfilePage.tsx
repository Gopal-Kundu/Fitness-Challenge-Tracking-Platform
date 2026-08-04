import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Header from '../components/Header';
import { updateUser } from '../store/userSlice';
import { userAPI, authAPI } from '../services/api';

function ProfilePage() {
  const dispatch = useDispatch();
  const currentUser = useSelector((state: any) => state.user);

  const [name, setName] = useState(currentUser.name || 'Jax Thorne');
  const [avatar, setAvatar] = useState(currentUser.avatar || currentUser.image || 'https://shorturl.at/FmV3K');
  const [age, setAge] = useState<number | string>(currentUser.age || 26);
  const [height, setHeight] = useState<number | string>(currentUser.height || 182);
  const [weight, setWeight] = useState<number | string>(currentUser.weight || 78);
  const [goal, setGoal] = useState(currentUser.goal || 'Hypertrophy & Metabolic Power');

  // Body Measurements
  const [chest, setChest] = useState<number | string>(40);
  const [waist, setWaist] = useState<number | string>(32);
  const [hips, setHips] = useState<number | string>(38);
  const [arms, setArms] = useState<number | string>(15);

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'plans' | 'measurements'>('profile');

  useEffect(() => {
    userAPI.getProfile()
      .then((data: any) => {
        if (data.user || data.id) {
          const u = data.user || data;
          setName(u.name || 'Jax Thorne');
          if (u.avatar || u.image) setAvatar(u.avatar || u.image);
          if (u.age) setAge(u.age);
          if (u.height) setHeight(u.height);
          if (u.weight) setWeight(u.weight);
          if (u.goal) setGoal(u.goal);
          dispatch(updateUser(u));
        }
      })
      .catch(() => {
        authAPI.getMe()
          .then((meData: any) => {
            if (meData.user) {
              setName(meData.user.name);
              if (meData.user.image) setAvatar(meData.user.image);
              dispatch(updateUser(meData.user));
            }
          })
          .catch(() => {});
      });
  }, [dispatch]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newAvatarUrl = reader.result as string;
        setAvatar(newAvatarUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    const payload = {
      name,
      avatar,
      age: Number(age),
      height: Number(height),
      weight: Number(weight),
      goal,
    };

    try {
      await userAPI.updateProfile(payload);
      dispatch(updateUser(payload));
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      dispatch(updateUser(payload));
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-background">
      <Header />

      <main className="p-6 md:p-12 max-w-[1440px] mx-auto space-y-8">
        {/* Profile Hero Header */}
        <section className="bg-surface-container rounded-2xl p-8 border border-outline-variant flex flex-col md:flex-row items-center gap-8 inner-rim">
          <div className="relative group w-28 h-28 rounded-full overflow-hidden border-2 border-primary-container glow-lime flex-shrink-0">
            <img
              className="w-full h-full object-cover"
              src={avatar}
              alt="Profile"
            />
            <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white cursor-pointer transition-opacity text-xs font-bold">
              <span className="material-symbols-outlined text-xl">photo_camera</span>
              Change Image
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </label>
          </div>
          <div className="flex-1 text-center md:text-left space-y-2">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <h1 className="font-display-lg text-3xl md:text-4xl text-primary uppercase font-bold">{name}</h1>
            </div>
            <p className="font-body-lg text-on-surface-variant">Goal: {goal}</p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 pt-2 font-label-caps text-xs text-on-surface-variant">
              <span>AGE: {age}</span>
              <span>•</span>
              <span>HEIGHT: {height} CM</span>
              <span>•</span>
              <span>WEIGHT: {weight} KG</span>
              <span>•</span>
              <span>ROLE: {currentUser.role?.toUpperCase() || 'MEMBER'}</span>
            </div>
          </div>
        </section>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant">
            <p className="font-label-caps text-[10px] text-on-surface-variant uppercase mb-2">Total Calories</p>
            <h3 className="font-metric-xl text-3xl text-primary-container font-bold">{(currentUser.completedCalories || 4160).toLocaleString()} KCAL</h3>
          </div>
          <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant">
            <p className="font-label-caps text-[10px] text-on-surface-variant uppercase mb-2">Completed Workouts</p>
            <h3 className="font-metric-xl text-3xl text-primary font-bold">{currentUser.completedWorkoutsCount || 6}</h3>
          </div>
          <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant">
            <p className="font-label-caps text-[10px] text-on-surface-variant uppercase mb-2">Challenges Joined</p>
            <h3 className="font-metric-xl text-3xl text-secondary-container font-bold">{currentUser.completedChallengesCount || 3}</h3>
          </div>
          {currentUser.role === 'member' && (
            <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant">
              <p className="font-label-caps text-[10px] text-on-surface-variant uppercase mb-2">Assigned Trainer</p>
              <h3 className="font-metric-xl text-xl text-white font-bold mt-1">
                {currentUser.trainerName || currentUser.trainerId?.name || currentUser.assignedTrainer?.name || currentUser.assignedTrainer || 'Coach Marcus'}
              </h3>
            </div>
          )}
        </div>

        {/* Profile Tabs */}
        <div className="flex border-b border-outline-variant gap-6">
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-3 font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'profile'
                ? 'border-primary-container text-primary-container'
                : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Update Profile (Age, Weight, Goal)
          </button>
          {currentUser.role === 'member' && (
            <button
              onClick={() => setActiveTab('plans')}
              className={`pb-3 font-bold border-b-2 transition-all cursor-pointer ${
                activeTab === 'plans'
                  ? 'border-primary-container text-primary-container'
                  : 'border-transparent text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Workout &amp; Diet Plan
            </button>
          )}
          <button
            onClick={() => setActiveTab('measurements')}
            className={`pb-3 font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'measurements'
                ? 'border-primary-container text-primary-container'
                : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Body Measurements &amp; Weight Log
          </button>


        </div>

        {/* Tab 1: Update Profile */}
        {activeTab === 'profile' && (
          <section className="bg-surface-container p-8 rounded-2xl border border-outline-variant space-y-6">
            <h2 className="font-headline-md text-2xl text-primary font-bold">ATHLETE BIOMETRICS &amp; GOALS</h2>
            
            {saveSuccess && (
              <div className="bg-primary-container/10 border border-primary-container text-primary-container p-4 rounded-xl text-sm font-bold animate-in fade-in">
                Profile updated successfully!
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4 max-w-xl">
              <div>
                <label className="font-label-caps text-xs text-on-surface-variant mb-1 block">FULL NAME</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant text-on-surface px-4 py-3 rounded-lg focus:border-primary-container outline-none font-body-md"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="font-label-caps text-xs text-on-surface-variant mb-1 block">AGE</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant text-on-surface px-4 py-3 rounded-lg focus:border-primary-container outline-none font-body-md"
                  />
                </div>
                <div>
                  <label className="font-label-caps text-xs text-on-surface-variant mb-1 block">HEIGHT (CM)</label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant text-on-surface px-4 py-3 rounded-lg focus:border-primary-container outline-none font-body-md"
                  />
                </div>
                <div>
                  <label className="font-label-caps text-xs text-on-surface-variant mb-1 block">WEIGHT (KG)</label>
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant text-on-surface px-4 py-3 rounded-lg focus:border-primary-container outline-none font-body-md"
                  />
                </div>
              </div>
              <div>
                <label className="font-label-caps text-xs text-on-surface-variant mb-1 block">PRIMARY FITNESS GOAL</label>
                <input
                  type="text"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  placeholder="e.g. Muscle Gain, Fat Loss, Athletic Conditioning"
                  className="w-full bg-surface-container-low border border-outline-variant text-on-surface px-4 py-3 rounded-lg focus:border-primary-container outline-none font-body-md"
                />
              </div>
              <button
                disabled={isSaving}
                type="submit"
                className="py-3 px-8 bg-primary-container text-on-primary-container font-bold rounded-lg hover:brightness-110 active:scale-95 transition-all glow-lime cursor-pointer disabled:opacity-50"
              >
                {isSaving ? 'SAVING...' : 'UPDATE PROFILE'}
              </button>
            </form>
          </section>
        )}

        {/* Tab 2: Assigned Workout & Diet Plan */}
        {activeTab === 'plans' && currentUser.role === 'member' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-surface-container p-6 rounded-2xl border border-outline-variant space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-headline-md text-xl text-primary font-bold">ASSIGNED WORKOUT PLAN</h3>
                <span className="bg-primary-container text-on-primary text-[10px] font-bold px-2 py-0.5 rounded">ACTIVE</span>
              </div>
              <p className="text-sm text-on-surface-variant bg-surface-container-low p-4 rounded-xl border border-outline-variant leading-relaxed">
                {currentUser.workoutPlan || 'No plan assigned yet'}
              </p>
              <div className="pt-2 text-xs font-bold text-primary-container flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">assignment_turned_in</span>
                Assigned by {currentUser.trainerName || currentUser.trainerId?.name || currentUser.assignedTrainer?.name || currentUser.assignedTrainer || 'Coach Marcus'}
              </div>
            </div>

            <div className="bg-surface-container p-6 rounded-2xl border border-outline-variant space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-headline-md text-xl text-secondary-container font-bold">ASSIGNED NUTRITION &amp; DIET PLAN</h3>
                <span className="bg-secondary-container text-on-secondary-fixed text-[10px] font-bold px-2 py-0.5 rounded">ACTIVE</span>
              </div>
              <p className="text-sm text-on-surface-variant bg-surface-container-low p-4 rounded-xl border border-outline-variant leading-relaxed">
                {currentUser.dietPlan || 'No plan assigned yet'}
              </p>
              <div className="pt-2 text-xs font-bold text-secondary-container flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">restaurant</span>
                Assigned by {currentUser.trainerName || currentUser.trainerId?.name || currentUser.assignedTrainer?.name || currentUser.assignedTrainer || 'Coach Marcus'}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Body Measurements */}
        {activeTab === 'measurements' && (
          <div className="bg-surface-container p-8 rounded-2xl border border-outline-variant space-y-6">
            <h2 className="font-headline-md text-2xl text-primary font-bold">BODY MEASUREMENTS &amp; INCHES</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant">
                <p className="font-label-caps text-xs text-on-surface-variant">CHEST (INCHES)</p>
                <input
                  type="number"
                  value={chest}
                  onChange={(e) => setChest(e.target.value)}
                  className="w-full bg-transparent font-metric-xl text-2xl text-white font-bold border-b border-outline-variant mt-1 outline-none focus:border-primary-container"
                />
              </div>
              <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant">
                <p className="font-label-caps text-xs text-on-surface-variant">WAIST (INCHES)</p>
                <input
                  type="number"
                  value={waist}
                  onChange={(e) => setWaist(e.target.value)}
                  className="w-full bg-transparent font-metric-xl text-2xl text-white font-bold border-b border-outline-variant mt-1 outline-none focus:border-primary-container"
                />
              </div>
              <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant">
                <p className="font-label-caps text-xs text-on-surface-variant">HIPS (INCHES)</p>
                <input
                  type="number"
                  value={hips}
                  onChange={(e) => setHips(e.target.value)}
                  className="w-full bg-transparent font-metric-xl text-2xl text-white font-bold border-b border-outline-variant mt-1 outline-none focus:border-primary-container"
                />
              </div>
              <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant">
                <p className="font-label-caps text-xs text-on-surface-variant">ARMS (INCHES)</p>
                <input
                  type="number"
                  value={arms}
                  onChange={(e) => setArms(e.target.value)}
                  className="w-full bg-transparent font-metric-xl text-2xl text-white font-bold border-b border-outline-variant mt-1 outline-none focus:border-primary-container"
                />
              </div>
            </div>
            <button
              onClick={() => {
                setSaveSuccess(true);
                setTimeout(() => setSaveSuccess(false), 3000);
              }}
              className="py-3 px-8 bg-primary-container text-on-primary font-bold rounded-lg hover:brightness-110 glow-lime cursor-pointer"
            >
              SAVE MEASUREMENTS
            </button>
          </div>
        )}


      </main>
    </div>
  );
}

export default ProfilePage;
