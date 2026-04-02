import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) return <div className="loading">Loading...</div>;

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export const AdminRoute = () => {
  const { user, loading } = useAuth();

  if (loading) return <div className="loading">Loading...</div>;

  return user && user.is_admin ? <Outlet /> : <Navigate to="/dashboard" replace />;
};
