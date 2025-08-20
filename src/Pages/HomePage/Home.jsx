import React from 'react';
import FundingCTA from '../../Components/FundingCTA';
import RecentDonationRequests from '../../Components/RecentDonationRequests';
import StatisticsSection from '../../Components/StatisticsSection';
import OrganizationsSection from '../../Components/OrganizationsSection';
import Banner from '../../Components/Banner/Banner';
import Footer from '../../Components/Footer';
import ContactSection from '../../Components/ContactSection';
import { Helmet } from 'react-helmet-async';
import RecentBlogs from '../../Components/RecentBlogs';
import EmergencyHelpline from '../../Components/EmergencyHelpline';

const Home = () => {
  return (
    <div>
      <Helmet>
        <title>Blood.net | Save Lives Through Blood Donation</title>
        <meta name="description" content="Join Blood.net to search donors, request donations, and contribute to saving lives." />
      </Helmet>

      <Banner></Banner>
      <RecentDonationRequests></RecentDonationRequests>
      <OrganizationsSection></OrganizationsSection>
      <RecentBlogs></RecentBlogs>
      <FundingCTA></FundingCTA>
      <StatisticsSection></StatisticsSection>
      <ContactSection></ContactSection>
      <EmergencyHelpline></EmergencyHelpline>
    </div>
  );
};

export default Home;