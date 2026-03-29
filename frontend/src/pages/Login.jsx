import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { CheckCheck, Loader2, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const fieldCls = `w-full border border-violet-200 dark:border-violet-600/25 focus:border-violet-600 dark:focus:border-violet-600/60
  rounded-lg px-4 py-2.5 text-sm text-text-body dark:text-mist-100 bg-white dark:bg-void-700
  placeholder:text-text-muted dark:placeholder:text-mist-500 outline-none transition-colors duration-150`;

export default function Login() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { login, error: authError, clearError } = useAuth();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPw, setShowPw]     = useState(false);
  const [loading, setLoading]   = useState(false);

  const successMessage = location.state?.message;
  const set = (e) => setFormData(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const r = await login(formData.email, formData.password);
    if (r.success) navigate('/dashboard');
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-violet-50 dark:bg-void-900 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-[420px]">

        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-violet-600 flex items-center justify-center shadow-sm">
              <CheckCheck className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-text-heading dark:text-mist-100 font-display">TaskFlow</span>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-void-800 border border-violet-200 dark:border-violet-600/20 rounded-2xl shadow-sm p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-text-heading dark:text-mist-100 mb-1">Welcome back</h1>
            <p className="text-sm text-text-secondary dark:text-mist-500">Sign in to your account to continue</p>
          </div>

          {successMessage && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-[#E8FDF3] dark:bg-[#0F6E56]/20 border border-[#0F6E56]/20 text-[#0F6E56] dark:text-[#5DCAA5] text-sm">
              {successMessage}
            </div>
          )}
          {authError && (
            <div className="mb-4 flex items-start justify-between gap-2 px-4 py-3 rounded-xl bg-[#FFEEF0] dark:bg-[#993556]/20 border border-[#993556]/20 text-[#993556] dark:text-[#ED93B1] text-sm">
              <span>{authError}</span>
              <button onClick={clearError} className="shrink-0 opacity-60 hover:opacity-100 cursor-pointer">✕</button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-semibold text-text-secondary dark:text-mist-500 mb-1.5">Email</label>
              <input type="email" name="email" value={formData.email} onChange={set}
                placeholder="you@example.com" required autoComplete="email" className={fieldCls} />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-text-secondary dark:text-mist-500">Password</label>
                <Link to="/forgot-password" className="text-xs font-medium text-violet-600 dark:text-mist-300 hover:text-violet-700 dark:hover:text-mist-100 transition-colors duration-150">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} name="password" value={formData.password} onChange={set}
                  placeholder="••••••••" required autoComplete="current-password" className={`${fieldCls} pr-10`} />
                <button type="button" onClick={() => setShowPw(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted dark:text-mist-500 hover:text-text-body dark:hover:text-mist-300 transition-colors cursor-pointer">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="mt-1 w-full inline-flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg bg-violet-600 hover:bg-violet-700 text-white disabled:opacity-60 transition-colors duration-150 cursor-pointer shadow-sm hover:shadow-md">
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Sign In
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-text-secondary dark:text-mist-500 mt-5">
          Don't have an account?{' '}
          <Link to="/signup" className="font-semibold text-violet-600 dark:text-mist-300 hover:text-violet-700 dark:hover:text-mist-100 transition-colors duration-150">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
