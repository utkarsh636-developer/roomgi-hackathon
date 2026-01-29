import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Phone as PhoneIcon, Camera, Save, ShieldCheck, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';
import authService from '../services/authService';
import PropertyCard from './PropertyCard';

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);

    // Form States
    const [username, setUsername] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [profileImage, setProfileImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            const response = await authService.fetchCurrentUser();
            const userData = response.data;
            setUser(userData);
            setUsername(userData.username || '');
            setPhoneNumber(userData.phoneNumber || '');
            setPreviewImage(userData.profileImage);
        } catch (error) {
            console.error("Failed to fetch user data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImage(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);

        try {
            const formData = new FormData();
            formData.append('username', username);
            formData.append('phoneNumber', phoneNumber);
            if (profileImage) {
                formData.append('profileImage', profileImage);
            }

            const response = await authService.updateProfile(formData);
            setUser(response.data);
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
        } catch (error) {
            setMessage({ type: 'error', text: error.message || 'Failed to update profile' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col min-h-screen bg-brand-bg font-montserrat">
                <Navbar />
                <div className="flex-grow flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-primary"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-brand-bg font-montserrat">
            <Navbar />

            <main className="flex-grow pt-28 pb-12 px-4">
                <div className="max-w-3xl mx-auto">
                    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                        {/* Header Background */}
                        <div className="h-32 bg-brand-dark overflow-hidden relative">
                            <div className="absolute inset-0 bg-[#d47e30]/30 mix-blend-overlay"></div>
                        </div>

                        <div className="px-8 pb-8">
                            <div className="relative flex justify-between items-end -mt-12 mb-6">
                                <div className="relative">
                                    <div className="w-24 h-24 rounded-2xl bg-white p-1 shadow-lg">
                                        <div className="w-full h-full rounded-xl bg-gray-200 overflow-hidden relative group">
                                            {previewImage ? (
                                                <img src={previewImage} alt="Profile" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-brand-bg text-brand-primary/50">
                                                    <User size={40} />
                                                </div>
                                            )}
                                            <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                                <Camera className="text-white" size={24} />
                                                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="mb-2">
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${user.role === 'owner' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                        {user.role} Account
                                    </span>
                                </div>
                            </div>

                            {/* Verification Alerts */}
                            {(() => {
                                let status = user?.verification?.status;
                                const rejectionReason = user?.verification?.rejectionReason;
                                const hasDocs = user?.documents?.length > 0;

                                // Treat 'pending' users with no documents as 'unverified' to fix legacy data issues
                                if (status === 'pending' && !hasDocs) {
                                    status = 'unverified';
                                }

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
                                                    Please verify your identity to build trust.
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
                                                    Your identity has been verified. You can now use all platform features.
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

                            <h1 className="text-3xl font-bold text-gray-900 mb-1 flex items-center gap-3">
                                {user.username}
                                {user.verification?.status === 'approved' && (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold bg-green-100 text-green-700 border border-green-200">
                                        <CheckCircle size={16} /> Verified
                                    </span>
                                )}
                            </h1>
                            <p className="text-gray-500 mb-8">{user.email}</p>

                            {message && (
                                <div className={`p-4 rounded-xl mb-6 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                                    {message.text}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <User size={20} className="text-gray-400" />
                                            </div>
                                            <input
                                                type="text"
                                                value={username}
                                                onChange={(e) => setUsername(e.target.value)}
                                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all"
                                                placeholder="Your Name"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <PhoneIcon size={20} className="text-gray-400" />
                                            </div>
                                            <input
                                                type="text"
                                                value={phoneNumber}
                                                onChange={(e) => setPhoneNumber(e.target.value)}
                                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all"
                                                placeholder="+91 9876543210"
                                            />
                                        </div>
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Mail size={20} className="text-gray-400" />
                                            </div>
                                            <input
                                                type="email"
                                                value={user.email}
                                                disabled
                                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed"
                                            />
                                            <p className="text-xs text-gray-400 mt-1 ml-1">Email cannot be changed</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-gray-100 pt-6 flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="flex items-center gap-2 px-8 py-3 bg-brand-primary text-white font-bold rounded-xl shadow-lg shadow-brand-dark/20 hover:bg-brand-secondary transition-all disabled:opacity-50"
                                    >
                                        {saving ? (
                                            <>Saving...</>
                                        ) : (
                                            <>
                                                <Save size={20} /> Save Changes
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Liked Properties Section - Only for Tenants */}
                    {user && user.role === 'tenant' && (
                        <div className="mt-12">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Liked Properties</h2>
                            <LikedPropertiesList />
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};

const LikedPropertiesList = () => {
    const [favorites, setFavorites] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const response = await authService.getFavorites();
                setFavorites(response.data || []);
            } catch (error) {
                console.error("Failed to fetch favorites", error);
            } finally {
                setLoading(false);
            }
        };
        fetchFavorites();
    }, []);

    if (loading) return <div className="py-10 text-center">Loading favorites...</div>;

    if (favorites.length === 0) {
        return (
            <div className="bg-white rounded-3xl p-10 text-center border border-gray-100 shadow-sm">
                <p className="text-gray-500">You haven't liked any properties yet.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {favorites.map(property => (
                <PropertyCard key={property._id} property={property} />
            ))}
        </div>
    );
};

export default ProfilePage;
