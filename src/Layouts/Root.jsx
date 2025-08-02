import React, { use } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import { AuthContext } from '../Providers/AuthProvider';
import LoadingScreen from '../Components/Loading';

const Root = () => {
    
    return (
        <>
            <Navbar></Navbar>
            <Outlet></Outlet>
        </>
    );
};

export default Root;