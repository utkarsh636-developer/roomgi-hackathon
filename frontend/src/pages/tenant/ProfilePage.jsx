import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Phone as PhoneIcon, Camera, Save, ShieldCheck, CheckCircle, AlertCircle, Clock, Heart, MessageSquare, Star, Edit, Trash2, X, XCircle, Home, LayoutDashboard } from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import authService from '../../services/authService';
import enquiryService from '../../services/enquiryService';
import reviewService from '../../services/reviewService';
import propertyService from '../../services/propertyService';
import PropertyCard from '../../components/property/PropertyCard';
import OwnerPropertyList from '../../components/owner/OwnerPropertyList';
import EnquiryList from '../../components/owner/EnquiryList';
import ReviewsList from '../../components/owner/ReviewsList';

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);
    const [activeTab, setActiveTab] = useState('profile'); // 'profile', 'favourites', 'enquiries', 'reviews'

    // Form States
    const [username, setUsername] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [profileImage, setProfileImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);

    // Delete Modal State
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [propertyToDelete, setPropertyToDelete] = useState(null);

    // Owner Data States
    const [ownerProperties, setOwnerProperties] = useState([]);
    const [ownerEnquiries, setOwnerEnquiries] = useState([]);
    const [ownerReviews, setOwnerReviews] = useState([]);

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

            // Fetch owner specific data if user is owner
            if (userData.role === 'owner') {
                const [propsRes, enquiriesRes, reviewsRes] = await Promise.all([
                    propertyService.getOwnerProperties(),
                    enquiryService.getEnquiriesByOwner(),
                    reviewService.getOwnerReviews()
                ]);
                setOwnerProperties(propsRes.data || []);
                setOwnerEnquiries(enquiriesRes.data || []);
                setOwnerReviews(reviewsRes.data || []);
            }
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

    const handleDeleteClick = (id) => {
        setPropertyToDelete(id);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!propertyToDelete) return;

        try {
            await propertyService.deleteProperty(propertyToDelete);
            setOwnerProperties(prev => prev.filter(p => p._id !== propertyToDelete));
            setShowDeleteModal(false);
            setPropertyToDelete(null);
            setMessage({ type: 'success', text: 'Property deleted successfully' });
        } catch (err) {
            console.error("Failed to delete property:", err);
            setMessage({ type: 'error', text: "Failed to delete property" });
        }
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
        setPropertyToDelete(null);
    };

    const fetchOwnerEnquiries = async () => {
        try {
            const enquiriesRes = await enquiryService.getEnquiriesByOwner();
            setOwnerEnquiries(enquiriesRes.data || []);
        } catch (err) {
            console.error("Failed to fetch enquiries:", err);
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

    const tabs = [
        { id: 'profile', label: 'Profile', icon: User },
        ...(user?.role === 'tenant' ? [
            { id: 'favourites', label: 'Favourites', icon: Heart },
            { id: 'enquiries', label: 'My Enquiries', icon: MessageSquare },
            { id: 'reviews', label: 'My Reviews', icon: Star }
        ] : []),
        ...(user?.role === 'owner' ? [
            { id: 'properties', label: 'My Properties', icon: Home },
            { id: 'enquiries', label: 'Tenant Enquiries', icon: MessageSquare },
            { id: 'reviews', label: 'Reviews', icon: Star },
        ] : [])
    ];

    return (
        <div className="flex flex-col min-h-screen bg-brand-bg font-montserrat">
            <Navbar />

            <main className="flex-grow pt-28 pb-12 px-4">
                <div className="max-w-6xl mx-auto">
                    
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
                                        Are you sure you want to delete this property? This action cannot be undone.
                                    </p>
                                </div>

                                <div className="flex gap-3">
                                    <button onClick={cancelDelete} className="flex-1 py-3 px-4 border border-gray-200 rounded-xl font-bold text-gray-700 hover:bg-gray-50 transition-colors">
                                        Cancel
                                    </button>
                                    <button onClick={confirmDelete} className="flex-1 py-3 px-4 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20">
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                        {/* Header Background */}
                        <div className="h-32 bg-brand-dark overflow-hidden relative">
                            <div className="absolute inset-0 bg-[#d47e30]/30 mix-blend-overlay"></div>
                        </div>

                        <div className="px-4 sm:px-6 md:px-8 pb-8">
                            <div className="relative flex flex-col sm:flex-row justify-between items-start sm:items-end -mt-12 mb-6 gap-4">
                                <div className="relative">
                                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white p-1 shadow-lg">
                                        <div className="w-full h-full rounded-xl bg-gray-200 overflow-hidden relative group">
                                            {previewImage ? (
                                                <img src={previewImage} alt="Profile" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-brand-bg text-brand-primary/50">
                                                    <User size={32} className="sm:w-10 sm:h-10" />
                                                </div>
                                            )}
                                            {activeTab === 'profile' && (
                                                <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                                    <Camera className="text-white" size={20} />
                                                    <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                                </label>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="mb-0 sm:mb-2">
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${user.role === 'owner' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                        {user.role} Account
                                    </span>
                                </div>
                            </div>

                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 flex flex-wrap items-center gap-2 sm:gap-3">
                                <span className="break-all">{user.username}</span>
                                {user.verification?.status === 'approved' && (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs sm:text-sm font-bold bg-green-100 text-green-700 border border-green-200">
                                        <CheckCircle size={14} className="sm:w-4 sm:h-4" /> Verified
                                    </span>
                                )}
                            </h1>
                            <p className="text-sm sm:text-base text-gray-500 mb-6 sm:mb-8 break-all">{user.email}</p>

                            {/* Tabs */}
                            <div className="border-b border-gray-200 mb-6 sm:mb-8 -mx-4 sm:mx-0 px-4 sm:px-0">
                                <div className="flex gap-1 sm:gap-2 overflow-x-auto scrollbar-hide">
                                    {tabs.map(tab => {
                                        const Icon = tab.icon;
                                        return (
                                            <button
                                                key={tab.id}
                                                onClick={() => setActiveTab(tab.id)}
                                                className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                                                    activeTab === tab.id
                                                        ? 'text-brand-primary border-b-2 border-brand-primary'
                                                        : 'text-gray-500 hover:text-gray-700'
                                                }`}
                                            >
                                                <Icon size={16} className="sm:w-[18px] sm:h-[18px]" />
                                                <span className="hidden sm:inline">{tab.label}</span>
                                                <span className="sm:hidden">{tab.label.replace('My ', '').replace('Tenant ', '')}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Tab Content */}
                            {activeTab === 'profile' && (
                                <ProfileTab
                                    user={user}
                                    username={username}
                                    setUsername={setUsername}
                                    phoneNumber={phoneNumber}
                                    setPhoneNumber={setPhoneNumber}
                                    handleSubmit={handleSubmit}
                                    saving={saving}
                                    message={message}
                                />
                            )}

                            {activeTab === 'favourites' && <FavouritesTab />}
                            
                            {activeTab === 'properties' && user.role === 'owner' && (
                                <OwnerPropertyList 
                                    properties={ownerProperties} 
                                    onDeleteClick={handleDeleteClick} 
                                    user={user}
                                />
                            )}

                            {activeTab === 'enquiries' && (
                                user.role === 'owner' ? (
                                    <EnquiryList enquiries={ownerEnquiries} onEnquiryUpdate={fetchOwnerEnquiries} />
                                ) : (
                                    <EnquiriesTab />
                                )
                            )}

                            {activeTab === 'reviews' && (
                                user.role === 'owner' ? (
                                    <ReviewsList reviews={ownerReviews} />
                                ) : (
                                    typeof ReviewsTab !== 'undefined' ? <ReviewsTab /> : null
                                )
                            )}
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

// Profile Tab Component
const ProfileTab = ({ user, username, setUsername, phoneNumber, setPhoneNumber, handleSubmit, saving, message }) => {
    return (
        <>
            {/* Verification Alerts */}
            {(() => {
                let status = user?.verification?.status;
                const rejectionReason = user?.verification?.rejectionReason;
                const hasDocs = user?.documents?.length > 0;

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
        </>
    );
};

// Favourites Tab Component
const FavouritesTab = () => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
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

    if (loading) return <div className="py-10 text-center">Loading favourites...</div>;

    if (favorites.length === 0) {
        return (
            <div className="bg-gray-50 rounded-3xl p-16 text-center border border-gray-200">
                <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-700 mb-2">No Favourites Yet</h3>
                <p className="text-gray-500 mb-6">Properties you like will appear here</p>
                <Link to="/explore" className="inline-block px-6 py-3 bg-brand-primary text-white font-semibold rounded-xl hover:bg-brand-secondary transition-colors">
                    Explore Properties
                </Link>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map(property => (
                <PropertyCard key={property._id} property={property} />
            ))}
        </div>
    );
};

// Enquiries Tab Component
const EnquiriesTab = () => {
    const [enquiries, setEnquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingEnquiry, setEditingEnquiry] = useState(null);
    const [editMessage, setEditMessage] = useState('');

    const fetchEnquiries = async () => {
        try {
            const response = await enquiryService.getEnquiriesByTenant();
            setEnquiries(response.data || []);
        } catch (error) {
            console.error("Failed to fetch enquiries", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEnquiries();
    }, []);

    const handleEdit = (enquiry) => {
        setEditingEnquiry(enquiry._id);
        setEditMessage(enquiry.message);
    };

    const handleSaveEdit = async (enquiryId) => {
        try {
            await enquiryService.updateEnquiry(enquiryId, { message: editMessage });
            setEditingEnquiry(null);
            fetchEnquiries();
        } catch (error) {
            console.error("Failed to update enquiry", error);
            alert("Failed to update enquiry");
        }
    };

    const handleDelete = async (enquiryId) => {
        if (window.confirm("Are you sure you want to delete this enquiry?")) {
            try {
                await enquiryService.deleteEnquiry(enquiryId);
                fetchEnquiries();
            } catch (error) {
                console.error("Failed to delete enquiry", error);
                alert("Failed to delete enquiry");
            }
        }
    };

    if (loading) return <div className="py-10 text-center">Loading enquiries...</div>;

    if (enquiries.length === 0) {
        return (
            <div className="bg-gray-50 rounded-3xl p-16 text-center border border-gray-200">
                <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-700 mb-2">No Enquiries Yet</h3>
                <p className="text-gray-500 mb-6">Your property enquiries will appear here</p>
                <Link to="/explore" className="inline-block px-6 py-3 bg-brand-primary text-white font-semibold rounded-xl hover:bg-brand-secondary transition-colors">
                    Explore Properties
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {enquiries.map(enquiry => (
                <div key={enquiry._id} className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                            <Link to={`/property/${enquiry.property?._id}`} className="text-lg font-bold text-gray-900 hover:text-brand-primary">
                                {enquiry.property?.name || enquiry.property?.title || 'Property'}
                            </Link>
                            <p className="text-sm text-gray-500 mt-1">
                                {new Date(enquiry.createdAt).toLocaleDateString('en-IN', { 
                                    year: 'numeric', 
                                    month: 'long', 
                                    day: 'numeric' 
                                })}
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                                enquiry.status === 'pending' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' :
                                enquiry.status === 'contacted' ? 'bg-green-100 text-green-700 border border-green-200' :
                                enquiry.status === 'rejected' ? 'bg-red-100 text-red-700 border border-red-200' :
                                'bg-gray-100 text-gray-700 border border-gray-200'
                            }`}>
                                {enquiry.status === 'pending' && <Clock size={14} />}
                                {enquiry.status === 'contacted' && <CheckCircle size={14} />}
                                {enquiry.status === 'rejected' && <XCircle size={14} />}
                                {enquiry.status}
                            </span>
                            <button
                                onClick={() => handleEdit(enquiry)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Edit enquiry"
                            >
                                <Edit size={16} />
                            </button>
                            <button
                                onClick={() => handleDelete(enquiry._id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete enquiry"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                    
                    {editingEnquiry === enquiry._id ? (
                        <div className="space-y-3">
                            <textarea
                                value={editMessage}
                                onChange={(e) => setEditMessage(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none resize-none"
                                rows="4"
                            />
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleSaveEdit(enquiry._id)}
                                    className="px-4 py-2 bg-brand-primary text-white rounded-lg font-semibold hover:bg-brand-secondary transition-colors"
                                >
                                    Save
                                </button>
                                <button
                                    onClick={() => setEditingEnquiry(null)}
                                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-700 mb-4">{enquiry.message}</p>
                    )}
                    
                    {/* Owner's Reply */}
                    {enquiry.reply && (
                        <div className="bg-brand-primary/5 p-4 rounded-xl border border-brand-primary/20 mt-4">
                            <p className="text-xs font-bold text-brand-primary mb-1">Owner's Reply:</p>
                            <p className="text-gray-700">{enquiry.reply}</p>
                            <p className="text-xs text-gray-500 mt-2">Replied on {new Date(enquiry.updatedAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        </div>
                    )}

                    {/* Rejection Notice */}
                    {enquiry.status === 'rejected' && !enquiry.reply && (
                        <div className="bg-red-50 p-4 rounded-xl border border-red-200 mt-4">
                            <p className="text-sm font-bold text-red-700">This enquiry was rejected by the owner.</p>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

// Reviews Tab Component
const ReviewsTab = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingReview, setEditingReview] = useState(null);
    const [editRating, setEditRating] = useState(0);
    const [editComment, setEditComment] = useState('');

    const fetchReviews = async () => {
        try {
            const currentUser = authService.getCurrentUser();
            if (currentUser && currentUser._id) {
                const response = await reviewService.getUserReviews(currentUser._id);
                setReviews(response.data || []);
            }
        } catch (error) {
            console.error("Failed to fetch reviews", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    const handleEdit = (review) => {
        setEditingReview(review._id);
        setEditRating(review.rating);
        setEditComment(review.comment);
    };

    const handleSaveEdit = async (reviewId) => {
        try {
            const formData = new FormData();
            formData.append('rating', editRating);
            formData.append('comment', editComment);
            
            await reviewService.updateReview(reviewId, formData);
            setEditingReview(null);
            fetchReviews();
        } catch (error) {
            console.error("Failed to update review", error);
            alert("Failed to update review");
        }
    };

    const handleDelete = async (reviewId) => {
        if (window.confirm("Are you sure you want to delete this review?")) {
            try {
                await reviewService.deleteReview(reviewId);
                fetchReviews();
            } catch (error) {
                console.error("Failed to delete review", error);
                alert("Failed to delete review");
            }
        }
    };

    if (loading) return <div className="py-10 text-center">Loading reviews...</div>;

    if (reviews.length === 0) {
        return (
            <div className="bg-gray-50 rounded-3xl p-16 text-center border border-gray-200">
                <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-700 mb-2">No Reviews Yet</h3>
                <p className="text-gray-500 mb-6">Reviews you write will appear here</p>
                <Link to="/explore" className="inline-block px-6 py-3 bg-brand-primary text-white font-semibold rounded-xl hover:bg-brand-secondary transition-colors">
                    Explore Properties
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {reviews.map(review => (
                <div key={review._id} className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                            <Link to={`/property/${review.property?._id}`} className="text-lg font-bold text-gray-900 hover:text-brand-primary">
                                {review.property?.name || review.property?.title || 'Property'}
                            </Link>
                            <div className="flex items-center gap-2 mt-2">
                                {editingReview === review._id ? (
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                onClick={() => setEditRating(star)}
                                                className="focus:outline-none"
                                            >
                                                <Star
                                                    size={20}
                                                    className={star <= editRating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                size={16}
                                                className={i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
                                            />
                                        ))}
                                    </div>
                                )}
                                <span className="text-sm text-gray-500">
                                    {new Date(review.createdAt).toLocaleDateString('en-IN', { 
                                        year: 'numeric', 
                                        month: 'short', 
                                        day: 'numeric' 
                                    })}
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => handleEdit(review)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Edit review"
                            >
                                <Edit size={16} />
                            </button>
                            <button
                                onClick={() => handleDelete(review._id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete review"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                    
                    {editingReview === review._id ? (
                        <div className="space-y-3">
                            <textarea
                                value={editComment}
                                onChange={(e) => setEditComment(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none resize-none"
                                rows="4"
                                placeholder="Write your review..."
                            />
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleSaveEdit(review._id)}
                                    className="px-4 py-2 bg-brand-primary text-white rounded-lg font-semibold hover:bg-brand-secondary transition-colors"
                                >
                                    Save
                                </button>
                                <button
                                    onClick={() => setEditingReview(null)}
                                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-700">{review.comment}</p>
                    )}
                    
                    {review.images && review.images.length > 0 && (
                        <div className="flex gap-2 mt-4">
                            {review.images.map((img, idx) => (
                                <img key={idx} src={img} alt="Review" className="w-20 h-20 object-cover rounded-lg" />
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default ProfilePage;
