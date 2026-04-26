import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function NotFound() {
  const { user } = useAuth();
  const dashMap = { admin: '/admin', user: '/dashboard', owner: '/owner' };
  const home = user ? (dashMap[user.role] || '/') : '/';

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 animate-fade-in">
      <p className="text-8xl font-black gradient-text">404</p>
      <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-4">Page Not Found</h1>
      <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-sm">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to={home} className="btn-primary mt-8">
        Go Home
      </Link>
    </div>
  );
}
