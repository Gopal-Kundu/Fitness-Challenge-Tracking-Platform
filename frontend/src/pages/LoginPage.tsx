import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../store/userSlice';
import { authAPI } from '../services/api';

function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await authAPI.login({ email, password });
      if (data.user) {
        dispatch(setUser(data.user));
      } else {
        dispatch(setUser({ name: 'Jax Thorne', email, role: 'member', tier: 'ELITE' }));
      }
      navigate('/dashboard');
    } catch (err: any) {
      setError(err?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col items-center justify-center p-6 relative">
      {/* Back to Home Button */}
      <Link
        to="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors font-label-caps text-xs cursor-pointer bg-surface-container px-4 py-2 rounded-lg border border-outline-variant"
      >
        <span className="material-symbols-outlined text-sm">arrow_back</span>
        Back to Home
      </Link>

      <div className="bg-surface-container border border-outline-variant rounded-2xl max-w-md w-full p-8 space-y-6 shadow-2xl">
        <div className="text-center space-y-2">
          <h1 className="font-display-lg text-3xl text-primary font-bold">APEX PERFORMANCE</h1>
          <p className="font-body-md text-sm text-on-surface-variant">
            Sign in to access your live athletic performance ecosystem.
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-400 p-3 rounded-lg text-xs font-bold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="font-label-caps text-xs text-on-surface-variant mb-1 block">
              EMAIL ADDRESS
            </label>
            <input
              required
              className="w-full bg-surface-container-low border border-outline-variant text-on-surface px-4 py-3 rounded-lg focus:border-primary-container outline-none font-body-md transition-colors"
              type="email"
              placeholder="athlete@apex.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="font-label-caps text-xs text-on-surface-variant mb-1 block">
              PASSWORD
            </label>
            <input
              required
              className="w-full bg-surface-container-low border border-outline-variant text-on-surface px-4 py-3 rounded-lg focus:border-primary-container outline-none font-body-md transition-colors"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            disabled={loading}
            className="w-full py-4 bg-primary-container text-on-primary-container font-headline-md font-bold rounded-lg hover:brightness-110 active:scale-95 transition-all glow-lime cursor-pointer disabled:opacity-50"
            type="submit"
          >
            {loading ? 'AUTHENTICATING...' : 'SIGN IN'}
          </button>
        </form>

        <div className="text-center text-xs text-on-surface-variant pt-2 space-y-2">
          <div>
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-container font-bold hover:underline">
              Register Here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
