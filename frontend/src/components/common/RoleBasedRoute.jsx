import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROLE_DASHBOARD_PATHS } from '../../utils/constants';
import Loader from './Loader';

export default function RoleBasedRoute({ children, allowedRoles }) {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-50">
        <Loader size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {

    const correctPath = ROLE_DASHBOARD_PATHS[user.role] || '/login';
    return <Navigate to={correctPath} replace />;
  }

  return children;
}