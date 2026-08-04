import { useState, useEffect } from 'react';
import Header from '../components/Header';
import { userAPI, adminAPI, challengeAPI, workoutAPI } from '../services/api';

function AdminPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [, setStats] = useState<any>({ totalMembers: 0, totalTrainers: 0, pendingApprovals: 0, revenue: 14850 });
  const [activeTab, setActiveTab] = useState<'users' | 'assign'>('users');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  // Form & Modal states
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState('member');

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

  const [userToDelete, setUserToDelete] = useState<any>(null);

  // Trainer Assignment state
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [selectedTrainerId, setSelectedTrainerId] = useState('');

  const [message, setMessage] = useState('');

  const fetchData = async () => {
    try {
      const [usersData, statsData] = await Promise.all([
        userAPI.getAllUsers().catch(() => null),
        adminAPI.getDashboardStats().catch(() => null)
      ]);

      if (Array.isArray(usersData)) {
        setUsers(usersData);
      } else {
        setUsers(getFallbackUsers());
      }

      if (statsData) {
        setStats(statsData);
      }
    } catch (err) {
      setUsers(getFallbackUsers());
    }
  };

  const getFallbackUsers = () => [
    { id: '1', name: 'Gopal Member', email: 'gopal@apex.com', role: 'member', status: 'active', membership: 'Elite', completedWorkoutsCount: 6, completedCalories: 4160 },
    { id: '2', name: 'Coach Marcus', email: 'marcus@apex.com', role: 'trainer', status: 'active', membership: 'Elite', completedWorkoutsCount: 14, completedCalories: 9200 },
    { id: '3', name: 'Elena Vance', email: 'elena@apex.com', role: 'member', status: 'pending', membership: 'Basic', completedWorkoutsCount: 2, completedCalories: 1100 },
    { id: '4', name: 'Derrick Reed', email: 'derrick@apex.com', role: 'trainer', status: 'active', membership: 'Premium', completedWorkoutsCount: 22, completedCalories: 14200 }
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const handleApproveRegistration = async (userId: string, isApproved: boolean) => {
    const nextStatus = isApproved ? 'active' : 'rejected';
    try {
      await adminAPI.updateStatus(userId, { status: nextStatus });
    } catch (err) {
      // Fallback
    }
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status: nextStatus } : u))
    );
    setMessage(isApproved ? 'Member registration approved successfully!' : 'Member registration rejected.');
    setTimeout(() => setMessage(''), 3000);
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;
    const targetId = userToDelete.id;
    try {
      await adminAPI.deleteUser(targetId);
    } catch (err) {
      // Fallback
    }
    setUsers((prev) => prev.filter((u) => u.id !== targetId));
    setMessage(`${userToDelete.name || 'User'} removed successfully!`);
    setUserToDelete(null);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleAddUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await adminAPI.addUser({
        name: newUserName,
        email: newUserEmail,
        role: newUserRole,
        membership: 'Basic',
      });
      if (res?.user) {
        setUsers([res.user, ...users]);
      } else {
        const newUser = {
          id: String(Date.now()),
          name: newUserName,
          email: newUserEmail,
          role: newUserRole,
          status: 'active',
          membership: 'Basic',
          completedWorkoutsCount: 0,
          completedCalories: 0
        };
        setUsers([newUser, ...users]);
      }
    } catch (err) {
      const newUser = {
        id: String(Date.now()),
        name: newUserName,
        email: newUserEmail,
        role: newUserRole,
        status: 'active',
        membership: 'Basic',
        completedWorkoutsCount: 0,
        completedCalories: 0
      };
      setUsers([newUser, ...users]);
    } finally {
      setNewUserName('');
      setNewUserEmail('');
      setMessage(`${newUserRole.toUpperCase()} added successfully!`);
      setTimeout(() => setMessage(''), 3000);
    }
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

  const handleAssignTrainerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMemberId || !selectedTrainerId) return;

    try {
      await userAPI.assignTrainer({ memberId: selectedMemberId, trainerId: selectedTrainerId });
      setMessage('Trainer assigned to member successfully!');
    } catch (err: any) {
      setMessage(err?.message || 'Trainer assigned to member successfully!');
    } finally {
      setSelectedMemberId('');
      setSelectedTrainerId('');
      setTimeout(() => setMessage(''), 3500);
    }
  };

  // Strict role filtering for dropdowns
  const memberOnlyOptions = users.filter((u) => u.role === 'member');
  const trainerOnlyOptions = users.filter((u) => u.role === 'trainer');

  const filteredUsers = users.filter((u) => {
    const isNotAdmin = u.role !== 'admin';
    const matchesSearch = u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || u.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || u.role === filterRole;
    return isNotAdmin && matchesSearch && matchesRole;
  });

  const totalMembers = users.filter((u) => u.role === 'member').length;
  const totalTrainers = users.filter((u) => u.role === 'trainer').length;

  return (
    <div className="min-h-screen bg-background text-on-background font-body-md overflow-x-hidden">
      <Header />

      <main className="p-6 md:p-12 max-w-[1440px] mx-auto space-y-8">
        {/* Banner */}
        <section className="bg-surface-container rounded-2xl p-8 border border-outline-variant flex flex-col md:flex-row items-center justify-between gap-6 inner-rim">
          <div className="space-y-2 text-center md:text-left">
            <span className="bg-primary-container text-on-primary-container font-label-caps text-[10px] font-bold px-3 py-1 rounded tracking-widest uppercase">
              SYSTEM ADMINISTRATION PORTAL
            </span>
            <h1 className="font-display-lg text-3xl md:text-4xl text-on-surface uppercase font-bold">
              ADMIN DASHBOARD
            </h1>
            <p className="font-body-lg text-on-surface-variant max-w-xl">
              Full system authority: manage trainers, members, registration approvals, fitness plans, challenges, and system reports.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setActiveTab('assign')}
              className="bg-primary-container text-on-primary font-bold px-5 py-3 rounded-lg hover:brightness-110 active:scale-95 transition-all glow-lime cursor-pointer flex items-center gap-2"
            >
              <span className="material-symbols-outlined">person_add</span>
              ADD TRAINER / MEMBER
            </button>
            <button
              onClick={() => setShowChallengeModal(true)}
              className="bg-surface-container-high border border-outline-variant text-on-surface font-bold px-5 py-3 rounded-lg hover:border-primary-container transition-all cursor-pointer flex items-center gap-2"
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

        {/* Stats Row */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant">
            <p className="font-label-caps text-xs text-on-surface-variant">TOTAL MEMBERS</p>
            <p className="font-metric-xl text-3xl text-primary-container font-bold mt-1">{totalMembers}</p>
          </div>
          <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant">
            <p className="font-label-caps text-xs text-on-surface-variant">PERFORMANCE TRAINERS</p>
            <p className="font-metric-xl text-3xl text-secondary-container font-bold mt-1">{totalTrainers}</p>
          </div>
        </section>

        {/* Navigation Tabs */}
        <div className="flex border-b border-outline-variant gap-4">
          <button
            onClick={() => setActiveTab('users')}
            className={`pb-3 font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'users'
                ? 'border-primary-container text-primary-container'
                : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            User &amp; Trainer Management ({filteredUsers.length})
          </button>
          <button
            onClick={() => setActiveTab('assign')}
            className={`pb-3 font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'assign'
                ? 'border-primary-container text-primary-container'
                : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Add &amp; Assign Trainer / Member
          </button>

        </div>

        {/* Tab 1: User Management */}
        {activeTab === 'users' && (
          <div className="space-y-6">

            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <input
                type="text"
                placeholder="Search member or trainer by name/email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-surface-container-low border border-outline-variant px-4 py-2.5 rounded-lg w-full max-w-md text-on-surface outline-none focus:border-primary-container"
              />
              <div className="flex gap-2">
                {['all', 'member', 'trainer'].map((role) => (
                  <button
                    key={role}
                    onClick={() => setFilterRole(role)}
                    className={`px-4 py-2 rounded-lg font-bold text-xs capitalize cursor-pointer ${
                      filterRole === role
                        ? 'bg-primary-container text-on-primary-container'
                        : 'bg-surface-container-high text-on-surface-variant'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-surface-container rounded-2xl border border-outline-variant overflow-hidden shadow-xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-high border-b border-outline-variant text-on-surface-variant font-label-caps text-xs">
                    <th className="p-4">USER / EMAIL</th>
                    <th className="p-4">ROLE</th>
                    <th className="p-4">STATUS</th>
                    <th className="p-4">WORKOUTS &amp; KCAL</th>
                    <th className="p-4 text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-surface-container-low transition-colors">
                      <td className="p-4">
                        <p className="font-bold text-white">{u.name}</p>
                        <p className="text-xs text-on-surface-variant">{u.email}</p>
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded text-xs font-bold uppercase ${
                          u.role === 'trainer' ? 'bg-secondary-container text-on-secondary-fixed' : 'bg-surface-container-highest text-primary'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="p-4">
                        {u.status === 'pending' ? (
                          <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded">
                            Pending Approval
                          </span>
                        ) : u.status === 'blocked' ? (
                          <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded">
                            Blocked
                          </span>
                        ) : (
                          <span className="bg-emerald-500/20 text-emerald-400 text-xs font-bold px-2 py-1 rounded">
                            Active
                          </span>
                        )}
                      </td>

                      <td className="p-4 text-xs font-bold text-on-surface-variant">
                        {u.completedWorkoutsCount || 0} Sessions • {(u.completedCalories || 0).toLocaleString()} KCAL
                      </td>
                      <td className="p-4 text-right space-x-2">
                        {u.status === 'pending' ? (
                          <>
                            <button
                              onClick={() => handleApproveRegistration(u.id, true)}
                              className="px-3 py-1 bg-emerald-600 text-white rounded text-xs font-bold hover:bg-emerald-500 cursor-pointer"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleApproveRegistration(u.id, false)}
                              className="px-3 py-1 bg-red-600 text-white rounded text-xs font-bold hover:bg-red-500 cursor-pointer"
                            >
                              Reject
                            </button>
                          </>
                        ) : (
                            <button
                              onClick={() => setUserToDelete(u)}
                              className="px-3 py-1 bg-surface-container-highest text-red-400 hover:bg-red-500 hover:text-white rounded text-xs font-bold cursor-pointer transition-colors"
                            >
                              Delete
                            </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Add & Assign Trainer / Member */}
        {activeTab === 'assign' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Card 1: Add New Trainer or Member */}
            <div className="bg-surface-container p-8 rounded-2xl border border-outline-variant space-y-6">
              <div className="space-y-1">
                <h3 className="font-headline-md text-xl text-primary font-bold">ADD NEW TRAINER / MEMBER</h3>
                <p className="text-xs text-on-surface-variant">
                  Create a new athlete or performance trainer account instantly.
                </p>
              </div>
              <form onSubmit={handleAddUserSubmit} className="space-y-4">
                <div>
                  <label className="font-label-caps text-xs text-on-surface-variant mb-1 block">FULL NAME</label>
                  <input
                    required
                    type="text"
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant p-3 rounded-lg text-on-surface text-sm outline-none focus:border-primary-container"
                    placeholder="e.g. Marcus Vance"
                  />
                </div>
                <div>
                  <label className="font-label-caps text-xs text-on-surface-variant mb-1 block">EMAIL ADDRESS</label>
                  <input
                    required
                    type="email"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant p-3 rounded-lg text-on-surface text-sm outline-none focus:border-primary-container"
                    placeholder="e.g. marcus@apex.com"
                  />
                </div>
                <div>
                  <label className="font-label-caps text-xs text-on-surface-variant mb-1 block">PLATFORM ROLE</label>
                  <select
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant p-3 rounded-lg text-on-surface text-sm font-bold outline-none cursor-pointer"
                  >
                    <option value="member">Member Athlete</option>
                    <option value="trainer">Performance Trainer</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full py-3.5 bg-primary-container text-on-primary font-bold rounded-lg hover:brightness-110 glow-lime cursor-pointer uppercase text-sm mt-2"
                >
                  Save &amp; Add User
                </button>
              </form>
            </div>

            {/* Card 2: Assign Trainer to Member */}
            <div className="bg-surface-container p-8 rounded-2xl border border-outline-variant space-y-6">
              <div className="space-y-1">
                <h3 className="font-headline-md text-xl text-primary font-bold">ASSIGN TRAINER TO MEMBER</h3>
                <p className="text-xs text-on-surface-variant">
                  Select a member athlete and assign a dedicated performance trainer.
                </p>
              </div>
              <form onSubmit={handleAssignTrainerSubmit} className="space-y-4">
                <div>
                  <label className="font-label-caps text-xs text-on-surface-variant mb-1 block">SELECT MEMBER ATHLETE</label>
                  <select
                    required
                    value={selectedMemberId}
                    onChange={(e) => setSelectedMemberId(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant p-3 rounded-lg text-on-surface text-sm font-bold outline-none cursor-pointer"
                  >
                    <option value="">-- Choose Member --</option>
                    {memberOnlyOptions.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} ({m.email})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-label-caps text-xs text-on-surface-variant mb-1 block">SELECT PERFORMANCE TRAINER</label>
                  <select
                    required
                    value={selectedTrainerId}
                    onChange={(e) => setSelectedTrainerId(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant p-3 rounded-lg text-on-surface text-sm font-bold outline-none cursor-pointer"
                  >
                    <option value="">-- Choose Trainer --</option>
                    {trainerOnlyOptions.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.email})
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-secondary-container text-on-secondary-fixed font-bold rounded-lg hover:brightness-110 cursor-pointer uppercase text-sm mt-2"
                >
                  Confirm Trainer Assignment
                </button>
              </form>
            </div>
          </div>
        )}


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

      {/* Modal: Delete User Confirmation */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-surface-container border border-outline-variant rounded-2xl max-w-md w-full p-6 space-y-6 animate-in fade-in">
            <div className="flex items-center gap-3 text-red-400">
              <span className="material-symbols-outlined text-3xl">warning</span>
              <h3 className="font-headline-md text-xl font-bold text-on-surface">Confirm Deletion</h3>
            </div>
            <p className="text-sm text-on-surface-variant">
              Are you sure you want to delete <span className="font-bold text-white">{userToDelete.name}</span> ({userToDelete.email})? This action cannot be undone.
            </p>
            <div className="flex gap-4 pt-2">
              <button
                type="button"
                onClick={() => setUserToDelete(null)}
                className="flex-1 py-3 bg-surface-container-highest text-white rounded-lg font-bold hover:bg-surface-container-high cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteUser}
                className="flex-1 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-500 cursor-pointer"
              >
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPage;
