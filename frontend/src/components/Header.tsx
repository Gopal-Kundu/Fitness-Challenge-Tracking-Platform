import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from '../store/userSlice';
import { authAPI } from '../services/api';

function Header({
  title = "",
  userName: fallbackName = "Jax",
  userTier: fallbackTier = "ELITE TIER",
  avatarUrl: fallbackAvatar = "https://shorturl.at/FmV3K",
}: any) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const reduxUser = useSelector((state: any) => state.user);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    authAPI.getMe()
      .then((data: any) => {
        if (data && data.user) {
          dispatch(updateUser(data.user));
        }
      })
      .catch(() => {});
  }, [dispatch]);

  const handleLogout = async () => {
    try {
      await authAPI.logout();
    } catch {
      // ignore errors on logout
    }
    navigate('/login');
  };

  const displayName = reduxUser?.name || fallbackName;
  const displayTier = reduxUser?.tier || (reduxUser?.role === 'trainer' ? 'PERFORMANCE TRAINER' : fallbackTier);
  const displayAvatar = reduxUser?.avatar || fallbackAvatar;

  return (
    <>
      <header className="flex justify-between items-center h-16 px-spacing-margin-desktop bg-surface sticky top-0 z-40 border-b border-outline-variant px-6 md:px-12">
        <div className="flex items-center gap-6">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-primary focus:outline-none cursor-pointer flex items-center justify-center p-1 rounded-lg hover:bg-surface-container-high"
            aria-label="Toggle Navigation Menu"
          >
            <span className="material-symbols-outlined text-2xl">menu</span>
          </button>
          {title ? (
            <h2 className="font-headline-lg text-headline-lg font-black text-primary mr-2">{title}</h2>
          ) : (
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary-container text-2xl">bolt</span>
              <span className="font-headline-md text-lg font-bold text-primary tracking-wider uppercase">APEX</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4 sm:gap-6 relative">
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-3 cursor-pointer group focus:outline-none"
            >
              <div className="text-right hidden sm:block">
                <p className="font-label-caps text-[10px] text-on-surface-variant leading-none mb-1 uppercase font-bold">{displayTier}</p>
                <p className="font-body-md text-sm font-bold text-white">{displayName}</p>
              </div>
              <div className="w-9 h-9 rounded-full overflow-hidden border border-primary-container group-hover:scale-105 transition-transform flex-shrink-0">
                <img
                  className="w-full h-full object-cover"
                  src={displayAvatar}
                  alt="User Avatar"
                />
              </div>
              <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors text-sm">
                expand_more
              </span>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-3 w-56 bg-surface-container border border-outline-variant rounded-xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-4 py-3 border-b border-outline-variant sm:hidden">
                  <p className="font-bold text-white text-sm">{displayName}</p>
                  <p className="text-[10px] font-label-caps text-primary-container">{displayTier}</p>
                </div>
                <button
                  onClick={() => { setDropdownOpen(false); navigate('/profile'); }}
                  className="w-full text-left px-4 py-2.5 text-sm text-on-surface hover:bg-surface-container-high flex items-center gap-3 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">person</span>
                  View Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-3 cursor-pointer font-bold"
                >
                  <span className="material-symbols-outlined text-sm">logout</span>
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Slide-Out Drawer Navigation */}
      <div
        className={`fixed inset-0 z-50 flex md:hidden transition-opacity duration-300 ease-in-out ${
          mobileMenuOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        {/* Backdrop */}
        <div
          onClick={() => setMobileMenuOpen(false)}
          className={`fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300 ease-in-out ${
            mobileMenuOpen ? 'opacity-100' : 'opacity-0'
          }`}
        ></div>

        {/* Drawer Menu */}
        <nav
          className={`relative w-72 bg-surface-container-low border-r border-outline-variant h-full flex flex-col p-6 z-50 shadow-2xl transition-transform duration-300 cubic-bezier(0.16, 1, 0.3, 1) transform ${
            mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-headline-md text-xl font-bold text-primary">APEX PERFORMANCE</h1>
              <p className="font-label-caps text-[10px] text-on-surface-variant opacity-70">Elite Athletics</p>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="text-on-surface-variant hover:text-white p-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>

          <div className="flex-1 space-y-2">
            <NavLink
              to="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-4 p-3 rounded-lg transition-colors ${
                  isActive ? "text-primary-container font-bold bg-surface-container-high" : "text-on-surface-variant hover:bg-surface-container-high"
                }`
              }
            >
              <span className="material-symbols-outlined">dashboard</span>
              Dashboard
            </NavLink>

            <NavLink
              to="/workouts"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-4 p-3 rounded-lg transition-colors ${
                  isActive ? "text-primary-container font-bold bg-surface-container-high" : "text-on-surface-variant hover:bg-surface-container-high"
                }`
              }
            >
              <span className="material-symbols-outlined">fitness_center</span>
              Workouts
            </NavLink>

            <NavLink
              to="/challenges"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-4 p-3 rounded-lg transition-colors ${
                  isActive ? "text-primary-container font-bold bg-surface-container-high" : "text-on-surface-variant hover:bg-surface-container-high"
                }`
              }
            >
              <span className="material-symbols-outlined">emoji_events</span>
              Challenges
            </NavLink>

            <NavLink
              to="/leaderboard"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-4 p-3 rounded-lg transition-colors ${
                  isActive ? "text-primary-container font-bold bg-surface-container-high" : "text-on-surface-variant hover:bg-surface-container-high"
                }`
              }
            >
              <span className="material-symbols-outlined">leaderboard</span>
              Leaderboard
            </NavLink>

            <NavLink
              to="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-4 p-3 rounded-lg transition-colors ${
                  isActive ? "text-primary-container font-bold bg-surface-container-high" : "text-on-surface-variant hover:bg-surface-container-high"
                }`
              }
            >
              <span className="material-symbols-outlined">person</span>
              Profile
            </NavLink>
          </div>


        </nav>
      </div>
    </>
  );
}

export default Header;
