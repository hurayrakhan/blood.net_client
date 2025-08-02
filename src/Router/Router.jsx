import { createBrowserRouter } from "react-router-dom";
import Root from "../Layouts/Root";
import Home from "../Pages/HomePage/Home";
import ErrorPage from "../Pages/ErrorPage/ErrorPage";
import Login from "../Pages/LoginPage/LoginPage";
import Register from "../Pages/RegisterPage/Register";
import PrivateRoute from "./Private/PrivateRouter";
import DashboardLayout from "../Layouts/DashBoard";
import ProfilePage from "../Pages/Dashboard/ProfilePage";
import MyRequests from "../Pages/Dashboard/Donor/MyRequests";
import CreateDonationRequest from "../Pages/Dashboard/Donor/CreateDonationRequest";
import AllUsersPage from "../Pages/Dashboard/Admin/AllUsersPage";
import AllDonationRequestsPage from "../Pages/Dashboard/Admin/AllDonationRequests";
import ContentManagement from "../Pages/Dashboard/Admin/ContentManagement";
import BlogsPage from "../Pages/Blogs/BlogsPage";
import BlogDetails from "../Pages/Blogs/BlogDetails";
import DonorSearchPage from "../Pages/SearchDonor/DonorSearch";
import DonationRequestToDonor from "../Pages/SearchDonor/DonationRequestToDonor";
import IncomingRequests from "../Pages/Dashboard/Donor/IncomingRequests";
import DonorProfilePage from "../Pages/Dashboard/DonorProfilePage/DonorProfilePage";
import FundingPage from "../Pages/Funding/FundingPage";
import FundingHistoryPage from "../Pages/Funding/FundingHistory";
import AllFundingsPage from "../Pages/Dashboard/Admin/AllFundings";
import AboutPage from "../Pages/AboutPage/AboutPage";
import AllRequests from "../Pages/All Requests/AllRequests";
import DashBoard from "../Pages/Dashboard/DashBoard";
import MyProfilePage from "../Pages/Profile/PublicProfile";
import Settings from "../Pages/Settings/Settings";
import AdminOnly from "./Private/AdminsOnly";
import VolunteerAndAdmin from "./Private/VolunteerAndAdmin";
import DonationLog from "../Components/Donationlog";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Root></Root>,
        errorElement: <ErrorPage></ErrorPage>,
        children: [
            {
                path: '/',
                element: <Home></Home>
            },
            {
                path: '/searchDonor',
                element: <DonorSearchPage></DonorSearchPage>
            },
            {
                path: '/donationRequestToDonor/:name',
                element: <PrivateRoute><DonationRequestToDonor></DonationRequestToDonor></PrivateRoute>
            },
            {
                path: '/donor/:id',
                element: <DonorProfilePage></DonorProfilePage>
            },
            {
                path: '/blogs',
                element: <BlogsPage></BlogsPage>
            },
            {
                path: '/blogs/:id',
                element: <BlogDetails></BlogDetails>
            },
            {
                path: '/funding',
                element: <PrivateRoute><FundingPage></FundingPage></PrivateRoute>
            },
            {
                path: '/allRequests',
                element: <AllRequests></AllRequests>
            },
            {
                path: '/about',
                element: <AboutPage></AboutPage>
            },
            {
                path: '/profile/:name',
                element: <PrivateRoute><MyProfilePage></MyProfilePage></PrivateRoute>
            },
            {
                path: '/settings',
                element: <Settings></Settings>
            },
        ]
    },
    {
        path: '/dashboard',
        element: <PrivateRoute><DashboardLayout /></PrivateRoute>,
        children: [
            {
                index: true,
                element: <PrivateRoute><DashBoard></DashBoard></PrivateRoute>
            },
            {
                path: 'profile',
                element: <PrivateRoute><ProfilePage></ProfilePage></PrivateRoute>,
            },
            {
                path: 'myRequests',
                element: <PrivateRoute><MyRequests></MyRequests></PrivateRoute>
            },
            {
                path: 'createRequest',
                element: <PrivateRoute><CreateDonationRequest></CreateDonationRequest></PrivateRoute>
            },
            {
                path: 'allUsers',
                element: <AdminOnly><AllUsersPage></AllUsersPage></AdminOnly>
            },
            {
                path: 'allDonationRequests',
                element: <VolunteerAndAdmin><AllDonationRequestsPage></AllDonationRequestsPage></VolunteerAndAdmin>
            },
            {
                path: 'contentManagement',
                element: <VolunteerAndAdmin><ContentManagement></ContentManagement></VolunteerAndAdmin>
            },
            {
                path: 'incomingRequests',
                element: <PrivateRoute><IncomingRequests></IncomingRequests></PrivateRoute>
            },
            {
                path: 'allFundings',
                element: <VolunteerAndAdmin><AllFundingsPage></AllFundingsPage></VolunteerAndAdmin>
            },
            {
                path: 'fundingHistory',
                element: <PrivateRoute><FundingHistoryPage></FundingHistoryPage></PrivateRoute>
            },
            {
                path: 'donationLog',
                element: <PrivateRoute><DonationLog></DonationLog></PrivateRoute>
            },
            
            
        ],
    },
    {
        path: '/login',
        element: <Login></Login>
    },
    {
        path: '/register',
        element: <Register></Register>
    }
])