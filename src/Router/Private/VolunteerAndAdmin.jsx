import { Navigate, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../Providers/AuthProvider';
import LoadingScreen from '../../Components/Loading';
import RestrictedPage from '../../Pages/Restricted Page/RestrictedPage';

const VolunteerAndAdmin = ({ children }) => {
  const { user, loading, userRole } = useContext(AuthContext);
  const location = useLocation();

  if (loading) return <LoadingScreen />;

  // Not logged in → redirect to login
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;

  // Logged in but not admin/volunteer → redirect to restricted
  if (userRole !== 'admin' && userRole !== 'volunteer') {
    return <RestrictedPage></RestrictedPage>
  }

  return children;
};

export default VolunteerAndAdmin;
