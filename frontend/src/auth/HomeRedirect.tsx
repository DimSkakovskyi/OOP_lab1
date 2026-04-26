import { Navigate } from 'react-router-dom';
import { useAuth } from './useAuth';

export default function HomeRedirect() {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role === 'ADMIN') {
    return <Navigate to="/admin/accounts" replace />;
  }

  return <Navigate to="/accounts" replace />;
}