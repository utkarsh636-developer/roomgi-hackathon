import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { ShieldCheck, Search, Users, AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react';

const AboutPage = () => {
    return (
        <div className="flex flex-col min-h-screen bg-brand-bg font-montserrat">
            <Navbar />

            {/* Hero Section */}
            <div className="bg-brand-dark pt-32 pb-20 px-6 sm:px-12 text-center text-white relative overflow-hidden">
                <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-brand-primary/10 rounded-full blur-[100px] pointer-events-none"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[300px] h-[300px] bg-brand-secondary/10 rounded-full blur-[80px] pointer-events-none"></div>

                <h1 className="text-4xl md:text-6xl font-extrabold mb-6 relative z-10">
                    Revolutionizing <span className="text-brand-primary">Student Housing</span>
                </h1>
                <p className="text-lg md:text-xl text-brand-bg/70 max-w-2xl mx-auto leading-relaxed relative z-10">
                    We're bridging the gap between students and their perfect home away from home with trust, transparency, and technology.
                </p>
            </div>

            {/* The Problem Section */}
            <div className="py-20 px-6 sm:px-12 max-w-7xl mx-auto">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="order-2 md:order-1">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-bold mb-6">
                            <AlertTriangle size={18} />
                            The Problem
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                            Finding a safe rental shouldn't be a struggle.
                        </h2>
                        <p className="text-gray-600 text-lg leading-relaxed mb-6">
                            Students and working professionals constantly face difficulties in finding verified rental rooms, PGs, and hostels.
                        </p>
                        <ul className="space-y-4">
                            {[
                                "Scattered and unorganized listings across multiple platforms",
                                "Fake information and outdated photos",
                                "Lack of transparency in pricing and amenities",
                                "No reliable way to verify owners before visiting"
                            ].map((item, idx) => (
                                <li key={idx} className="flex items-start gap-3">
                                    <div className="p-1 bg-red-50 text-red-500 rounded-full mt-1">
                                        <AlertTriangle size={16} />
                                    </div>
                                    <span className="text-gray-700">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="order-1 md:order-2 relative flex justify-center">
                        {/* "Search Failed" UI Card */}
                        <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 max-w-sm w-full transform rotate-3 hover:rotate-0 transition-transform duration-300">
                            <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-4">
                                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                                <div className="flex-1 bg-gray-100 rounded-full h-2 ml-2"></div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex gap-4">
                                    <div className="w-20 h-20 bg-gray-200 rounded-lg shrink-0"></div>
                                    <div className="space-y-2 w-full">
                                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                        <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                                        <div className="inline-block px-2 py-1 bg-red-50 text-red-500 text-xs font-bold rounded">
                                            UNVERIFIED
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4 bg-red-50 rounded-xl border border-red-100 text-center">
                                    <AlertTriangle className="mx-auto text-red-500 mb-2" size={24} />
                                    <p className="text-red-700 font-bold text-sm">Listing Suspended</p>
                                    <p className="text-red-500 text-xs mt-1">Reports of fake images detected.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* The Solution Section */}
            <div className="bg-white py-20 px-6 sm:px-12">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-bold mb-4">
                            <CheckCircle size={18} />
                            Our Solution
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                            A Smarter Way to Rent
                        </h2>
                        <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
                            RoomGi is a complete multi-page responsive platform designed to solve these challenges head-on.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: ShieldCheck,
                                color: "text-brand-primary",
                                bg: "bg-brand-primary/10",
                                title: "Comprehensive Verification",
                                desc: "Admins strictly verify both Owners and Tenants. All necessary actions are handled centrally to ensure a safe, fraud-free community."
                            },
                            {
                                icon: Search,
                                color: "text-blue-600",
                                bg: "bg-blue-50",
                                title: "Smart Search",
                                desc: "Filter by location, exact budget, amenities, and availability to find your perfect match in seconds."
                            },
                            {
                                icon: Users,
                                color: "text-purple-600",
                                bg: "bg-purple-50",
                                title: "Community Driven",
                                desc: "Real reviews from past tenants and a transparent community that holds owners accountable."
                            }
                        ].map((feature, idx) => (
                            <div key={idx} className="p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all bg-white group">
                                <div className={`w-14 h-14 ${feature.bg} ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                    <feature.icon size={28} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                                <p className="text-gray-500 leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA Section - Modern Split Layout */}
            <div className="py-20 px-6 sm:px-12">
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center bg-brand-primary/5 rounded-[3rem] p-10 md:p-16 border border-brand-primary/10 overflow-hidden relative">

                    {/* Left: Typography */}
                    <div className="relative z-10 text-left">
                        <h2 className="text-4xl md:text-6xl font-black text-gray-900 leading-tight mb-6">
                            Ready to find <br />
                            <span className="text-brand-primary">your new home?</span>
                        </h2>
                        <p className="text-gray-600 text-lg mb-8 max-w-md">
                            Join thousands of students who have found safe, affordable, and verified stays with RoomGi.
                        </p>
                        <div className="flex items-center gap-4">
                            <div className="flex -space-x-3">
                                <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-200"></div>
                                <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-300"></div>
                                <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-400"></div>
                                <div className="w-10 h-10 rounded-full border-2 border-white bg-brand-primary text-white flex items-center justify-center text-xs font-bold">+2k</div>
                            </div>
                            <span className="text-sm font-semibold text-gray-500">Students joined this week</span>
                        </div>
                    </div>

                    {/* Right: Action Card */}
                    <div className="relative z-10 flex justify-center md:justify-end">
                        <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 max-w-sm w-full transform rotate-2 hover:rotate-0 transition-all duration-500 group">
                            <div className="w-16 h-16 bg-brand-primary/10 text-brand-primary rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Search size={32} />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Start Exploring</h3>
                            <p className="text-gray-500 mb-6">Browse 10,000+ verified listings in your desired location.</p>
                            <Link to="/explore">
                                <button className="w-full py-4 bg-brand-dark text-white font-bold rounded-xl hover:bg-black transition-all flex items-center justify-center gap-2">
                                    Search Now <ArrowRight size={20} />
                                </button>
                            </Link>
                        </div>
                    </div>

                    {/* Decorative Blobs */}
                    <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-primary/10 rounded-full blur-[100px]"></div>
                    <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-brand-secondary/10 rounded-full blur-[100px]"></div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default AboutPage;
