import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

// Simple JWT decode (for client-side claims extraction only - not for security)
function decodeJWT(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c =>
      '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    ).join(''));
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isMounted = useRef(true);

  // Check for existing session on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const userData = localStorage.getItem('user');

        if (token && userData) {
          // Verify token is still valid by checking expiry
          const tokenPayload = decodeJWT(token);
          if (tokenPayload && (!tokenPayload.exp || tokenPayload.exp > Date.now() / 1000)) {
            setUser(JSON.parse(userData));
          } else {
            // Token expired, clear it
            localStorage.removeItem('access_token');
            localStorage.removeItem('user');
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
      } finally {
        if (isMounted.current) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      isMounted.current = false;
    };
  }, []);

  const login = useCallback(async (email, password) => {
    setError(null);
    try {
      const response = await authAPI.login(email, password);
      const { access_token } = response;

      // Decode token to get user info
      const tokenPayload = decodeJWT(access_token);
      const userData = { 
        email: tokenPayload?.sub || email, 
        name: tokenPayload?.name || email.split('@')[0] 
      };

      localStorage.setItem('access_token', access_token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);

      return { success: true };
    } catch (err) {
      const message = err.response?.data?.detail || 'Failed to log in';
      setError(message);
      return { success: false, error: message };
    }
  }, []);

  const signup = useCallback(async (name, email, password) => {
    setError(null);
    try {
      await authAPI.signup(name, email, password);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.detail || 'Failed to create account';
      setError(message);
      return { success: false, error: message };
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    setUser(null);
    setError(null);
  }, []);

  const forgotPassword = useCallback(async (email) => {
    setError(null);
    try {
      const response = await authAPI.forgotPassword(email);
      return { success: true, data: response };
    } catch (err) {
      const message = err.response?.data?.detail || 'Failed to process request';
      setError(message);
      return { success: false, error: message };
    }
  }, []);

  const resetPassword = useCallback(async (token, newPassword) => {
    setError(null);
    try {
      await authAPI.resetPassword(token, newPassword);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.detail || 'Invalid or expired reset token';
      setError(message);
      return { success: false, error: message };
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    forgotPassword,
    resetPassword,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
