// pages/AboutPage.jsx
import { FaTint, FaUserFriends, FaHeartbeat, FaHandsHelping } from 'react-icons/fa';
import { Fade } from 'react-awesome-reveal';
import { Helmet } from 'react-helmet-async';

const teamsData = [
    {
        name: "Hurayra Khan",
        role: "Founder & CEO",
        email: "hurayra@buybulk.com",
        address: "Dhaka, Bangladesh",
        image:
            "https://i.ibb.co.com/zh641sgL/de248a20-fe13-4e29-a4b9-a6a8244fcdda.jpg",
    },
    {
        name: "Maruf Khan",
        role: "Chief Technology Officer",
        email: "maruf@buybulk.com",
        address: "Chittagong, Bangladesh",
        image:
            "https://i.ibb.co.com/m5NNCL9T/1715741617155.jpg",
    },
    {
        name: "Jhankar Mahbub",
        role: "Senior Advisor",
        email: "jhankar@buybulk.com",
        address: "New York, USA",
        image:
            "https://i.ibb.co.com/BK4wZ0qn/467444869-10160351769061891-3964624160658220491-n.jpg",
    },
];

export default function AboutPage() {
    return (
        <div className="py-16 px-4 max-w-7xl mx-auto">

            <Helmet>
                <title>Blood.net | About Us</title>
                <meta name="description" content="Learn more about Blood.net, our mission, and the impact we're making through voluntary blood donations." />
            </Helmet>

            {/* Heading */}
            <Fade cascade damping={0.1}>
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-[#E63946] mb-4">About Blood.net</h1>
                    <p className="text-gray-700 max-w-2xl mx-auto">
                        Blood.net is a life-saving platform dedicated to connecting donors and seekers through technology, transparency, and compassion. We believe that no one should die due to lack of blood.
                    </p>
                </div>
            </Fade>

            {/* Mission, Vision, Values */}
            <div className="grid md:grid-cols-3 gap-8 text-center">
                <Fade direction="up" cascade damping={0.1}>
                    <div className="p-6 bg-white rounded-xl shadow hover:shadow-xl transition-all">
                        <FaHandsHelping className="text-4xl text-[#E63946] mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Our Mission</h3>
                        <p className="text-gray-600 text-sm">
                            To save lives by building a reliable, accessible, and inclusive platform for blood donation and distribution.
                        </p>
                    </div>

                    <div className="p-6 bg-white rounded-xl shadow hover:shadow-xl transition-all">
                        <FaHeartbeat className="text-4xl text-[#E63946] mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Our Vision</h3>
                        <p className="text-gray-600 text-sm">
                            A world where timely blood is never out of reach for anyone in need.
                        </p>
                    </div>

                    <div className="p-6 bg-white rounded-xl shadow hover:shadow-xl transition-all">
                        <FaUserFriends className="text-4xl text-[#E63946] mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Our Values</h3>
                        <p className="text-gray-600 text-sm">
                            Compassion, transparency, community, and innovation in every action we take.
                        </p>
                    </div>
                </Fade>
            </div>

            {/* Stats Section (Optional) */}
            <div className="mt-16">
                <Fade cascade>
                    <h2 className="text-3xl font-bold text-center text-[#E63946] mb-6">Why Blood.net?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
                        <div className="bg-gradient-to-br from-pink-100 to-red-100 p-6 rounded-xl shadow">
                            <FaTint className="text-3xl text-[#E63946] mx-auto mb-2" />
                            <h3 className="text-xl font-bold text-gray-800">50,000+</h3>
                            <p className="text-sm text-gray-600">Blood Units Donated</p>
                        </div>
                        <div className="bg-gradient-to-br from-blue-100 to-purple-100 p-6 rounded-xl shadow">
                            <FaUserFriends className="text-3xl text-[#E63946] mx-auto mb-2" />
                            <h3 className="text-xl font-bold text-gray-800">30,000+</h3>
                            <p className="text-sm text-gray-600">Registered Donors</p>
                        </div>
                        <div className="bg-gradient-to-br from-green-100 to-teal-100 p-6 rounded-xl shadow">
                            <FaHeartbeat className="text-3xl text-[#E63946] mx-auto mb-2" />
                            <h3 className="text-xl font-bold text-gray-800">20,000+</h3>
                            <p className="text-sm text-gray-600">Lives Saved</p>
                        </div>
                        <div className="bg-gradient-to-br from-yellow-100 to-orange-100 p-6 rounded-xl shadow">
                            <FaHandsHelping className="text-3xl text-[#E63946] mx-auto mb-2" />
                            <h3 className="text-xl font-bold text-gray-800">200+</h3>
                            <p className="text-sm text-gray-600">Partner Organizations</p>
                        </div>
                    </div>
                </Fade>
            </div>
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <Fade cascade>
                        <h2 className="text-4xl font-bold text-[#E63946] mb-4">Meet Our Team</h2>
                        <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
                            The hearts behind Blood.net. We’re passionate about saving lives and making a difference every day.
                        </p>
                    </Fade>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                        {teamsData.map((member, i) => (
                            <Fade key={i} delay={i * 100}>
                                <div className="bg-[#FFF8F8] rounded-xl p-6 shadow hover:shadow-xl transition">
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        className="w-28 h-28 mx-auto rounded-full object-cover mb-4 border-4 border-[#E63946]"
                                    />
                                    <h3 className="text-xl font-bold text-gray-800">{member.name}</h3>
                                    <p className="text-sm text-[#E63946] font-semibold">{member.role}</p>
                                    <p className="text-sm text-gray-600 mt-2">{member.email}</p>
                                    <p className="text-sm text-gray-500">{member.address}</p>
                                </div>
                            </Fade>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}

