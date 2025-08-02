import { Navigate, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../Providers/AuthProvider';
import LoadingScreen from '../../Components/Loading';


const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) return <LoadingScreen></LoadingScreen>;

  if (user) return children;

  return <Navigate to="/login" state={location.pathname} replace />;
};

export default PrivateRoute;
