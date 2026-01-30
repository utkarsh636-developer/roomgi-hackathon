import React from 'react';
import { Link } from 'react-router-dom'; // Assuming react-router-dom is used
import { ShieldCheck, UserCheck, Lock, CheckCircle, XCircle, ArrowRight, Star } from 'lucide-react';

const WhyRoomGi = () => {
    return (
        <div className="min-h-screen bg-brand-bg font-montserrat overflow-x-hidden">


            {/* The Problem vs Solution Section */}
            <section className="py-24 px-6 lg:px-12 bg-white relative">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mb-4">Why the Old Way fails</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">Traditional rental platforms are flooded with issues. We fixed them.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        {/* The Old Way */}
                        <div className="bg-red-50 rounded-3xl p-8 border border-red-100 relative group hover:shadow-xl transition-all duration-300">
                            <div className="absolute -top-6 left-8 bg-red-500 text-white px-4 py-2 rounded-lg font-bold shadow-lg transform -rotate-2 group-hover:rotate-0 transition-transform">
                                Other Platforms
                            </div>
                            <ul className="space-y-6 mt-4">
                                <li className="flex items-start gap-4">
                                    <div className="bg-red-100 p-2 rounded-full text-red-600 mt-1">
                                        <XCircle size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 text-lg">Unverified Owners</h4>
                                        <p className="text-gray-600">Anyone can post. You never know who you're talking to.</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-4">
                                    <div className="bg-red-100 p-2 rounded-full text-red-600 mt-1">
                                        <XCircle size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 text-lg">Fake Photos</h4>
                                        <p className="text-gray-600">Wide-angle lenses and old photos that don't match reality.</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-4">
                                    <div className="bg-red-100 p-2 rounded-full text-red-600 mt-1">
                                        <XCircle size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 text-lg">Hidden Fees</h4>
                                        <p className="text-gray-600">Brokerage fees and surprise charges upon visiting.</p>
                                    </div>
                                </li>
                            </ul>
                        </div>

                        {/* The RoomGi Way */}
                        <div className="bg-brand-bg rounded-3xl p-8 border border-brand-primary/20 relative group hover:shadow-2xl hover:shadow-brand-primary/10 transition-all duration-300 transform md:scale-105 z-10">
                            <div className="absolute -top-6 right-8 bg-brand-primary text-white px-4 py-2 rounded-lg font-bold shadow-lg transform rotate-2 group-hover:rotate-0 transition-transform flex items-center gap-2">
                                <CheckCircle size={18} /> RoomGi
                            </div>
                            <ul className="space-y-6 mt-4">
                                <li className="flex items-start gap-4">
                                    <div className="bg-brand-primary/10 p-2 rounded-full text-brand-primary mt-1">
                                        <UserCheck size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white text-lg">100% Verified Owners</h4>
                                        <p className="text-gray-400">Strict ID and property document verification for every lister.</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-4">
                                    <div className="bg-brand-primary/10 p-2 rounded-full text-brand-primary mt-1">
                                        <CheckCircle size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white text-lg">Authentic Listings</h4>
                                        <p className="text-gray-400">Verified locations and recent photos. What you see is what you get.</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-4">
                                    <div className="bg-brand-primary/10 p-2 rounded-full text-brand-primary mt-1">
                                        <Lock size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white text-lg">Zero Brokerage</h4>
                                        <p className="text-gray-400">Connect directly with owners. No middlemen, no extra costs.</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Feature Highlights */}
            <section className="py-24 px-6 lg:px-12 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="p-8 rounded-3xl bg-gray-50 hover:bg-white border border-gray-100 hover:border-brand-primary/20 hover:shadow-xl transition-all duration-300 group">
                            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <ShieldCheck size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-brand-dark mb-3">Bank-Grade Security</h3>
                            <p className="text-gray-600">Your data is encrypted. Our verification process uses advanced checks to ensure safety.</p>
                        </div>
                        <div className="p-8 rounded-3xl bg-gray-50 hover:bg-white border border-gray-100 hover:border-brand-primary/20 hover:shadow-xl transition-all duration-300 group">
                            <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Star size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-brand-dark mb-3">Community Reviews</h3>
                            <p className="text-gray-600">Read real reviews from previous tenants. Transparent feedback for every property.</p>
                        </div>
                        <div className="p-8 rounded-3xl bg-gray-50 hover:bg-white border border-gray-100 hover:border-brand-primary/20 hover:shadow-xl transition-all duration-300 group">
                            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <UserCheck size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-brand-dark mb-3">Direct Support</h3>
                            <p className="text-gray-600">Our support team is here for you. We mediate disputes and ensure guidelines are followed.</p>
                        </div>
                    </div>
                </div>
            </section>


        </div>
    );
};

export default WhyRoomGi;
