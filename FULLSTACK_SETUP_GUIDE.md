# Task Manager - Full Stack Setup Guide

A complete step-by-step guide to connect the React frontend with the FastAPI backend and implement authentication.

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Prerequisites](#prerequisites)
3. [Project Structure](#project-structure)
4. [Step 1: Understanding the Backend API](#step-1-understanding-the-backend-api)
5. [Step 2: Setting Up the Frontend](#step-2-setting-up-the-frontend)
6. [Step 3: Creating the API Service](#step-3-creating-the-api-service)
7. [Step 4: Authentication Context](#step-4-authentication-context)
8. [Step 5: Building Auth Pages](#step-5-building-auth-pages)
9. [Step 6: Connecting Everything](#step-6-connecting-everything)
10. [Step 7: Running the Application](#step-7-running-the-application)
11. [Testing the Authentication Flow](#testing-the-authentication-flow)
12. [Troubleshooting](#troubleshooting)

---

## Project Overview

This project consists of:
- **Backend**: FastAPI (Python) - Handles authentication API endpoints
- **Frontend**: React (JavaScript) - User interface for authentication pages
- **Communication**: REST API with JWT tokens

### Authentication Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Frontend  │────▶│   Backend   │────▶│   Database  │
│   (React)   │◀────│   (FastAPI) │◀────│   (Store)   │
└─────────────┘     └─────────────┘     └─────────────┘
       │
       │ JWT Token
       ▼
┌─────────────┐
│ LocalStorage│
└─────────────┘
```

---

## Prerequisites

Before starting, make sure you have installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **Python** (v3.10 or higher) - [Download](https://www.python.org/)
- **uv** (Python package manager) - [Install](https://github.com/astral-sh/uv)

Verify installations:

```bash
node --version    # Should show v18.x.x or higher
npm --version     # Should show 9.x.x or higher
python --version  # Should show 3.10.x or higher
uv --version      # Should show latest version
```

---

## Project Structure

```
task_manager/
├── backend/
│   ├── server/
│   │   ├── auth/
│   │   │   ├── router.py      # API endpoints
│   │   │   ├── models.py      # Request/Response models
│   │   │   ├── store.py       # In-memory database
│   │   │   └── utils.py       # Password hashing & JWT
│   │   └── main.py            # FastAPI app entry
│   ├── requirements.txt       # Python dependencies
│   └── .env                   # Environment variables
│
└── frontend/
    ├── src/
    │   ├── components/        # Reusable components
    │   ├── contexts/          # React contexts
    │   ├── pages/             # Page components
    │   ├── services/          # API services
    │   └── App.jsx            # Main app with routing
    ├── package.json           # Node dependencies
    └── vite.config.js         # Vite configuration
```

---

## Step 1: Understanding the Backend API

### Backend API Endpoints

The backend provides these authentication endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/signup` | Create new account |
| POST | `/auth/login` | Login and get JWT token |
| POST | `/auth/forgot-password` | Request password reset |
| POST | `/auth/reset-password` | Reset password with token |

### Backend Code Explained

**`backend/server/auth/router.py`** - API Routes:

```python
from fastapi import APIRouter, HTTPException, status
from .models import SignupRequest, LoginRequest, ForgotPasswordRequest, ResetPasswordRequest
from .utils import hash_password, verify_password, create_access_token, create_reset_token, decode_token
from . import store

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/signup", status_code=status.HTTP_201_CREATED)
def signup(body: SignupRequest):
    if store.get_user(body.email):
        raise HTTPException(status_code=400, detail="Email already registered")
    store.create_user(body.name, body.email, hash_password(body.password))
    return {"message": "Account created successfully"}

@router.post("/login", response_model=TokenResponse)
def login(body: LoginRequest):
    user = store.get_user(body.email)
    if not user or not verify_password(body.password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_access_token({"sub": user["email"], "name": user["name"]})
    return TokenResponse(access_token=token)
```

**Key Points:**
- Uses **Pydantic models** for request validation
- **Passwords are hashed** before storing
- **JWT tokens** are generated on login
- Returns appropriate HTTP status codes

---

## Step 2: Setting Up the Frontend

### 2.1 Initialize the Project

```bash
cd task_manager/frontend
npm init -y
```

### 2.2 Install Dependencies

```bash
npm install react react-dom react-router-dom axios
npm install -D vite @vitejs/plugin-react
```

### 2.3 Configure Vite

Create `vite.config.js`:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
```

**Why the proxy?**
- Avoids CORS issues during development
- Routes `/api/*` requests to the backend at `http://localhost:8000`
- Rewrites `/api/auth/login` → `/auth/login`

### 2.4 Create index.html

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Task Manager</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

---

## Step 3: Creating the API Service

### 3.1 Create the API Client

Create `src/services/api.js`:

```javascript
import axios from 'axios';

const API_BASE_URL = '/api/auth';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add JWT token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Export API functions
export const authAPI = {
  // Sign up new user
  signup: async (name, email, password) => {
    const response = await api.post('/signup', { name, email, password });
    return response.data;
  },

  // Login user
  login: async (email, password) => {
    const response = await api.post('/login', { email, password });
    return response.data;
  },

  // Request password reset
  forgotPassword: async (email) => {
    const response = await api.post('/forgot-password', { email });
    return response.data;
  },

  // Reset password with token
  resetPassword: async (token, newPassword) => {
    const response = await api.post('/reset-password', { 
      token, 
      new_password: newPassword 
    });
    return response.data;
  },
};

export default api;
```

### Key Concepts:

1. **axios.create()** - Creates a configured instance
2. **Interceptors** - Automatically add JWT token to requests
3. **Async/await** - Handle promises cleanly
4. **Error handling** - Let components handle errors

---

## Step 4: Authentication Context

### 4.1 Create Auth Context

Create `src/contexts/AuthContext.jsx`:

```javascript
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  // Login function
  const login = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  // Signup function
  const signup = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook for using auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
```

### Why Context API?

- **Global state** - Access user data from any component
- **No prop drilling** - Clean component hierarchy
- **Persistent sessions** - Stay logged in on refresh

---

## Step 5: Building Auth Pages

### 5.1 Login Page

Create `src/pages/Login.jsx`:

```javascript
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.login(formData.email, formData.password);
      // Store token and user data
      login({ email: formData.email }, response.access_token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to log in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Welcome Back</h1>
        
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <p>
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
```

### 5.2 Signup Page

Create `src/pages/Signup.jsx`:

```javascript
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export default function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Client-side validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await authAPI.signup(formData.name, formData.email, formData.password);
      signup({ name: formData.name, email: formData.email });
      navigate('/login', { 
        state: { message: 'Account created! Please log in.' } 
      });
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Create Account</h1>
        
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" name="name" onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input type="password" name="confirmPassword" onChange={handleChange} required />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <p>
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}
```

### 5.3 Forgot Password Page

Create `src/pages/ForgotPassword.jsx`:

```javascript
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authAPI } from '../services/api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetToken, setResetToken] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.forgotPassword(email);
      setSuccess(true);
      // In development, the API returns the reset token directly
      if (response.reset_token) {
        setResetToken(response.reset_token);
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to process request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Forgot Password?</h1>
        
        {error && <div className="error-message">{error}</div>}

        {success ? (
          <div className="success-message">
            <p>Check your email for reset instructions!</p>
            {resetToken && (
              <div>
                <p><strong>Dev Token:</strong> {resetToken}</p>
                <Link to={`/reset-password?token=${resetToken}`}>
                  Go to Reset Password
                </Link>
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit" disabled={loading}>
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        )}

        <p>
          Remember your password? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}
```

### 5.4 Reset Password Page

Create `src/pages/ResetPassword.jsx`:

```javascript
import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { authAPI } from '../services/api';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    token: searchParams.get('token') || '',
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await authAPI.resetPassword(formData.token, formData.newPassword);
      setSuccess(true);
      setTimeout(() => {
        navigate('/login', { 
          state: { message: 'Password reset successful! Please log in.' } 
        });
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid or expired reset token');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Reset Password</h1>
        
        {error && <div className="error-message">{error}</div>}

        {success ? (
          <div className="success-message">
            <p>Password Reset Successful!</p>
            <p>Redirecting to login...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Reset Token</label>
              <input
                type="text"
                name="token"
                value={formData.token}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                name="newPassword"
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Confirm New Password</label>
              <input
                type="password"
                name="confirmPassword"
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" disabled={loading}>
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}

        <p>
          Remember your password? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}
```

---

## Step 6: Connecting Everything

### 6.1 Set Up React Router

Create `src/App.jsx`:

```javascript
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Navbar />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
```

### 6.2 Create Entry Point

Create `src/main.jsx`:

```javascript
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

### 6.3 Create Navbar Component

Create `src/components/Navbar.jsx`:

```javascript
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo">Task Manager</Link>
      <div className="nav-links">
        {user ? (
          <>
            <span>Hello, {user.name}</span>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}
```

---

## Step 7: Running the Application

### 7.1 Start the Backend

Open terminal 1:

```bash
cd task_manager/backend

# Install Python dependencies (first time only)
uv pip install -r requirements.txt

# Start the FastAPI server
uv run uvicorn server.main:app --reload --host 0.0.0.0 --port 8000
```

You should see:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete.
```

### 7.2 Start the Frontend

Open terminal 2:

```bash
cd task_manager/frontend

# Install Node dependencies (first time only)
npm install

# Start the Vite dev server
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

### 7.3 Open in Browser

Navigate to: **http://localhost:3000**

---

## Testing the Authentication Flow

### Complete User Journey

#### 1. Sign Up a New User

1. Go to http://localhost:3000
2. Click "Sign Up" or navigate to `/signup`
3. Fill in the form:
   - Name: `John Doe`
   - Email: `john@example.com`
   - Password: `password123`
   - Confirm Password: `password123`
4. Click "Sign Up"
5. You'll be redirected to login

#### 2. Log In

1. Enter credentials:
   - Email: `john@example.com`
   - Password: `password123`
2. Click "Log In"
3. You'll be redirected to `/dashboard`
4. Check localStorage (F12 → Application → Local Storage):
   ```
   token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   user: {"email":"john@example.com"}
   ```

#### 3. Test Password Reset

1. Log out from the dashboard
2. Go to `/forgot-password`
3. Enter email: `john@example.com`
4. Click "Send Reset Link"
5. Copy the reset token shown
6. Click the link to go to reset password
7. Enter new password
8. Submit and log in with new password

### API Testing with DevTools

Open Browser DevTools (F12) → Network tab:

**Login Request:**
```http
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

---

## Troubleshooting

### Common Issues

#### 1. CORS Error

**Error:** `Access to fetch at 'http://localhost:8000' has been blocked by CORS policy`

**Solution:** The Vite proxy should handle this. Make sure `vite.config.js` has the proxy configuration.

#### 2. Backend Not Responding

**Error:** `Network Error` or `Failed to fetch`

**Solution:**
```bash
# Check if backend is running
curl http://localhost:8000/health

# Should return: {"status":"healthy"}
```

#### 3. Token Not Being Sent

**Check:** Open DevTools → Application → Local Storage
- Verify `token` exists
- Check Network tab → Request Headers for `Authorization: Bearer <token>`

#### 4. "Email already registered" Error

**Solution:** The backend uses in-memory storage. Restart the backend to clear data:
```bash
# Stop backend (Ctrl+C) and restart
uv run uvicorn server.main:app --reload
```

#### 5. Page Shows Blank/White Screen

**Solution:**
1. Open DevTools Console (F12)
2. Check for errors
3. Common fix: Clear browser cache and reload (Ctrl+Shift+R)

### Debug Checklist

- [ ] Backend running on port 8000
- [ ] Frontend running on port 3000
- [ ] No CORS errors in console
- [ ] API requests visible in Network tab
- [ ] Token stored in LocalStorage after login
- [ ] Authorization header present in requests

---

## Additional Resources

### Learn More

- [React Documentation](https://react.dev/)
- [React Router Documentation](https://reactrouter.com/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Axios Documentation](https://axios-http.com/)
- [JWT.io](https://jwt.io/) - Decode and verify JWT tokens

### Next Steps

1. Add task CRUD operations
2. Implement protected routes
3. Add form validation with libraries like Yup
4. Add loading states and error boundaries
5. Implement refresh token logic
6. Add email verification

---

## Summary

You've now connected a React frontend with a FastAPI backend! Here's what we built:

| Component | Technology | Purpose |
|-----------|------------|---------|
| Frontend | React + Vite | User interface |
| Backend | FastAPI | REST API |
| Routing | React Router | Client-side navigation |
| Auth State | Context API | Global user state |
| HTTP Client | Axios | API requests |
| Token Storage | LocalStorage | Persistent sessions |

**Key Takeaways:**
1. Use a proxy to avoid CORS during development
2. Store JWT tokens in localStorage for persistence
3. Use Context API for global auth state
4. Handle errors gracefully in both frontend and backend
5. Validate on both client and server side

Happy coding! 🚀
