import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, TrendingUp, Users, CheckCircle, ArrowRight, Building2, Wallet } from 'lucide-react';

const OwnerLanding = () => {
    return (
        <div className="min-h-screen bg-white font-montserrat pt-20">

            {/* Hero Section */}
            <div className="relative bg-indigo-900 text-white overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=1920')] bg-cover bg-center opacity-10"></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 flex flex-col md:flex-row items-center gap-12">
                    <div className="w-full md:w-1/2 space-y-6">
                        <span className="inline-block py-1 px-3 rounded-full bg-indigo-800 text-indigo-200 text-sm font-semibold border border-indigo-700">
                            For Property Owners
                        </span>
                        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
                            Unlock the True Value of Your <span className="text-teal-400">Property</span>
                        </h1>
                        <p className="text-lg text-indigo-100 max-w-lg leading-relaxed">
                            Join thousands of owners who trust RoomGi to find verified student tenants without the hassle of brokerage.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <Link
                                to="/owner-dashboard"
                                className="px-8 py-4 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-xl shadow-lg shadow-teal-500/20 transition-all flex items-center justify-center gap-2 text-lg"
                            >
                                List Your Property <ArrowRight size={20} />
                            </Link>
                            <button className="px-8 py-4 bg-transparent border border-indigo-400 text-white font-semibold rounded-xl hover:bg-white/10 transition-all">
                                Learn More
                            </button>
                        </div>
                        <p className="text-sm text-indigo-300 pt-2 flex items-center gap-2">
                            <CheckCircle size={16} /> No credit card required • Free listing for first 30 days
                        </p>
                    </div>

                    {/* Hero Form / Card */}
                    <div className="w-full md:w-1/2 flex justify-center md:justify-end">
                        <div className="bg-white text-gray-900 p-8 rounded-3xl shadow-2xl max-w-md w-full relative">
                            <div className="absolute -top-10 -right-10 bg-yellow-400 p-4 rounded-full shadow-lg hidden md:block">
                                <span className="font-bold text-xs uppercase tracking-wider block text-center">Zero</span>
                                <span className="font-black text-xl block text-center">Brokerage</span>
                            </div>

                            <h3 className="text-2xl font-bold mb-6">Estimate your earnings</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Property Location</label>
                                    <select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none">
                                        <option>Koramangala, Bangalore</option>
                                        <option>HSR Layout, Bangalore</option>
                                        <option>Indiranagar, Bangalore</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Room Type</label>
                                    <select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none">
                                        <option>2 BHK Flat</option>
                                        <option>Single Room PG</option>
                                        <option>Double Sharing PG</option>
                                    </select>
                                </div>
                                <div className="pt-4 pb-2">
                                    <p className="text-sm text-gray-500">Projected Monthly Earning</p>
                                    <p className="text-4xl font-extrabold text-indigo-600">₹25,000<span className="text-lg text-gray-400 font-medium">/mo</span></p>
                                </div>
                                <Link to="/owner-dashboard" className="block w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-center rounded-xl transition-all">
                                    Start Earning Today
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="bg-gray-50 py-12 border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div>
                            <p className="text-3xl font-extrabold text-indigo-600 mb-1">10k+</p>
                            <p className="text-sm text-gray-600 font-medium">Verified Students</p>
                        </div>
                        <div>
                            <p className="text-3xl font-extrabold text-indigo-600 mb-1">500+</p>
                            <p className="text-sm text-gray-600 font-medium">Active Properties</p>
                        </div>
                        <div>
                            <p className="text-3xl font-extrabold text-indigo-600 mb-1">98%</p>
                            <p className="text-sm text-gray-600 font-medium">Occupancy Rate</p>
                        </div>
                        <div>
                            <p className="text-3xl font-extrabold text-indigo-600 mb-1">₹5Cr+</p>
                            <p className="text-sm text-gray-600 font-medium">Rent Generated</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Why Choose Us */}
            <div className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <span className="text-indigo-600 font-bold uppercase tracking-wider text-sm">Why Partner With Us</span>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">Simple, Secure, and Profitable</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {/* Feature 1 */}
                    <div className="p-8 rounded-3xl bg-white border border-gray-100 shadow-xl hover:-translate-y-2 transition-transform duration-300">
                        <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                            <ShieldCheck size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Verified Tenants Only</h3>
                        <p className="text-gray-600 leading-relaxed">
                            We perform background checks on every student and professional, ensuring your property is in safe hands.
                        </p>
                    </div>

                    {/* Feature 2 */}
                    <div className="p-8 rounded-3xl bg-white border border-gray-100 shadow-xl hover:-translate-y-2 transition-transform duration-300">
                        <div className="w-14 h-14 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mb-6">
                            <Wallet size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Guaranteed Payments</h3>
                        <p className="text-gray-600 leading-relaxed">
                            Receive rent on the 1st of every month. Our automated payment system ensures you never have to chase dues.
                        </p>
                    </div>

                    {/* Feature 3 */}
                    <div className="p-8 rounded-3xl bg-white border border-gray-100 shadow-xl hover:-translate-y-2 transition-transform duration-300">
                        <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-6">
                            <TrendingUp size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Maximize Occupancy</h3>
                        <p className="text-gray-600 leading-relaxed">
                            Our AI-driven matching algorithm puts your property in front of the right tenants, reducing vacancy periods.
                        </p>
                    </div>
                </div>
            </div>

            {/* How it Works */}
            <div className="bg-indigo-50 py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row items-center gap-16">
                        <div className="w-full md:w-1/2">
                            <img
                                src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=1000"
                                alt="Meeting"
                                className="rounded-3xl shadow-2xl"
                            />
                        </div>
                        <div className="w-full md:w-1/2">
                            <span className="text-indigo-600 font-bold uppercase tracking-wider text-sm">How It Works</span>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-8">List your property in 3 easy steps</h2>

                            <div className="space-y-8">
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-full bg-white border-2 border-indigo-600 text-indigo-600 flex items-center justify-center font-bold text-lg shrink-0">1</div>
                                    <div>
                                        <h4 className="text-lg font-bold text-gray-900 mb-1">Add Property Details</h4>
                                        <p className="text-gray-600">Enter basic details like location, room type, and amenities. It takes less than 5 minutes.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-full bg-white border-2 border-indigo-600 text-indigo-600 flex items-center justify-center font-bold text-lg shrink-0">2</div>
                                    <div>
                                        <h4 className="text-lg font-bold text-gray-900 mb-1">Get Verified</h4>
                                        <p className="text-gray-600">Upload your RERA ID or Electricity bill. Our team verifies it within 24 hours.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-full bg-white border-2 border-indigo-600 text-indigo-600 flex items-center justify-center font-bold text-lg shrink-0">3</div>
                                    <div>
                                        <h4 className="text-lg font-bold text-gray-900 mb-1">Start Earning</h4>
                                        <p className="text-gray-600">Your listing goes live to thousands of students. Accept enquiries and start rented.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-10">
                                <Link
                                    to="/owner-dashboard"
                                    className="inline-block px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg transition-all"
                                >
                                    Become a Host Now
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default OwnerLanding;
