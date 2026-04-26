import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSkeleton from './LoadingSkeleton';

/**
 * Protects a route by role. Redirects to /login if unauthenticated,
 * or /unauthorized if role doesn't match.
 *
 * Usage: <ProtectedRoute roles={['admin']} />
 */
export default function ProtectedRoute({ roles = [] }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSkeleton type="page" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  if (roles.length > 0 && !roles.includes(user.role)) {
    const dashMap = { admin: '/admin', user: '/dashboard', owner: '/owner' };
    return <Navigate to={dashMap[user.role] || '/login'} replace />;
  }

  return <Outlet />;
}
