import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';

function Sidebar() {
  const currentUser = useSelector((state: any) => state.user);
  const role = currentUser?.role || 'member';

  return (
    <nav className="hidden md:flex flex-col h-screen w-64 fixed left-0 top-0 bg-surface-container-low border-r border-outline-variant py-6 z-50">
      <div className="px-6 mb-8">
        <h1 className="font-headline-md text-headline-md font-bold text-primary">APEX PERFORMANCE</h1>
        <div className="flex items-center gap-2 mt-1">
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
            role === 'admin'
              ? 'bg-primary-container text-on-primary-container'
              : role === 'trainer'
              ? 'bg-secondary-container text-on-secondary-fixed'
              : 'bg-surface-container-highest text-primary'
          }`}>
            {role.toUpperCase()} PORTAL
          </span>
        </div>
      </div>
      
      <div className="flex-1 px-4 space-y-2 overflow-y-auto scrollbar-hide">
        {/* Common Dashboard Link */}
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex items-center gap-4 p-3 rounded-lg transition-colors duration-200 ${
              isActive
                ? "text-primary-container font-bold border-r-4 border-primary-container bg-surface-container-high"
                : "text-on-surface-variant hover:bg-surface-container-high active:scale-95 transition-transform"
            }`
          }
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>dashboard</span>
          <span className="font-body-md text-body-md">
            {role === 'admin' ? 'Admin Center' : role === 'trainer' ? 'Trainer Hub' : 'Dashboard'}
          </span>
        </NavLink>





        {/* Standard Fitness Links */}
        <NavLink
          to="/workouts"
          className={({ isActive }) =>
            `flex items-center gap-4 p-3 rounded-lg transition-colors duration-200 ${
              isActive
                ? "text-primary-container font-bold border-r-4 border-primary-container bg-surface-container-high"
                : "text-on-surface-variant hover:bg-surface-container-high active:scale-95 transition-transform"
            }`
          }
        >
          <span className="material-symbols-outlined">fitness_center</span>
          <span className="font-body-md text-body-md">Workouts</span>
        </NavLink>

        <NavLink
          to="/challenges"
          className={({ isActive }) =>
            `flex items-center gap-4 p-3 rounded-lg transition-colors duration-200 ${
              isActive
                ? "text-primary-container font-bold border-r-4 border-primary-container bg-surface-container-high"
                : "text-on-surface-variant hover:bg-surface-container-high active:scale-95 transition-transform"
            }`
          }
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>emoji_events</span>
          <span className="font-body-md text-body-md">Challenges</span>
        </NavLink>

        <NavLink
          to="/leaderboard"
          className={({ isActive }) =>
            `flex items-center gap-4 p-3 rounded-lg transition-colors duration-200 ${
              isActive
                ? "text-primary-container font-bold border-r-4 border-primary-container bg-surface-container-high"
                : "text-on-surface-variant hover:bg-surface-container-high active:scale-95 transition-transform"
            }`
          }
        >
          <span className="material-symbols-outlined">leaderboard</span>
          <span className="font-body-md text-body-md">Leaderboard</span>
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex items-center gap-4 p-3 rounded-lg transition-colors duration-200 ${
              isActive
                ? "text-primary-container font-bold border-r-4 border-primary-container bg-surface-container-high"
                : "text-on-surface-variant hover:bg-surface-container-high active:scale-95 transition-transform"
            }`
          }
        >
          <span className="material-symbols-outlined">person</span>
          <span className="font-body-md text-body-md">
            {role === 'member' ? 'Plans & Biometrics' : 'Profile'}
          </span>
        </NavLink>
      </div>


    </nav>
  );
}

export default Sidebar;
