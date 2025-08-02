import React, { use } from 'react';
import DonorDashboard from './Donor/DonorDashboardHome';
import { AuthContext } from '../../Providers/AuthProvider';
import VolunteerDashboardHome from './Volunteer/VolunteerDashboard';
import AdminDashboardHome from './Admin/AdminDashboardHome';

const DashBoard = () => {
    const {userRole} = use(AuthContext);
    
    if(userRole === "donor"){
        return <> <DonorDashboard></DonorDashboard> </>
    }
    if(userRole === "volunteer"){
        return <> <VolunteerDashboardHome></VolunteerDashboardHome> </>
    }
    if(userRole === "admin"){
        return <> <AdminDashboardHome></AdminDashboardHome> </>
    }
};

export default DashBoard;