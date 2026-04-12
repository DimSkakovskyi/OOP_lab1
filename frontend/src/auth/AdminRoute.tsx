import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './useAuth';

export default function AdminRoute() {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== 'ADMIN') {
    return <Navigate to="/accounts" replace />;
  }

  return <Outlet />;
}