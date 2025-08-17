import React, { use } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import { AuthContext } from '../Providers/AuthProvider';
import LoadingScreen from '../Components/Loading';
import Footer from '../Components/Footer';

const Root = () => {
    
    return (
        <>
            <Navbar></Navbar>
            <Outlet></Outlet>
            <Footer></Footer>
        </>
    );
};

export default Root;