import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Sun, Moon, CheckCheck } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-100 bg-white/95 dark:bg-void-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-void-700">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">

        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-gray-800 dark:text-mist-100 hover:text-indigo-600 dark:hover:text-violet-400 transition-colors">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 dark:bg-violet-600 flex items-center justify-center">
            <CheckCheck className="w-4 h-4 text-white" />
          </div>
          Task Manager
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link to="/dashboard" className="text-sm font-medium text-gray-600 dark:text-mist-300 hover:text-gray-900 dark:hover:text-mist-100 transition-colors">
                Dashboard
              </Link>
              <span className="text-sm text-gray-400 dark:text-mist-500">{user.name}</span>
              <button onClick={handleLogout} className="text-sm font-medium text-gray-600 dark:text-mist-300 hover:text-gray-900 dark:hover:text-mist-100 transition-colors cursor-pointer">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-gray-600 dark:text-mist-300 hover:text-gray-900 dark:hover:text-mist-100 transition-colors">
                Login
              </Link>
              <Link to="/signup" className="text-sm font-semibold px-4 py-1.5 rounded-lg bg-indigo-600 dark:bg-violet-600 text-white hover:bg-indigo-700 dark:hover:bg-violet-700 transition-colors">
                Sign Up
              </Link>
            </>
          )}

          {/* Theme toggle */}
          <button
            onClick={toggle}
            aria-label="Toggle theme"
            className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-500 dark:text-mist-300 hover:bg-gray-100 dark:hover:bg-void-700 transition-colors cursor-pointer"
          >
            {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </nav>
  );
}
