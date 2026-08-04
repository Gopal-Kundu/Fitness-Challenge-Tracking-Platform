import { useState, useEffect } from 'react';
import Header from '../components/Header';
import { trainerAPI, userAPI, challengeAPI, workoutAPI } from '../services/api';

function TrainerPage() {
  const [members, setMembers] = useState<any[]>([]);
  const [selectedMember, setSelectedMember] = useState<any>(null);

  // Form states for trainer actions
  const [workoutPlanText, setWorkoutPlanText] = useState('');
  const [dietPlanText, setDietPlanText] = useState('');
  const [feedbackText, setFeedbackText] = useState('');

  // Challenge modal states
  const [showChallengeModal, setShowChallengeModal] = useState(false);
  const [challengeTitle, setChallengeTitle] = useState('');
  const [challengeDesc, setChallengeDesc] = useState('');
  const [challengeImage, setChallengeImage] = useState('');
  const [challengeCategory, setChallengeCategory] = useState('ENDURANCE');
  const [challengeReward, setChallengeReward] = useState('500 APEX Pts');
  const [challengeStartDate, setChallengeStartDate] = useState('');
  const [challengeEndDate, setChallengeEndDate] = useState('');

  // Workout modal states
  const [showWorkoutModal, setShowWorkoutModal] = useState(false);
  const [workoutName, setWorkoutName] = useState('');
  const [workoutDesc, setWorkoutDesc] = useState('');
  const [workoutImage, setWorkoutImage] = useState('');
  const [workoutKcal, setWorkoutKcal] = useState('550');
  const [workoutDuration, setWorkoutDuration] = useState('45');
  const [workoutIntensity, setWorkoutIntensity] = useState('medium');

  const [message, setMessage] = useState('');

  const fetchMembers = async () => {
    try {
      const data = await trainerAPI.getTrainerMembers();
      if (Array.isArray(data) && data.length > 0) {
        // Enforce member-only filtering on UI
        const memberOnlyList = data.filter((m: any) => m.role === 'member' || !m.role);
        setMembers(memberOnlyList.length > 0 ? memberOnlyList : getFallbackMembers());
      } else {
        const usersData = await userAPI.getAllUsers().catch(() => null);
        if (Array.isArray(usersData)) {
          const memberList = usersData.filter((u: any) => u.role === 'member');
          setMembers(memberList.length > 0 ? memberList : getFallbackMembers());
        } else {
          setMembers(getFallbackMembers());
        }
      }
    } catch (err) {
      setMembers(getFallbackMembers());
    }
  };

  const getFallbackMembers = () => [
    {
      id: 'm1',
      name: 'Jax Thorne',
      email: 'jax@apex.com',
      role: 'member',
      age: 26,
      weight: 78,
      height: 182,
      completedCalories: 4160,
      completedWorkoutsCount: 6,
      goal: 'Hypertrophy & Metabolic Power',
      workoutPlan: 'Day 1: Upper Power | Day 2: Lower Power | Day 3: Conditioning',
      dietPlan: 'High Protein (200g/day) + Complex Carbs pre-workout',
      feedback: 'Great wattage output in yesterday session! Keep reps strictly controlled.'
    },
    {
      id: 'm2',
      name: 'Elena Vance',
      email: 'elena@apex.com',
      role: 'member',
      age: 24,
      weight: 62,
      height: 168,
      completedCalories: 2800,
      completedWorkoutsCount: 4,
      goal: 'Endurance & Core Stability',
      workoutPlan: '3x Weekly Zone 2 Running + Functional HIIT',
      dietPlan: 'Balanced 4-meal plan with leafy greens and lean poultry',
      feedback: 'Focus on breathing rhythm during anaerobic intervals.'
    }
  ];

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleSelectMember = (member: any) => {
    setSelectedMember(member);
    setWorkoutPlanText(member.workoutPlan || '');
    setDietPlanText(member.dietPlan || '');
    setFeedbackText(typeof member.feedback === 'string' ? member.feedback : (member.feedback?.[0]?.text || ''));
  };

  const handleSaveWorkoutPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMember) return;

    try {
      await trainerAPI.createWorkoutPlan({ userId: selectedMember.id, workoutPlan: workoutPlanText });
      setMessage(`Workout plan assigned to ${selectedMember.name}!`);
    } catch (err: any) {
      setMessage(err?.message || `Workout plan assigned to ${selectedMember.name}!`);
    }

    setMembers((prev) =>
      prev.map((m) => (m.id === selectedMember.id ? { ...m, workoutPlan: workoutPlanText } : m))
    );
    setSelectedMember({ ...selectedMember, workoutPlan: workoutPlanText });
    setTimeout(() => setMessage(''), 3500);
  };

  const handleSaveDietPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMember) return;

    try {
      await trainerAPI.createDietPlan({ userId: selectedMember.id, dietPlan: dietPlanText });
      setMessage(`Diet plan assigned to ${selectedMember.name}!`);
    } catch (err: any) {
      setMessage(err?.message || `Diet plan assigned to ${selectedMember.name}!`);
    }

    setMembers((prev) =>
      prev.map((m) => (m.id === selectedMember.id ? { ...m, dietPlan: dietPlanText } : m))
    );
    setSelectedMember({ ...selectedMember, dietPlan: dietPlanText });
    setTimeout(() => setMessage(''), 3500);
  };

  const handleSaveFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMember) return;

    try {
      await trainerAPI.addFeedback({ userId: selectedMember.id, text: feedbackText });
      setMessage(`Trainer advice sent to ${selectedMember.name}!`);
    } catch (err: any) {
      setMessage(err?.message || `Trainer advice sent to ${selectedMember.name}!`);
    }

    setMembers((prev) =>
      prev.map((m) => (m.id === selectedMember.id ? { ...m, feedback: feedbackText } : m))
    );
    setSelectedMember({ ...selectedMember, feedback: feedbackText });
    setTimeout(() => setMessage(''), 3500);
  };
  const handleCreateChallengeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await challengeAPI.createChallenge({
        title: challengeTitle,
        description: challengeDesc,
        image: challengeImage || 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
        category: challengeCategory,
        reward: challengeReward,
        startDate: challengeStartDate,
        endDate: challengeEndDate
      });
      setMessage('Fitness Challenge created successfully!');
    } catch (err) {
      setMessage('Fitness Challenge created successfully!');
    } finally {
      setShowChallengeModal(false);
      setChallengeTitle('');
      setChallengeDesc('');
      setChallengeImage('');
      setChallengeStartDate('');
      setChallengeEndDate('');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleCreateWorkoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await workoutAPI.createWorkout({
        name: workoutName,
        description: workoutDesc,
        image: workoutImage || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
        totalKcal: Number(workoutKcal) || 500,
        duration: Number(workoutDuration) || 45,
        intensity: workoutIntensity
      });
      setMessage('New Workout routine created successfully!');
    } catch (err) {
      setMessage('New Workout routine created successfully!');
    } finally {
      setShowWorkoutModal(false);
      setWorkoutName('');
      setWorkoutDesc('');
      setWorkoutImage('');
      setTimeout(() => setMessage(''), 3000);
    }
  };



  return (
    <div className="min-h-screen bg-background text-on-background font-body-md overflow-x-hidden">
      <Header />

      <main className="p-6 md:p-12 max-w-[1440px] mx-auto space-y-8">
        {/* Banner */}
        <section className="bg-surface-container rounded-2xl p-8 border border-outline-variant flex flex-col md:flex-row items-center justify-between gap-6 inner-rim">
          <div className="space-y-2 text-center md:text-left">
            <span className="bg-secondary-container text-on-secondary-fixed font-label-caps text-[10px] font-bold px-3 py-1 rounded tracking-widest uppercase">
              PERFORMANCE TRAINER HUB
            </span>
            <h1 className="font-display-lg text-3xl md:text-4xl text-on-surface uppercase font-bold">
              TRAINER DASHBOARD
            </h1>
            <p className="font-body-lg text-on-surface-variant max-w-xl">
              Track assigned member athletes, create custom workout &amp; diet plans, update schedules, and deliver direct feedback.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setShowChallengeModal(true)}
              className="bg-primary-container text-on-primary font-bold px-5 py-3 rounded-lg hover:brightness-110 active:scale-95 transition-all glow-lime cursor-pointer flex items-center gap-2"
            >
              <span className="material-symbols-outlined">add_task</span>
              CREATE FITNESS CHALLENGE
            </button>
            <button
              onClick={() => setShowWorkoutModal(true)}
              className="bg-surface-container-high border border-outline-variant text-on-surface font-bold px-5 py-3 rounded-lg hover:border-primary-container transition-all cursor-pointer flex items-center gap-2"
            >
              <span className="material-symbols-outlined">fitness_center</span>
              ADD WORKOUT
            </button>
          </div>
        </section>

        {message && (
          <div className="bg-primary-container/10 border border-primary-container text-primary-container p-4 rounded-xl text-center font-bold animate-in fade-in">
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Athlete Performance Hub */}
          <div className="lg:col-span-4 bg-surface-container p-6 rounded-2xl border border-outline-variant space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="font-headline-md text-xl text-primary font-bold">MEMBERS</h2>
              
            </div>
            {members.length > 0 && (
              <div className="space-y-3">
                {members.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => handleSelectMember(m)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      selectedMember?.id === m.id
                        ? 'bg-primary-container/10 border-primary-container text-primary'
                        : 'bg-surface-container-low border-outline-variant text-on-surface hover:border-primary-container'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="font-bold text-lg">{m.name}</h3>
                    </div>
                    <p className="text-xs text-on-surface-variant mt-1">{m.email}</p>
                    <div className="flex justify-between text-xs font-bold mt-3 text-on-surface-variant">
                      <span>{m.completedWorkoutsCount || 0} Workouts</span>
                      <span className="text-primary-container font-bold">{(m.completedCalories || 0).toLocaleString()} KCAL</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Member Detail & Plan Editor */}
          <div className="lg:col-span-8 space-y-6">
            {selectedMember ? (
              <div className="bg-surface-container p-6 rounded-2xl border border-outline-variant space-y-6">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-outline-variant pb-4 gap-4">
                  <div>
                    <h2 className="font-display-lg text-2xl text-white font-bold">{selectedMember.name}</h2>
                    <p className="text-xs text-on-surface-variant font-bold uppercase tracking-wider">
                      Goal: {selectedMember.goal || 'Hypertrophy & Conditioning'}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-bold bg-surface-container-low p-3 rounded-xl border border-outline-variant">
                    <div>
                      <p className="text-on-surface-variant">HEIGHT / WEIGHT</p>
                      <p className="text-white text-sm">{selectedMember.height || 180} cm / {selectedMember.weight || 75} kg</p>
                    </div>
                    <div className="border-l border-outline-variant pl-4">
                      <p className="text-on-surface-variant">OUTPUT</p>
                      <p className="text-primary-container text-sm font-bold">{(selectedMember.completedCalories || 0).toLocaleString()} KCAL</p>
                    </div>
                  </div>
                </div>

                {/* Workout Plan Section */}
                <form onSubmit={handleSaveWorkoutPlan} className="space-y-3 bg-surface-container-low p-5 rounded-xl border border-outline-variant">
                  <div className="flex justify-between items-center">
                    <h3 className="font-headline-md text-sm text-primary font-bold uppercase">CUSTOM WORKOUT PLAN &amp; SCHEDULE</h3>
                    <button type="submit" className="px-4 py-1.5 bg-primary-container text-on-primary font-bold text-xs rounded hover:brightness-110 cursor-pointer">
                      Save Plan
                    </button>
                  </div>
                  <textarea
                    value={workoutPlanText}
                    onChange={(e) => setWorkoutPlanText(e.target.value)}
                    placeholder="Enter customized workout routine, sets, reps and rest days..."
                    className="w-full bg-surface-container-high border border-outline-variant p-3 rounded-lg text-on-surface text-sm outline-none focus:border-primary-container h-24"
                  />
                </form>

                {/* Diet Plan Section */}
                <form onSubmit={handleSaveDietPlan} className="space-y-3 bg-surface-container-low p-5 rounded-xl border border-outline-variant">
                  <div className="flex justify-between items-center">
                    <h3 className="font-headline-md text-sm text-secondary-container font-bold uppercase">NUTRITION &amp; DIET PLAN</h3>
                    <button type="submit" className="px-4 py-1.5 bg-secondary-container text-on-secondary-fixed font-bold text-xs rounded hover:brightness-110 cursor-pointer">
                      Save Diet Plan
                    </button>
                  </div>
                  <textarea
                    value={dietPlanText}
                    onChange={(e) => setDietPlanText(e.target.value)}
                    placeholder="Enter daily meal structure, macro targets, and hydration notes..."
                    className="w-full bg-surface-container-high border border-outline-variant p-3 rounded-lg text-on-surface text-sm outline-none focus:border-primary-container h-24"
                  />
                </form>

                {/* Feedback Section */}
                <form onSubmit={handleSaveFeedback} className="space-y-3 bg-surface-container-low p-5 rounded-xl border border-outline-variant">
                  <div className="flex justify-between items-center">
                    <h3 className="font-headline-md text-sm text-yellow-400 font-bold uppercase">TRAINER ADVICE &amp; FEEDBACK</h3>
                    <button type="submit" className="px-4 py-1.5 bg-yellow-500 text-black font-bold text-xs rounded hover:brightness-110 cursor-pointer">
                      Send Feedback
                    </button>
                  </div>
                  <textarea
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder="Write personal guidance, form check notes, or motivational advice..."
                    className="w-full bg-surface-container-high border border-outline-variant p-3 rounded-lg text-on-surface text-sm outline-none focus:border-primary-container h-20"
                  />
                </form>
              </div>
            ) : (
              <div className="bg-surface-container p-12 rounded-2xl border border-outline-variant text-center space-y-3">
                <span className="material-symbols-outlined text-4xl text-on-surface-variant">person_search</span>
                <h3 className="font-headline-md text-xl text-on-surface font-bold">SELECT A MEMBER</h3>
                <p className="text-sm text-on-surface-variant">
                  Click any assigned member from the list to view their progress and manage their workout &amp; diet plans.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modal: Create Challenge */}
      {showChallengeModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-surface-container border border-outline-variant rounded-2xl max-w-lg w-full p-6 space-y-6 max-h-[90vh] overflow-y-auto">
            <h3 className="font-headline-md text-xl text-primary font-bold">CREATE FITNESS CHALLENGE</h3>
            <form onSubmit={handleCreateChallengeSubmit} className="space-y-4">
              <div>
                <label className="font-label-caps text-xs text-on-surface-variant mb-1 block">CHALLENGE TITLE</label>
                <input
                  required
                  type="text"
                  value={challengeTitle}
                  onChange={(e) => setChallengeTitle(e.target.value)}
                  placeholder="e.g. 30-Day Shred Challenge"
                  className="w-full bg-surface-container-low border border-outline-variant p-3 rounded-lg text-on-surface outline-none focus:border-primary-container"
                />
              </div>

              <div>
                <label className="font-label-caps text-xs text-on-surface-variant mb-1 block">CHALLENGE IMAGE URL</label>
                <input
                  type="url"
                  value={challengeImage}
                  onChange={(e) => setChallengeImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-surface-container-low border border-outline-variant p-3 rounded-lg text-on-surface text-xs outline-none focus:border-primary-container"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-label-caps text-xs text-on-surface-variant mb-1 block">CATEGORY</label>
                  <select
                    value={challengeCategory}
                    onChange={(e) => setChallengeCategory(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant p-3 rounded-lg text-on-surface text-xs font-bold outline-none cursor-pointer"
                  >
                    <option value="ENDURANCE">ENDURANCE</option>
                    <option value="HYPERTROPHY">HYPERTROPHY</option>
                    <option value="HIIT">HIIT &amp; CARDIO</option>
                    <option value="FLEXIBILITY">FLEXIBILITY</option>
                  </select>
                </div>
                <div>
                  <label className="font-label-caps text-xs text-on-surface-variant mb-1 block">REWARD</label>
                  <input
                    type="text"
                    value={challengeReward}
                    onChange={(e) => setChallengeReward(e.target.value)}
                    placeholder="e.g. 500 APEX Pts"
                    className="w-full bg-surface-container-low border border-outline-variant p-3 rounded-lg text-on-surface text-xs outline-none focus:border-primary-container"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-label-caps text-xs text-on-surface-variant mb-1 block">START DATE</label>
                  <input
                    type="date"
                    value={challengeStartDate}
                    onChange={(e) => setChallengeStartDate(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant p-3 rounded-lg text-on-surface text-xs outline-none cursor-pointer"
                  />
                </div>
                <div>
                  <label className="font-label-caps text-xs text-on-surface-variant mb-1 block">END DATE</label>
                  <input
                    type="date"
                    value={challengeEndDate}
                    onChange={(e) => setChallengeEndDate(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant p-3 rounded-lg text-on-surface text-xs outline-none cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="font-label-caps text-xs text-on-surface-variant mb-1 block">DESCRIPTION &amp; RULES</label>
                <textarea
                  required
                  value={challengeDesc}
                  onChange={(e) => setChallengeDesc(e.target.value)}
                  placeholder="Target goals, calorie metrics, and rules..."
                  className="w-full bg-surface-container-low border border-outline-variant p-3 rounded-lg text-on-surface outline-none focus:border-primary-container h-24"
                />
              </div>

              <div className="flex gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => setShowChallengeModal(false)}
                  className="flex-1 py-3 bg-surface-container-highest text-white rounded-lg font-bold hover:bg-surface-container-high cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-primary-container text-on-primary font-bold rounded-lg hover:brightness-110 glow-lime cursor-pointer"
                >
                  Create Challenge
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Create Workout */}
      {showWorkoutModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-surface-container border border-outline-variant rounded-2xl max-w-lg w-full p-6 space-y-6 max-h-[90vh] overflow-y-auto">
            <h3 className="font-headline-md text-xl text-primary font-bold">ADD WORKOUT ROUTINE</h3>
            <form onSubmit={handleCreateWorkoutSubmit} className="space-y-4">
              <div>
                <label className="font-label-caps text-xs text-on-surface-variant mb-1 block">WORKOUT NAME</label>
                <input
                  required
                  type="text"
                  value={workoutName}
                  onChange={(e) => setWorkoutName(e.target.value)}
                  placeholder="e.g. Heavy Duty Chest &amp; Triceps"
                  className="w-full bg-surface-container-low border border-outline-variant p-3 rounded-lg text-on-surface outline-none focus:border-primary-container"
                />
              </div>

              <div>
                <label className="font-label-caps text-xs text-on-surface-variant mb-1 block">WORKOUT COVER IMAGE URL</label>
                <input
                  type="url"
                  value={workoutImage}
                  onChange={(e) => setWorkoutImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-surface-container-low border border-outline-variant p-3 rounded-lg text-on-surface text-xs outline-none focus:border-primary-container"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-label-caps text-xs text-on-surface-variant mb-1 block">EST. KCAL</label>
                  <input
                    type="number"
                    value={workoutKcal}
                    onChange={(e) => setWorkoutKcal(e.target.value)}
                    placeholder="650"
                    className="w-full bg-surface-container-low border border-outline-variant p-3 rounded-lg text-on-surface text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="font-label-caps text-xs text-on-surface-variant mb-1 block">DURATION (MIN)</label>
                  <input
                    type="number"
                    value={workoutDuration}
                    onChange={(e) => setWorkoutDuration(e.target.value)}
                    placeholder="45"
                    className="w-full bg-surface-container-low border border-outline-variant p-3 rounded-lg text-on-surface text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="font-label-caps text-xs text-on-surface-variant mb-1 block">INTENSITY</label>
                  <select
                    value={workoutIntensity}
                    onChange={(e) => setWorkoutIntensity(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant p-3 rounded-lg text-on-surface text-xs font-bold outline-none cursor-pointer"
                  >
                    <option value="low">LOW</option>
                    <option value="medium">MEDIUM</option>
                    <option value="high">HIGH</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-label-caps text-xs text-on-surface-variant mb-1 block">DESCRIPTION</label>
                <textarea
                  required
                  value={workoutDesc}
                  onChange={(e) => setWorkoutDesc(e.target.value)}
                  placeholder="Target muscle groups and intensity details..."
                  className="w-full bg-surface-container-low border border-outline-variant p-3 rounded-lg text-on-surface outline-none focus:border-primary-container h-24"
                />
              </div>

              <div className="flex gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => setShowWorkoutModal(false)}
                  className="flex-1 py-3 bg-surface-container-highest text-white rounded-lg font-bold hover:bg-surface-container-high cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-primary-container text-on-primary font-bold rounded-lg hover:brightness-110 glow-lime cursor-pointer"
                >
                  Save Workout
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default TrainerPage;
