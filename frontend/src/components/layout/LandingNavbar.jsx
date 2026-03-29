import { Link } from 'react-router-dom';
import { CheckCheck, Sun, Moon } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useScroll } from '../../hooks/useScroll';
import UIButton from '../ui/Button';

const NAV_LINKS = ['Features', 'How It Works', 'FAQ'];

export default function LandingNavbar() {
  const { user } = useAuth();
  const { dark, toggle } = useTheme();
  const scrolled = useScroll(10);

  return (
    <nav
      className={`sticky top-0 z-50 h-16 transition-all duration-250
        ${scrolled
          ? 'bg-white/80 dark:bg-void-950/80 backdrop-blur-md border-b border-violet-200 dark:border-violet-600/10 shadow-xs'
          : 'bg-transparent border-b border-transparent'
        }`}
    >
      <div className="max-w-[1280px] mx-auto px-5 sm:px-6 lg:px-8 xl:px-10 h-full flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow duration-250">
            <CheckCheck className="w-4 h-4 text-white" />
          </div>
          <span className="text-base font-bold text-text-heading dark:text-mist-100 font-display">
            TaskFlow
          </span>
        </Link>

        {/* Center nav links */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(link => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className="text-sm font-medium text-text-secondary dark:text-mist-300 hover:text-violet-600 dark:hover:text-mist-100 transition-colors duration-150"
            >
              {link}
            </a>
          ))}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          {user ? (
            <Link to="/dashboard">
              <UIButton size="md">Dashboard</UIButton>
            </Link>
          ) : (
            <>
              <Link to="/login" className="hidden sm:block text-sm font-medium text-text-secondary dark:text-mist-300 hover:text-violet-600 dark:hover:text-mist-100 transition-colors duration-150">
                Sign in
              </Link>
              <Link to="/signup">
                <UIButton size="md">Get started</UIButton>
              </Link>
            </>
          )}

          {/* Theme toggle */}
          <button
            onClick={toggle}
            aria-label="Toggle theme"
            className="w-9 h-9 flex items-center justify-center rounded-lg text-text-secondary dark:text-mist-300 hover:bg-violet-50 dark:hover:bg-void-700 transition-colors duration-150 cursor-pointer"
          >
            {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </nav>
  );
}
