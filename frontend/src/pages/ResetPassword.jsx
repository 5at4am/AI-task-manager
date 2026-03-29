import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/Button';
import Input from '../components/Input';
import Alert from '../components/Alert';
import Card from '../components/Card';
import './Auth.css';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { resetPassword, error: authError, clearError } = useAuth();
  
  const [formData, setFormData] = useState({
    token: searchParams.get('token') || '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      return;
    }

    if (formData.newPassword.length < 6) {
      return;
    }

    setLoading(true);
    
    const result = await resetPassword(formData.token, formData.newPassword);
    
    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        navigate('/login', { 
          state: { message: 'Password reset successful! Please log in.' } 
        });
      }, 2000);
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <Card className="auth-card">
          <div className="auth-header">
            <h1 className="auth-title">Reset password</h1>
            <p className="auth-subtitle">Enter your new password below</p>
          </div>

          {authError && <Alert variant="error" onClose={clearError}>{authError}</Alert>}

          {success ? (
            <div className="auth-success">
              <div className="success-icon">✓</div>
              <h3 className="success-title">Password Reset Successful!</h3>
              <p className="success-text">Redirecting to login...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="auth-form">
              <Input
                label="Reset Token"
                type="text"
                name="token"
                value={formData.token}
                onChange={handleChange}
                placeholder="Enter the reset token"
                required
              />

              <Input
                label="New Password"
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="••••••••"
                required
                autoComplete="new-password"
                minLength={6}
              />

              <Input
                label="Confirm New Password"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                required
                autoComplete="new-password"
              />

              <Button type="submit" variant="primary" size="lg" loading={loading} className="auth-submit">
                Reset Password
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
