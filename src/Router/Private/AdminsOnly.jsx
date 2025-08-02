import { Navigate, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../Providers/AuthProvider';
import LoadingScreen from '../../Components/Loading';
import RestrictedPage from '../../Pages/Restricted Page/RestrictedPage';

const AdminOnly = ({ children }) => {
  const { user, loading, userRole } = useContext(AuthContext);
  const location = useLocation();

  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />

  // Only allow if user is logged in AND role is admin
  if (user && userRole === 'admin') return children;

  return <RestrictedPage></RestrictedPage>
};

export default AdminOnly;
