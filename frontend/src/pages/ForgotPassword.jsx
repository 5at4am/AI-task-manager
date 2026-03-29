import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/Button';
import Input from '../components/Input';
import Alert from '../components/Alert';
import Card from '../components/Card';
import './Auth.css';

export default function ForgotPassword() {
  const { forgotPassword, error: authError, clearError } = useAuth();
  
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [resetToken, setResetToken] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const result = await forgotPassword(email);
    
    if (result.success) {
      setSuccess(true);
      if (result.data?.reset_token) {
        setResetToken(result.data.reset_token);
      }
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <Card className="auth-card">
          <div className="auth-header">
            <h1 className="auth-title">Forgot password?</h1>
            <p className="auth-subtitle">
              No worries! Enter your email and we'll send you reset instructions.
            </p>
          </div>

          {authError && <Alert variant="error" onClose={clearError}>{authError}</Alert>}

          {success ? (
            <div className="auth-success">
              <div className="success-icon">✓</div>
              <h3 className="success-title">Check your email</h3>
              <p className="success-text">
                We've sent password reset instructions to <strong>{email}</strong>
              </p>
              
              {resetToken && (
                <div className="dev-token">
                  <p className="dev-token-label">Development Token:</p>
                  <code className="dev-token-code">{resetToken}</code>
                  <Link 
                    to={`/reset-password?token=${resetToken}`}
                    className="btn-link"
                  >
                    Go to Reset Password →
                  </Link>
                </div>
              )}
              
              <Link to="/login" className="auth-link back-link">
                ← Back to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="auth-form">
              <Input
                label="Email"
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoComplete="email"
              />

              <Button type="submit" variant="primary" size="lg" loading={loading} className="auth-submit">
                Send Reset Link
              </Button>
            </form>
          )}

          <p className="auth-footer">
            Remember your password? <Link to="/login" className="auth-link">Sign in</Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
