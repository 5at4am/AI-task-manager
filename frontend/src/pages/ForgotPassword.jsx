import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCheck, Loader2, MailCheck } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const fieldCls = `w-full border border-violet-200 dark:border-violet-600/25 focus:border-violet-600 dark:focus:border-violet-600/60
  rounded-lg px-4 py-2.5 text-sm text-text-body dark:text-mist-100 bg-white dark:bg-void-700
  placeholder:text-text-muted dark:placeholder:text-mist-500 outline-none transition-colors duration-150`;

export default function ForgotPassword() {
  const { forgotPassword, error: authError, clearError } = useAuth();

  const [email, setEmail]         = useState('');
  const [loading, setLoading]     = useState(false);
  const [success, setSuccess]     = useState(false);
  const [resetToken, setResetToken] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const r = await forgotPassword(email);
    if (r.success) {
      setSuccess(true);
      if (r.data?.reset_token) setResetToken(r.data.reset_token);
    }
    setLoading(false);
  };

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
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-[#E8FDF3] dark:bg-[#0F6E56]/20 flex items-center justify-center mx-auto mb-4">
                <MailCheck className="w-7 h-7 text-[#0F6E56] dark:text-[#5DCAA5]" />
              </div>
              <h2 className="text-xl font-bold text-text-heading dark:text-mist-100 mb-2">Check your email</h2>
              <p className="text-sm text-text-secondary dark:text-mist-500 leading-relaxed mb-4">
                We sent reset instructions to <span className="font-semibold text-text-body dark:text-mist-300">{email}</span>
              </p>

              {resetToken && (
                <div className="text-left mb-4 p-3.5 rounded-xl bg-violet-50 dark:bg-violet-600/10 border border-violet-200 dark:border-violet-600/25">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted dark:text-mist-500 mb-2">Dev Token</p>
                  <code className="block text-xs font-mono text-violet-600 dark:text-mist-300 break-all mb-3">{resetToken}</code>
                  <Link to={`/reset-password?token=${resetToken}`}
                    className="text-xs font-semibold text-violet-600 dark:text-mist-300 hover:text-violet-700 dark:hover:text-mist-100 transition-colors duration-150">
                    Go to Reset Password →
                  </Link>
                </div>
              )}

              <Link to="/login" className="text-sm font-semibold text-violet-600 dark:text-mist-300 hover:text-violet-700 dark:hover:text-mist-100 transition-colors duration-150">
                ← Back to Sign In
              </Link>
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-text-heading dark:text-mist-100 mb-1">Forgot password?</h1>
                <p className="text-sm text-text-secondary dark:text-mist-500">Enter your email and we'll send reset instructions.</p>
              </div>

              {authError && (
                <div className="mb-4 flex items-start justify-between gap-2 px-4 py-3 rounded-xl bg-[#FFEEF0] dark:bg-[#993556]/20 border border-[#993556]/20 text-[#993556] dark:text-[#ED93B1] text-sm">
                  <span>{authError}</span>
                  <button onClick={clearError} className="shrink-0 opacity-60 hover:opacity-100 cursor-pointer">✕</button>
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-semibold text-text-secondary dark:text-mist-500 mb-1.5">Email</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com" required autoComplete="email" className={fieldCls} />
                </div>
                <button type="submit" disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg bg-violet-600 hover:bg-violet-700 text-white disabled:opacity-60 transition-colors duration-150 cursor-pointer shadow-sm hover:shadow-md">
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  Send Reset Link
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
