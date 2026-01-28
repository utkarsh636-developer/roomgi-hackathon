import React, { useState, useEffect } from 'react';
import { User, Mail, Phone as PhoneIcon, Camera, Save, ShieldCheck } from 'lucide-react';
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
            <div className="flex flex-col min-h-screen bg-gray-50 font-montserrat">
                <Navbar />
                <div className="flex-grow flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 font-montserrat">
            <Navbar />

            <main className="flex-grow pt-28 pb-12 px-4">
                <div className="max-w-3xl mx-auto">
                    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                        {/* Header Background */}
                        <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600"></div>

                        <div className="px-8 pb-8">
                            <div className="relative flex justify-between items-end -mt-12 mb-6">
                                <div className="relative">
                                    <div className="w-24 h-24 rounded-2xl bg-white p-1 shadow-lg">
                                        <div className="w-full h-full rounded-xl bg-gray-200 overflow-hidden relative group">
                                            {previewImage ? (
                                                <img src={previewImage} alt="Profile" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-indigo-50 text-indigo-300">
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

                            <h1 className="text-3xl font-bold text-gray-900 mb-1">{user.username}</h1>
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
                                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
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
                                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
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
                                        className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all disabled:opacity-50"
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
