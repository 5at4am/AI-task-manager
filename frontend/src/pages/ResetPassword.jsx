import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCheck, Loader2, ShieldCheck } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const fieldCls = `w-full border border-violet-200 dark:border-violet-600/25 focus:border-violet-600 dark:focus:border-violet-600/60
  rounded-lg px-4 py-2.5 text-sm text-text-body dark:text-mist-100 bg-white dark:bg-void-700
  placeholder:text-text-muted dark:placeholder:text-mist-500 outline-none transition-colors duration-150`;

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { resetPassword, error: authError, clearError } = useAuth();

  const [formData, setFormData] = useState({
    token: searchParams.get('token') || '',
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const set = (e) => { setFormData(p => ({ ...p, [e.target.name]: e.target.value })); if (error) setError(''); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) return setError('Passwords do not match');
    if (formData.newPassword.length < 6) return setError('Password must be at least 6 characters');
    setLoading(true);
    const r = await resetPassword(formData.token, formData.newPassword);
    if (r.success) {
      setSuccess(true);
      setTimeout(() => navigate('/login', { state: { message: 'Password reset successful! Please sign in.' } }), 2000);
    }
    setLoading(false);
  };

  const anyError = error || authError;

  return (
    <div className="min-h-screen bg-violet-50 dark:bg-void-900 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-[420px]">

        <div className="flex justify-center mb-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-violet-600 flex items-center justify-center shadow-sm">
              <CheckCheck className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-text-heading dark:text-mist-100 font-display">TaskFlow</span>
          </Link>
        </div>

        <div className="bg-white dark:bg-void-800 border border-violet-200 dark:border-violet-600/20 rounded-2xl shadow-sm p-8">

          {success ? (
            <div className="text-center py-4">
              <div className="w-14 h-14 rounded-2xl bg-[#E8FDF3] dark:bg-[#0F6E56]/20 flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="w-7 h-7 text-[#0F6E56] dark:text-[#5DCAA5]" />
              </div>
              <h2 className="text-xl font-bold text-text-heading dark:text-mist-100 mb-2">Password reset!</h2>
              <p className="text-sm text-text-secondary dark:text-mist-500">Redirecting you to sign in…</p>
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-text-heading dark:text-mist-100 mb-1">Reset password</h1>
                <p className="text-sm text-text-secondary dark:text-mist-500">Enter your new password below</p>
              </div>

              {anyError && (
                <div className="mb-4 flex items-start justify-between gap-2 px-4 py-3 rounded-xl bg-[#FFEEF0] dark:bg-[#993556]/20 border border-[#993556]/20 text-[#993556] dark:text-[#ED93B1] text-sm">
                  <span>{anyError}</span>
                  <button onClick={() => { setError(''); clearError(); }} className="shrink-0 opacity-60 hover:opacity-100 cursor-pointer">✕</button>
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-semibold text-text-secondary dark:text-mist-500 mb-1.5">Reset Token</label>
                  <input type="text" name="token" value={formData.token} onChange={set}
                    placeholder="Paste your reset token" required className={fieldCls} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-secondary dark:text-mist-500 mb-1.5">New Password</label>
                  <input type="password" name="newPassword" value={formData.newPassword} onChange={set}
                    placeholder="••••••••" required minLength={6} autoComplete="new-password" className={fieldCls} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-secondary dark:text-mist-500 mb-1.5">Confirm New Password</label>
                  <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={set}
                    placeholder="••••••••" required autoComplete="new-password" className={fieldCls} />
                </div>

                <button type="submit" disabled={loading}
                  className="mt-1 w-full inline-flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg bg-violet-600 hover:bg-violet-700 text-white disabled:opacity-60 transition-colors duration-150 cursor-pointer shadow-sm hover:shadow-md">
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  Reset Password
                </button>
              </form>
            </>
          )}
        </div>

        <p className="text-center text-sm text-text-secondary dark:text-mist-500 mt-5">
          Remember your password?{' '}
          <Link to="/login" className="font-semibold text-violet-600 dark:text-mist-300 hover:text-violet-700 dark:hover:text-mist-100 transition-colors duration-150">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
