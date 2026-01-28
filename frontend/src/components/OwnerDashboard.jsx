import React from 'react';
import { Link } from 'react-router-dom';
import {
    LayoutDashboard, Plus, Home, MessageSquare,
    TrendingUp, Eye, Users, AlertCircle, CheckCircle,
    MoreVertical, MapPin
} from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';

const OwnerDashboard = () => {
    // Mock Data
    const stats = [
        { label: 'Total Views', value: '1,240', change: '+12%', icon: Eye, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Active Enquiries', value: '18', change: '+4', icon: MessageSquare, color: 'text-purple-600', bg: 'bg-purple-50' },
        { label: 'Shortlisted', value: '45', change: '+8%', icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        { label: 'Total Earnings', value: '₹25k', change: 'June', icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
    ];

    const properties = [
        {
            id: 1,
            name: 'Sunshine Premium Stays',
            location: 'Koramangala 4th Block',
            price: 12000,
            status: 'Active',
            views: 450,
            enquiries: 8,
            image: '/images/landing-page2-upscaled.jpg'
        },
        {
            id: 2,
            name: 'Green View Apartments',
            location: 'HSR Layout, Sector 2',
            price: 18000,
            status: 'Pending Verification',
            views: 12,
            enquiries: 0,
            image: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&q=80&w=800'
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 font-montserrat flex flex-col">
            <Navbar />

            <main className="flex-grow pt-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Owner Dashboard</h1>
                            <p className="text-gray-500">Manage your listings and track performance.</p>
                        </div>
                        <Link
                            to="/add-property"
                            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 transition-all"
                        >
                            <Plus size={20} /> Add New Property
                        </Link>
                    </div>

                    {/* Verification Alert (Mock) */}
                    <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 mb-8 flex items-start gap-4">
                        <AlertCircle className="text-orange-600 shrink-0 mt-1" />
                        <div>
                            <h3 className="font-bold text-orange-800">Complete your verification</h3>
                            <p className="text-sm text-orange-700 mt-1">
                                Your "Green View Apartments" listing is hidden until you complete KYC.
                                <span className="font-bold underline cursor-pointer ml-1">Upload Documents</span>
                            </p>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                        {stats.map((stat, idx) => (
                            <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${stat.bg} ${stat.color}`}>
                                    <stat.icon size={24} />
                                </div>
                                <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
                                <div className="flex items-baseline gap-2 mt-1">
                                    <h4 className="text-2xl font-bold text-gray-900">{stat.value}</h4>
                                    <span className="text-xs font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">{stat.change}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* My Properties */}
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <Home size={20} className="text-indigo-600" /> My Properties
                            </h3>
                            <div className="text-sm text-gray-500">
                                Showing {properties.length} listings
                            </div>
                        </div>

                        <div className="divide-y divide-gray-100">
                            {properties.map((property) => (
                                <div key={property.id} className="p-6 hover:bg-gray-50 transition-colors group">
                                    <div className="flex flex-col md:flex-row gap-6 items-center">
                                        <div className="w-full md:w-48 h-32 rounded-xl overflow-hidden shadow-sm">
                                            <img src={property.image} alt={property.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        </div>

                                        <div className="flex-1 w-full text-center md:text-left">
                                            <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2 justify-center md:justify-start">
                                                <h4 className="text-lg font-bold text-gray-900">{property.name}</h4>
                                                {property.status === 'Active' ? (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200">
                                                        <CheckCircle size={12} /> Active
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-100 text-orange-700 border border-orange-200">
                                                        <AlertCircle size={12} /> In Review
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-500 text-sm justify-center md:justify-start mb-4 md:mb-0">
                                                <MapPin size={16} /> {property.location}
                                            </div>
                                        </div>

                                        <div className="flex gap-8 text-center md:text-left">
                                            <div>
                                                <p className="text-xs text-gray-400 font-bold uppercase">Price</p>
                                                <p className="font-bold text-gray-900">₹{property.price.toLocaleString()}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-400 font-bold uppercase">Views</p>
                                                <p className="font-bold text-gray-900">{property.views}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-400 font-bold uppercase">Leads</p>
                                                <p className="font-bold text-indigo-600">{property.enquiries}</p>
                                            </div>
                                        </div>

                                        <div className="flex gap-2 w-full md:w-auto mt-4 md:mt-0">
                                            <button className="flex-1 md:flex-none px-4 py-2 border border-gray-200 rounded-lg text-gray-600 font-bold hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
                                                Edit
                                            </button>
                                            <button className="p-2 border border-gray-200 rounded-lg text-gray-400 hover:text-red-500 hover:border-red-200 transition-colors">
                                                <MoreVertical size={20} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    );
};

export default OwnerDashboard;
