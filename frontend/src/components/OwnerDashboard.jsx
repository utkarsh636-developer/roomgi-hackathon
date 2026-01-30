import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    LayoutDashboard, Plus, Home, MessageSquare,
    TrendingUp, Eye, Users, AlertCircle, CheckCircle,
    MoreVertical, MapPin, Edit, Trash2, X, Clock, ShieldCheck
} from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';
import authService from '../services/authService';
import propertyService from '../services/propertyService';
import EnquiryList from './owner/EnquiryList';

const OwnerDashboard = () => {
    const [properties, setProperties] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [propertyToDelete, setPropertyToDelete] = useState(null);
    const [activeTab, setActiveTab] = useState('properties');

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const [propsRes, userRes] = await Promise.all([
                    propertyService.getOwnerProperties(),
                    authService.fetchCurrentUser()
                ]);
                setProperties(propsRes.data || []);
                // Unwrap the user data from the API response
                setUser(userRes.data || null);
            } catch (err) {
                console.error("Failed to fetch dashboard data:", err);
                setError("Failed to load dashboard data.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleDeleteClick = (id) => {
        setPropertyToDelete(id);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!propertyToDelete) return;

        try {
            await propertyService.deleteProperty(propertyToDelete);
            setProperties(prev => prev.filter(p => p._id !== propertyToDelete));
            setShowDeleteModal(false);
            setPropertyToDelete(null);
        } catch (err) {
            console.error("Failed to delete property:", err);
            alert("Failed to delete property. Please try again.");
        }
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
        setPropertyToDelete(null);
    };

    // Mock Data for Stats (Keep these until backend provides stats endpoint)
    const stats = [
        { label: 'Total Views', value: '1,240', change: '+12%', icon: Eye, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Active Enquiries', value: '18', change: '+4', icon: MessageSquare, color: 'text-purple-600', bg: 'bg-purple-50' },
        { label: 'Shortlisted', value: '45', change: '+8%', icon: Users, color: 'text-brand-primary', bg: 'bg-brand-bg' },
        { label: 'Total Earnings', value: '₹25k', change: 'June', icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
    ];



    return (
        <div className="min-h-screen bg-brand-bg font-montserrat flex flex-col">
            <Navbar />

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl transform scale-100 transition-all">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-gray-900">Delete Property</h3>
                            <button onClick={cancelDelete} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="mb-6">
                            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4 text-red-600">
                                <Trash2 size={24} />
                            </div>
                            <p className="text-gray-600">
                                Are you sure you want to delete this property? This action cannot be undone and all associated data will be removed.
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={cancelDelete}
                                className="flex-1 py-3 px-4 border border-gray-200 rounded-xl font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="flex-1 py-3 px-4 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <main className="flex-grow pt-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3">
                                Owner Dashboard
                                {user?.verification?.status === 'approved' && (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold bg-green-100 text-green-700 border border-green-200">
                                        <CheckCircle size={16} /> Verified
                                    </span>
                                )}
                            </h1>
                            <p className="text-gray-500">Manage your listings and track performance.</p>
                        </div>
                        <Link
                            to="/add-property"
                            className="flex items-center gap-2 px-6 py-3 bg-brand-primary hover:bg-brand-secondary text-white font-bold rounded-xl shadow-lg shadow-brand-dark/20 transition-all"
                        >
                            <Plus size={20} /> Add New Property
                        </Link>
                    </div>

                    {/* Verification Alert - Dynamic Logic */}
                    {(() => {
                        const status = user?.verification?.status;
                        const rejectionReason = user?.verification?.rejectionReason;

                        if (status === 'rejected') {
                            return (
                                <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-8 flex items-start gap-4">
                                    <AlertCircle className="text-red-600 shrink-0 mt-1" />
                                    <div>
                                        <h3 className="font-bold text-red-800">Identity Verification Rejected</h3>
                                        <p className="text-sm text-red-700 mt-1">
                                            Your identity verification was rejected.
                                            <span className="block mt-1">Reason: {rejectionReason || "Documents invalid or unclear."}</span>
                                            <Link to="/verification" className="font-bold underline cursor-pointer mt-2 inline-block">Re-upload Identity Documents</Link>
                                        </p>
                                    </div>
                                </div>
                            );
                        }

                        if (!status || status === 'unverified') {
                            return (
                                <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 mb-8 flex items-start gap-4">
                                    <AlertCircle className="text-orange-600 shrink-0 mt-1" />
                                    <div>
                                        <h3 className="font-bold text-orange-800">Complete your verification</h3>
                                        <p className="text-sm text-orange-700 mt-1">
                                            Please verify your identity to build trust with tenants.
                                            <Link to="/verification" className="font-bold underline cursor-pointer ml-1">Upload Identity Documents</Link>
                                        </p>
                                    </div>
                                </div>
                            );
                        }

                        if (status === 'approved') {
                            return (
                                <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-8 flex items-start gap-4">
                                    <CheckCircle className="text-green-600 shrink-0 mt-1" />
                                    <div>
                                        <h3 className="font-bold text-green-800">Identity Verified</h3>
                                        <p className="text-sm text-green-700 mt-1">
                                            Your identity has been verified. You can now list properties and interact with tenants freely.
                                        </p>
                                    </div>
                                </div>
                            );
                        }

                        if (status === 'pending') {
                            return (
                                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-8 flex items-start gap-4">
                                    <Clock className="text-blue-600 shrink-0 mt-1" />
                                    <div>
                                        <h3 className="font-bold text-blue-800">Identity Verification Under Scrutiny</h3>
                                        <p className="text-sm text-blue-700 mt-1">
                                            Your identity documents have been submitted and are currently under scrutiny. This usually takes 24-48 hours.
                                        </p>
                                    </div>
                                </div>
                            );
                        }

                        return null;
                    })()}

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

                    {/* Content Tabs */}
                    <div className="flex gap-4 mb-6 border-b border-gray-200">
                        <button
                            onClick={() => setActiveTab('properties')}
                            className={`pb-3 px-4 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'properties'
                                    ? 'border-brand-primary text-brand-primary'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <Home size={18} /> My Properties <span className="px-2 py-0.5 rounded-full bg-gray-100 text-xs">{properties.length}</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('enquiries')}
                            className={`pb-3 px-4 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'enquiries'
                                    ? 'border-brand-primary text-brand-primary'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <MessageSquare size={18} /> Enquiries
                        </button>
                    </div>

                    {/* Tab Content */}
                    {activeTab === 'properties' ? (
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                    <Home size={20} className="text-brand-primary" /> My Listings
                                </h3>
                                <div className="text-sm text-gray-500">
                                    Showing {properties.length} listings
                                </div>
                            </div>

                            <div className="divide-y divide-gray-100">
                                {properties.length > 0 ? properties.map((property) => (
                                    <div key={property._id} className="p-6 hover:bg-gray-50 transition-colors group">
                                        <div className="flex flex-col md:flex-row gap-6 items-center">
                                            <div className="w-full md:w-48 h-32 rounded-xl overflow-hidden shadow-sm">
                                                <img
                                                    src={property.images?.[0]?.url || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=800'}
                                                    alt={property.type}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            </div>

                                            <div className="flex-1 w-full text-center md:text-left">
                                                <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2 justify-center md:justify-start">
                                                    <h4 className="text-lg font-bold text-gray-900 capitalize">{property.title || property.name || `${property.type} in ${property.location?.city}`}</h4>
                                                    {property.verification?.status === 'approved' ? (
                                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200">
                                                            <CheckCircle size={12} /> Verified
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-100 text-orange-700 border border-orange-200 uppercase">
                                                            <AlertCircle size={12} /> {property.verification?.status || 'Pending'}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2 text-gray-500 text-sm justify-center md:justify-start mb-4 md:mb-0">
                                                    <MapPin size={16} /> {property.location?.addressLine}, {property.location?.city}
                                                </div>
                                            </div>

                                            <div className="flex gap-8 text-center md:text-left">
                                                <div>
                                                    <p className="text-xs text-gray-400 font-bold uppercase">Rent</p>
                                                    <p className="font-bold text-gray-900">₹{property.rent?.toLocaleString()}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-400 font-bold uppercase">Views</p>
                                                    <p className="font-bold text-gray-900">{property.views || 0}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-400 font-bold uppercase">Status</p>
                                                    <p className={`font-bold ${property.status === 'available' ? 'text-green-600' : 'text-red-600'} capitalize`}>
                                                        {property.status}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex gap-2 w-full md:w-auto mt-4 md:mt-0">
                                                <Link
                                                    to={`/edit-property/${property._id}`}
                                                    className="flex-1 md:flex-none px-4 py-2 border border-brand-secondary/20 rounded-lg text-brand-secondary font-bold hover:bg-brand-bg hover:text-brand-primary transition-colors flex items-center justify-center gap-2"
                                                >
                                                    <Edit size={16} /> Edit
                                                </Link>
                                                <button
                                                    onClick={() => handleDeleteClick(property._id)}
                                                    className="p-2 border border-gray-200 rounded-lg text-gray-400 hover:text-red-500 hover:border-red-200 transition-colors"
                                                >
                                                    <Trash2 size={20} />
                                                </button>
                                                {property.verification?.status !== 'approved' && (
                                                    (property.verification?.status === 'pending' && property.documents?.length > 0) ? (
                                                        <div className="flex-1 md:flex-none px-4 py-2 bg-blue-50 text-blue-600 font-bold rounded-lg border border-blue-200 flex items-center justify-center gap-2">
                                                            <Clock size={16} /> Under Review
                                                        </div>
                                                    ) : (
                                                        <Link
                                                            to={`/property/${property._id}/verify`}
                                                            className={`flex-1 md:flex-none px-4 py-2 ${property.verification?.status === 'rejected' ? 'bg-red-600 hover:bg-red-700' : 'bg-brand-primary hover:bg-brand-secondary'} text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2`}
                                                        >
                                                            <ShieldCheck size={16} /> {property.verification?.status === 'rejected' ? 'Re-Verify' : 'Verify'}
                                                        </Link>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="p-12 text-center text-gray-500">
                                        You haven't listed any properties yet.
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <EnquiryList />
                    )}

                </div>
            </main>

            <Footer />
        </div>
    );
};

export default OwnerDashboard;
