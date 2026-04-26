import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { SunIcon, MoonIcon, ArrowRightOnRectangleIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const roleLabel = { admin: 'Admin', user: 'User', owner: 'Store Owner' };
const roleDash  = { admin: '/admin', user: '/dashboard', owner: '/owner' };

export default function Navbar() {
  const { user, logout } = useAuth();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully.');
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800
                       bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          to={user ? roleDash[user.role] : '/'}
          className="flex items-center gap-2 font-extrabold text-xl tracking-tight"
        >
          <span className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center text-white text-sm font-black">R</span>
          <span className="gradient-text">RateSphere</span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Dark mode toggle */}
          <button
            onClick={toggle}
            className="btn-ghost p-2 rounded-xl"
            aria-label="Toggle dark mode"
          >
            {dark
              ? <SunIcon  className="w-5 h-5 text-amber-400" />
              : <MoonIcon className="w-5 h-5 text-slate-500" />}
          </button>

          {user ? (
            <>
              {/* User info */}
              <Link to="/profile" className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl
                hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <UserCircleIcon className="w-5 h-5 text-primary-500" />
                <div className="text-sm">
                  <p className="font-medium text-slate-800 dark:text-slate-100 leading-none">
                    {user.name?.split(' ')[0]}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {roleLabel[user.role]}
                  </p>
                </div>
              </Link>

              {/* Logout */}
              <button onClick={handleLogout} className="btn-ghost p-2 rounded-xl" aria-label="Logout">
                <ArrowRightOnRectangleIcon className="w-5 h-5 text-slate-500 dark:text-slate-400" />
              </button>
            </>
          ) : (
            <Link to="/login" className="btn-primary text-sm px-4 py-2">Sign In</Link>
          )}
        </div>
      </div>
    </header>
  );
}
