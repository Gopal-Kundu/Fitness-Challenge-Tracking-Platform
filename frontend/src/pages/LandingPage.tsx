import { useState } from 'react';
import { Link } from 'react-router-dom';

function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-on-background font-body-md overflow-x-hidden">
      {/* Top Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-outline-variant px-4 sm:px-6 md:px-12 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="material-symbols-outlined text-primary-container text-2xl sm:text-3xl">bolt</span>
          <span className="font-headline-md text-lg sm:text-2xl font-black text-primary tracking-wider uppercase">
            <span className="hidden sm:inline">APEX PERFORMANCE</span>
            <span className="sm:hidden">APEX</span>
          </span>
        </div>

        {/* Desktop Links */}
        <div className="hidden sm:flex items-center gap-4">
          <Link
            to="/login"
            className="px-5 py-2.5 rounded-lg border border-outline-variant text-on-surface hover:border-primary-container font-label-caps text-xs transition-all cursor-pointer"
          >
            SIGN IN
          </Link>
          <Link
            to="/register"
            className="px-6 py-2.5 rounded-lg bg-primary-container text-on-primary-container font-headline-md text-xs font-bold hover:brightness-110 active:scale-95 transition-all glow-lime cursor-pointer"
          >
            JOIN NOW
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex sm:hidden items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-primary p-2 focus:outline-none cursor-pointer flex items-center justify-center rounded-lg hover:bg-surface-container-high"
            aria-label="Toggle Navigation Menu"
          >
            <span className="material-symbols-outlined text-2xl">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </header>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="fixed top-[65px] left-0 right-0 z-40 bg-surface-container-low/95 backdrop-blur-xl border-b border-outline-variant p-6 sm:hidden space-y-4 animate-in slide-in-from-top duration-200 shadow-2xl">
          <div className="flex flex-col gap-3">
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center px-5 py-3 rounded-xl border border-outline-variant text-on-surface hover:border-primary-container font-label-caps text-sm font-bold transition-all cursor-pointer"
            >
              SIGN IN
            </Link>
            <Link
              to="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center px-6 py-3 rounded-xl bg-primary-container text-on-primary-container font-headline-md text-sm font-bold hover:brightness-110 transition-all glow-lime cursor-pointer"
            >
              JOIN NOW
            </Link>
          </div>
        </div>
      )}

      {/* Hero Section - Centered */}
      <section className="relative pt-36 pb-20 px-6 md:px-12 max-w-[1440px] mx-auto min-h-[90vh] flex flex-col justify-center items-center text-center">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary-container/10 rounded-full blur-3xl -z-10"></div>
        <div className="max-w-4xl space-y-6 flex flex-col items-center">
          <span className="px-4 py-1.5 rounded-full bg-primary-container/10 border border-primary-container text-primary-container font-label-caps text-xs font-bold uppercase tracking-widest inline-block">
            LIVE ATHLETIC TELEMETRY ECOSYSTEM
          </span>
          <h1 className="font-display-lg text-5xl md:text-7xl text-white font-extrabold uppercase italic leading-tight text-center">
            ENGINEERED FOR<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-container via-lime-400 to-secondary-container">
              PEAK PERFORMANCE
            </span>
          </h1>
          <p className="font-body-lg text-xl text-on-surface-variant max-w-2xl text-center">
            Track real-time metabolic output, compete in community fitness challenges, and unlock customized workout plans designed for high-velocity conditioning.
          </p>
          <div className="flex flex-wrap gap-4 pt-4 justify-center">
            <Link
              to="/register"
              className="px-8 py-4 rounded-xl bg-primary-container text-on-primary-container font-headline-md text-lg font-bold hover:scale-105 active:scale-95 transition-transform glow-lime cursor-pointer flex items-center gap-2"
            >
              START TRAINING NOW
              <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
          </div>
        </div>

        {/* Live Metrics Banner */}
        <div className="mt-20 w-full grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant text-center">
            <p className="font-label-caps text-xs text-on-surface-variant uppercase">ACTIVE ATHLETIIC COMMUNITY</p>
            <p className="font-metric-xl text-4xl text-primary-container font-bold mt-1">45,000+</p>
          </div>
          <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant text-center">
            <p className="font-label-caps text-xs text-on-surface-variant uppercase">WORKOUT MODULES</p>
            <p className="font-metric-xl text-4xl text-primary font-bold mt-1">120+</p>
          </div>
          <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant text-center">
            <p className="font-label-caps text-xs text-on-surface-variant uppercase">COMMUNITY CHALLENGES</p>
            <p className="font-metric-xl text-4xl text-secondary-container font-bold mt-1">35 ACTIVE</p>
          </div>
          <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant text-center">
            <p className="font-label-caps text-xs text-on-surface-variant uppercase">GLOBAL RANKING CLANS</p>
            <p className="font-metric-xl text-4xl text-white font-bold mt-1">1,200+</p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6 md:px-12 bg-surface-container-lowest border-t border-outline-variant">
        <div className="max-w-[1440px] mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="font-headline-lg text-3xl md:text-4xl text-primary uppercase font-bold">PLATFORM ARCHITECTURE</h2>
            <p className="text-on-surface-variant font-body-lg">Everything you need to surpass personal records and track progress with precision.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-surface-container p-8 rounded-2xl border border-outline-variant space-y-4 hover:border-primary-container transition-colors text-center md:text-left">
              <span className="material-symbols-outlined text-4xl text-primary-container">timer</span>
              <h3 className="font-headline-md text-xl text-white font-bold">Live Telemetry &amp; Set Tracking</h3>
              <p className="text-on-surface-variant font-body-md">Log reps, wattage output, heart rate zones, and interval timers during active workout sessions.</p>
            </div>

            <div className="bg-surface-container p-8 rounded-2xl border border-outline-variant space-y-4 hover:border-primary-container transition-colors text-center md:text-left">
              <span className="material-symbols-outlined text-4xl text-secondary-container">emoji_events</span>
              <h3 className="font-headline-md text-xl text-white font-bold">Community Challenges</h3>
              <p className="text-on-surface-variant font-body-md">Join endurance and strength challenges, compete for badges, and climb global leaderboards.</p>
            </div>

            <div className="bg-surface-container p-8 rounded-2xl border border-outline-variant space-y-4 hover:border-primary-container transition-colors text-center md:text-left">
              <span className="material-symbols-outlined text-4xl text-tertiary-fixed">leaderboard</span>
              <h3 className="font-headline-md text-xl text-white font-bold">Global Standings</h3>
              <p className="text-on-surface-variant font-body-md">Real-time leaderboard rankings updated live based on user workout output and challenge wins.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <footer className="py-12 px-6 md:px-12 bg-background border-t border-outline-variant text-center space-y-4">
        <h3 className="font-headline-md text-2xl text-primary font-bold">READY TO ELEVATE YOUR ATHLETIC OUTPUT?</h3>
        <div className="flex justify-center gap-4">
          <Link to="/register" className="px-8 py-3.5 bg-primary-container text-on-primary-container font-bold rounded-lg hover:brightness-110 cursor-pointer">
            JOIN APEX ATHLETICS
          </Link>
        </div>
        <p className="text-xs text-on-surface-variant pt-4">© 2026 APEX PERFORMANCE PLATFORM. ALL RIGHTS RESERVED.</p>
      </footer>
    </div>
  );
}

export default LandingPage;
