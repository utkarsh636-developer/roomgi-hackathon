import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
    MapPin, Wifi, Wind, Coffee, Share2, Heart, Star,
    CheckCircle, ArrowLeft, Calendar, User, ShieldCheck,
    Bath, BedDouble, Home, Maximize, Phone, Utensils, Car, Thermometer, Camera, Dumbbell, Activity,
    Zap, Tv, Droplets, Cigarette, Wine
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Navbar from './Navbar';
import Footer from './Footer';

import propertyService from '../services/propertyService';
import authService from '../services/authService';
import enquiryService from '../services/enquiryService';
import ReviewSection from './ReviewSection';
import { Send, X, Edit, Trash2, AlertTriangle } from 'lucide-react'; // Add AlertTriangle
import reportService from '../services/reportService';

// Fix Leaflet default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Helper for Lucide imports if missing
const Sun = ({ size, className }) => <div className={className}>☀️</div>;
const Flower = ({ size, className }) => <div className={className}>🌻</div>;
const Snowflake = ({ size, className }) => <div className={className}>❄️</div>;
const Shirt = ({ size, className }) => <div className={className}>👕</div>;
const Dog = ({ size, className }) => <div className={className}>🐕</div>;

// Amenity Icon Mapping
const AMENITY_ICONS = {
    "wifi": Wifi,
    "ac": Wind,
    "non_ac": Wind, // Fallback
    "furnished": Home,
    "semi_furnished": Home,
    "unfurnished": Home,
    "balcony": Sun, // Need to import Sun or similar
    "garden": Flower, // Need import
    "terrace": Sun,
    "parking": Car,
    "covered_parking": Car,
    "power_backup": Zap,
    "water_supply_24x7": Droplets,
    "water_geaser": Thermometer,
    "gas": Zap,
    "mess": Utensils,
    "shared_kitchen": Utensils,
    "private_kitchen": Utensils,
    "refrigerator": Snowflake, // Need import
    "gas_stove": Zap,
    "gym": Dumbbell,
    "yoga_room": Activity,
    "cctv": Camera,
    "security_guard": ShieldCheck,
    "laundry": Shirt, // Need import
    "housekeeping": Home,
    "tv_cable": Tv,
    "internet_high_speed": Wifi,
    "pet_friendly": Dog, // Need import
    "smoking_allowed": Cigarette,

    "drinking_allowed": Wine
};

const EnquiryModal = ({ isOpen, onClose, property, user, existingEnquiry }) => {
    const [message, setMessage] = useState('');
    const [contactDetails, setContactDetails] = useState({
        name: user?.username || '',
        email: user?.email || '',
        phone: user?.phoneNumber || ''
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);

    // Update state when user prop changes
    useEffect(() => {
        if (user) {
            setContactDetails({
                name: user.username || '',
                email: user.email || '',
                phone: user.phoneNumber || ''
            });
        }
    }, [user]);

    // Pre-fill message if editing
    useEffect(() => {
        if (existingEnquiry) {
            setMessage(existingEnquiry.message || '');
        } else {
            setMessage('');
        }
    }, [existingEnquiry, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setContactDetails(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (existingEnquiry) {
                await enquiryService.updateEnquiry(existingEnquiry._id, { message });
            } else {
                await enquiryService.createEnquiry({
                    propertyId: property._id,
                    message: message,
                    name: contactDetails.name,
                    email: contactDetails.email,
                    phone: contactDetails.phone
                });
            }
            setSuccess(true);
            setTimeout(() => {
                onClose();
                setSuccess(false);
                if (!existingEnquiry) setMessage('');
            }, 2000);
        } catch (err) {
            setError(err.message || 'Failed to send enquiry.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h3 className="text-xl font-bold text-gray-800">{existingEnquiry ? 'Edit Enquiry' : 'Contact Owner'}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6">
                    {success ? (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                                <CheckCircle size={32} />
                            </div>
                            <h4 className="text-xl font-bold text-gray-900 mb-2">{existingEnquiry ? 'Enquiry Updated!' : 'Enquiry Sent!'}</h4>
                            <p className="text-gray-500">The owner has been notified and will contact you shortly.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {!existingEnquiry && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                                        <div className="w-10 h-10 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center font-bold">
                                            {property.owner?.username?.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">{property.owner?.username}</p>
                                            <p className="text-xs text-gray-500">Property Owner</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {!existingEnquiry && (
                                <>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                            <input
                                                type="text"
                                                name="name"
                                                required
                                                value={contactDetails.name}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                required
                                                value={contactDetails.phone}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            required
                                            value={contactDetails.email}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all"
                                        />
                                    </div>
                                </>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{existingEnquiry ? 'Update Message' : 'Your Message'}</label>
                                <textarea
                                    required
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Hi, I'm interested in this property. Is it still available?"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all min-h-[100px] resize-none"
                                />
                            </div>

                            {error && (
                                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">
                                    {error}
                                </div>
                            )}

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 py-3 px-4 rounded-xl border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 py-3 px-4 rounded-xl bg-brand-primary text-white font-bold hover:bg-brand-secondary transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
                                >
                                    {loading ? (existingEnquiry ? 'Updating...' : 'Sending...') : <><Send size={18} /> {existingEnquiry ? 'Update Enquiry' : 'Send Enquiry'}</>}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};


const ReportModal = ({ isOpen, onClose, property, user }) => {
    const [reason, setReason] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await reportService.createReport({
                targetModel: 'Property',
                targetId: property._id,
                reason,
                message
            });
            setSuccess(true);
            setTimeout(() => {
                onClose();
                setSuccess(false);
                setReason('');
                setMessage('');
            }, 2000);
        } catch (err) {
            setError(err.message || 'Failed to submit report.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <AlertTriangle className="text-red-500" size={24} /> Report Property
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6">
                    {success ? (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                                <CheckCircle size={32} />
                            </div>
                            <h4 className="text-xl font-bold text-gray-900 mb-2">Report Submitted</h4>
                            <p className="text-gray-500">Thank you for helping us keep our community safe.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                                <select
                                    required
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all"
                                >
                                    <option value="">Select a reason</option>
                                    <option value="Spam">Spam</option>
                                    <option value="Inaccurate Information">Inaccurate Information</option>
                                    <option value="Offensive Content">Offensive Content</option>
                                    <option value="Fraud/Scam">Fraud/Scam</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Details</label>
                                <textarea
                                    required
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Please provide more details about the issue..."
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all min-h-[100px] resize-none"
                                />
                            </div>

                            {error && (
                                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">
                                    {error}
                                </div>
                            )}

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 py-3 px-4 rounded-xl border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 py-3 px-4 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
                                >
                                    {loading ? 'Submitting...' : 'Submit Report'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};


const PropertyDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);
    const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [user, setUser] = useState(authService.getCurrentUser());
    const [existingEnquiry, setExistingEnquiry] = useState(null);
    const [hasReported, setHasReported] = useState(false);
    const [isLiked, setIsLiked] = useState(false);

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                const response = await propertyService.getPropertyById(id);
                setProperty(response.data);
            } catch (err) {
                console.error("Failed to fetch property:", err);
                setError("Failed to load property details.");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProperty();
        }
    }, [id]);

    useEffect(() => {
        const checkExistingEnquiry = async () => {
            if (user && property) {
                try {
                    const response = await enquiryService.getEnquiriesByTenant();
                    const enquiries = response.data;
                    const found = enquiries.find(e => e.property?._id === property._id);
                    setExistingEnquiry(found || null);
                } catch (err) {
                    console.error("Failed to check existing enquiries:", err);
                }
            }
        };

        checkExistingEnquiry();
    }, [user, property]);

    useEffect(() => {
        const checkReportStatus = async () => {
            if (user && property) {
                try {
                    const response = await reportService.getMyReports();
                    const reports = response.data || [];

                    const found = reports.find(r => {
                        const targetId = r.targetProperty?._id || r.targetProperty;
                        return targetId?.toString() === property._id?.toString();
                    });

                    setHasReported(!!found);
                } catch (err) {
                    console.error("Failed to check report status:", err);
                }
            }
        };
        checkReportStatus();
    }, [user, property, isReportModalOpen]); // Re-check when modal closes

    useEffect(() => {
        const checkLikedStatus = () => {
            if (user && user.favorites && property) {
                const liked = user.favorites.includes(property._id);
                setIsLiked(liked);
            }
        };
        checkLikedStatus();
    }, [user, property]);

    const handleLike = async () => {
        if (!user) {
            alert("Please login to like properties.");
            return;
        }

        try {
            // Optimistic UI update
            const newLikedState = !isLiked;
            setIsLiked(newLikedState);

            const response = await authService.toggleFavorite(property._id);

            // Update local user state to reflect new favorites list
            const updatedUser = authService.getCurrentUser();
            setUser(updatedUser);

        } catch (err) {
            console.error("Failed to toggle like:", err);
            setIsLiked(!isLiked); // Revert on error
            alert("Failed to update favorite status.");
        }
    };

    const handleDeleteEnquiry = async () => {
        if (!existingEnquiry) return;
        if (window.confirm("Are you sure you want to delete your enquiry?")) {
            try {
                await enquiryService.deleteEnquiry(existingEnquiry._id);
                setExistingEnquiry(null);
                // alert("Enquiry deleted successfully.");
            } catch (err) {
                console.error("Failed to delete enquiry:", err);
                alert("Failed to delete enquiry.");
            }
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col min-h-screen bg-gray-50 font-montserrat">
                <Navbar />
                <div className="flex-grow flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-primary"></div>
                </div>
            </div>
        );
    }

    if (error || !property) {
        return (
            <div className="flex flex-col min-h-screen bg-gray-50 font-montserrat">
                <Navbar />
                <div className="flex-grow flex flex-col items-center justify-center text-center p-4">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops!</h2>
                    <p className="text-gray-600 mb-6">{error || "Property not found."}</p>
                    <Link to="/explore" className="px-6 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-secondary transition-colors">
                        Back to Explore
                    </Link>
                </div>
            </div>
        );
    }

    // Prepare display data
    const displayImages = property.images && property.images.length > 0
        ? property.images.map(img => img.url)
        : ['https://via.placeholder.com/800x600?text=No+Image'];

    // Ensure we have at least 5 images for the grid by repeating if necessary (visual only)
    const galleryImages = [...displayImages];
    while (galleryImages.length < 5) {
        galleryImages.push(displayImages[0]);
    }

    const mapAmenityToIcon = (amenityKey) => {
        const IconComponent = AMENITY_ICONS[amenityKey] || CheckCircle;
        const formattedName = amenityKey.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        return { icon: IconComponent, name: formattedName };
    };

    const displayAmenities = property.amenities ? property.amenities.map(mapAmenityToIcon) : [];

    const highlights = [
        { label: 'Type', value: property.type },
        { label: 'Capacity', value: `${property.capacity?.total || 'N/A'} Person(s)` },
        { label: 'City', value: property.location?.city },
        { label: 'State', value: property.location?.state }
    ];

    return (
        <div className="flex flex-col min-h-screen bg-brand-bg font-montserrat">
            <Navbar />

            <EnquiryModal
                isOpen={isEnquiryModalOpen}
                onClose={() => {
                    setIsEnquiryModalOpen(false);
                    // Refresh enquiry state on close
                    if (user && property) {
                        enquiryService.getEnquiriesByTenant().then(res => {
                            const found = res.data.find(e => e.property?._id === property._id);
                            setExistingEnquiry(found || null);
                        });
                    }
                }}
                property={property}
                user={user}
                existingEnquiry={existingEnquiry}
            />

            <ReportModal
                isOpen={isReportModalOpen}
                onClose={() => setIsReportModalOpen(false)}
                property={property}
                user={user}
            />

            <main className="flex-grow pt-24 pb-12">
                {/* Gallery Modal */}
                {isGalleryOpen && (
                    <div className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-sm overflow-y-auto p-4 md:p-10 flex flex-col">
                        <button
                            onClick={() => setIsGalleryOpen(false)}
                            className="absolute top-6 right-6 text-white hover:text-gray-300 transition-colors bg-white/10 p-2 rounded-full"
                        >
                            <Maximize size={24} className="rotate-45" />
                        </button>
                        <div className="max-w-5xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-4 mt-10">
                            {displayImages.map((img, idx) => (
                                <img key={idx} src={img} alt={`Gallery ${idx}`} className="w-full h-auto rounded-xl shadow-2xl" />
                            ))}
                        </div>
                    </div>
                )}

                {/* Top Navigation / Breadcrumbs */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
                    <Link to="/explore" className="inline-flex items-center text-gray-500 hover:text-brand-primary transition-colors mb-4 text-sm font-medium">
                        <ArrowLeft size={16} className="mr-2" /> Back to Explore
                    </Link>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <span className="px-3 py-1 bg-brand-primary/10 text-brand-primary rounded-full text-xs font-bold uppercase tracking-wide">
                                    {property.type}
                                </span>
                                {property.verification?.status === 'approved' && (
                                    <span className="flex items-center gap-1 px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-xs font-bold uppercase tracking-wide">
                                        <ShieldCheck size={14} /> Verified Property
                                    </span>
                                )}
                            </div>
                            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
                                {property.name || `${property.type} in ${property.location?.city}`}
                            </h1>
                            <div className="flex items-center gap-2 text-gray-500 mt-2 text-sm md:text-base">
                                <MapPin size={18} className="text-brand-primary" />
                                {property.location?.addressLine}, {property.location?.city}
                            </div>
                        </div>
                        <div className="flex gap-3">
                            {(!user || user.role !== 'owner') && (
                                <button
                                    onClick={handleLike}
                                    className={`p-3 bg-white border border-gray-200 rounded-full shadow-sm hover:bg-gray-50 transition-colors ${isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
                                >
                                    <Heart size={20} className={isLiked ? 'fill-current' : ''} />
                                </button>
                            )}
                            <button className="p-3 bg-white border border-gray-200 rounded-full shadow-sm hover:bg-gray-50 hover:text-brand-primary transition-colors">
                                <Share2 size={20} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Photo Gallery Grid - Fixed Layout */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 h-[400px] md:h-[500px] rounded-3xl overflow-hidden shadow-xl bg-gray-200">
                        {/* Main Large Image (Left Half) */}
                        <div className="md:col-span-2 md:row-span-2 relative group cursor-pointer overflow-hidden" onClick={() => setIsGalleryOpen(true)}>
                            <img src={galleryImages[0]} alt="Main" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                        </div>

                        {/* Right column top image */}
                        <div className="hidden md:block relative group cursor-pointer overflow-hidden" onClick={() => setIsGalleryOpen(true)}>
                            <img src={galleryImages[1]} alt="Sub 1" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        </div>

                        {/* Right column top-right image */}
                        <div className="hidden md:block relative group cursor-pointer overflow-hidden" onClick={() => setIsGalleryOpen(true)}>
                            <img src={galleryImages[2]} alt="Sub 2" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        </div>

                        {/* Right column bottom image */}
                        <div className="hidden md:block relative group cursor-pointer overflow-hidden" onClick={() => setIsGalleryOpen(true)}>
                            <img src={galleryImages[3]} alt="Sub 3" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        </div>

                        {/* View All Overlay Button Image */}
                        <div className="hidden md:block relative group cursor-pointer overflow-hidden" onClick={() => setIsGalleryOpen(true)}>
                            <img src={galleryImages[4]} alt="Sub 4" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center hover:bg-black/50 transition-colors">
                                <span className="text-white font-bold flex items-center gap-2">
                                    <Maximize size={18} /> View All Photos
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row gap-10">

                        {/* Left Column: Details */}
                        <div className="w-full lg:w-2/3 space-y-10">

                            {/* Quick Stats Highlights */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {highlights.map((item, idx) => (
                                    <div key={idx} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:-translate-y-1 transition-transform">
                                        <span className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-1">{item.label}</span>
                                        <span className="text-gray-800 font-bold text-sm md:text-base">{item.value}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Description */}
                            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">About the Property</h3>
                                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                                    {property.description}
                                </p>
                            </div>

                            {/* Amenities */}
                            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                                <h3 className="text-xl font-bold text-gray-900 mb-6">Amenity Highlights</h3>
                                {displayAmenities.length > 0 ? (
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-4">
                                        {displayAmenities.map((amenity, idx) => (
                                            <div key={idx} className="flex items-center gap-3 text-gray-700">
                                                <div className="w-10 h-10 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center shrink-0">
                                                    <amenity.icon size={20} />
                                                </div>
                                                <span className="font-medium text-sm">{amenity.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 italic">No specific amenities listed.</p>
                                )}
                            </div>

                            {/* Preferences / House Rules */}
                            {property.preferences && (
                                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                                    <h3 className="text-xl font-bold text-gray-900 mb-4">House Rules & Preferences</h3>
                                    <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                                        {property.preferences}
                                    </p>
                                </div>
                            )}

                            {/* Location Map */}
                            {property.location?.coordinates?.coordinates && (
                                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <MapPin className="text-brand-primary" size={24} />
                                        Property Location
                                    </h3>
                                    <div className="mb-4">
                                        <p className="text-gray-600 text-sm flex items-start gap-2">
                                            <MapPin className="text-brand-primary mt-0.5 flex-shrink-0" size={16} />
                                            <span>
                                                {property.location.addressLine}, {property.location.city}, {property.location.state} - {property.location.pincode}
                                            </span>
                                        </p>
                                    </div>
                                    <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm h-[400px]">
                                        <MapContainer
                                            center={[property.location.coordinates.coordinates[1], property.location.coordinates.coordinates[0]]}
                                            zoom={15}
                                            style={{ height: '100%', width: '100%' }}
                                            scrollWheelZoom={false}
                                        >
                                            <TileLayer
                                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                            />
                                            <Marker position={[property.location.coordinates.coordinates[1], property.location.coordinates.coordinates[0]]}>
                                                <Popup>
                                                    <div className="text-center">
                                                        <p className="font-bold text-gray-900">{property.title || property.type}</p>
                                                        <p className="text-xs text-gray-600 mt-1">{property.location.addressLine}</p>
                                                        <a
                                                            href={`https://www.google.com/maps?q=${property.location.coordinates.coordinates[1]},${property.location.coordinates.coordinates[0]}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-brand-primary text-xs font-semibold mt-2 inline-block hover:underline"
                                                        >
                                                            Open in Google Maps →
                                                        </a>
                                                    </div>
                                                </Popup>
                                            </Marker>
                                        </MapContainer>
                                    </div>
                                    <div className="mt-4 flex justify-center">
                                        <a
                                            href={`https://www.google.com/maps?q=${property.location.coordinates.coordinates[1]},${property.location.coordinates.coordinates[0]}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-xl font-semibold hover:bg-brand-secondary transition-colors"
                                        >
                                            <MapPin size={18} />
                                            Get Directions
                                        </a>
                                    </div>
                                </div>
                            )}

                            {/* Reviews Section */}
                            <ReviewSection propertyId={id} />

                        </div>

                        {/* Right Column: Sticky Owner/Pricing Card */}
                        <div className="w-full lg:w-1/3">
                            <div className="sticky top-28 bg-white p-6 rounded-3xl shadow-xl border border-gray-100">
                                <div className="flex justify-between items-end mb-6">
                                    <div>
                                        <span className="text-sm text-gray-400 block mb-1">Rent/Month</span>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-3xl font-extrabold text-gray-900">₹{property.rent?.toLocaleString()}</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xs text-gray-400 block">Security Deposit</span>
                                        <span className="font-bold text-gray-700">₹{property.securityDeposit?.toLocaleString()}</span>
                                    </div>
                                </div>

                                <hr className="border-gray-100 mb-6" />

                                <div className="mb-6">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden border-2 border-white shadow-md">
                                            <div className="w-full h-full bg-brand-primary/10 flex items-center justify-center text-brand-primary font-bold text-2xl">
                                                {property.owner?.username?.charAt(0).toUpperCase() || 'O'}
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-bold text-gray-900 capitalize">
                                                {property.owner?.username || 'Owner'}
                                                {property.owner?.verification?.status === 'approved' && (
                                                    <span className="inline-flex items-center gap-1 ml-2 px-2 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200">
                                                        <CheckCircle size={12} /> Verified
                                                    </span>
                                                )}
                                            </h4>
                                            <p className="text-xs text-gray-500">{property.owner?.email}</p>
                                        </div>
                                    </div>

                                    {/* Owner Stats could be fetched separately if needed */}
                                    {/* <div className="space-y-3 p-4 bg-gray-50 rounded-2xl border border-gray-100 text-sm"> ... </div> */}
                                </div>

                                {existingEnquiry ? (
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => setIsEnquiryModalOpen(true)}
                                            className="flex-1 flex items-center justify-center gap-2 bg-brand-primary hover:bg-brand-secondary text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-brand-dark/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                                        >
                                            <Edit size={20} />
                                            Edit
                                        </button>
                                        <button
                                            onClick={handleDeleteEnquiry}
                                            className="flex-none flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 py-4 px-4 rounded-xl font-bold text-lg shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => {
                                            if (!user) {
                                                navigate('/login', { state: { from: `/property/${id}` } });
                                                return;
                                            }
                                            setIsEnquiryModalOpen(true);
                                        }}
                                        className="w-full flex items-center justify-center gap-2 bg-brand-primary hover:bg-brand-secondary text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-brand-dark/20 transition-all hover:scale-[1.02] active:scale-[0.98] group"
                                    >
                                        <Phone size={20} className="group-hover:animate-pulse" />
                                        Contact Owner
                                    </button>
                                )}

                                <p className="text-xs text-center text-gray-400 mt-4">
                                    By contacting, you agree to our Terms & Privacy Policy.
                                </p>

                                <div className="mt-4 pt-4 border-t border-gray-100 text-center">
                                    {hasReported ? (
                                        <div className="text-xs text-green-600 flex items-center justify-center gap-1 mx-auto font-medium">
                                            <CheckCircle size={12} /> Report Submitted
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => {
                                                if (!user) {
                                                    navigate('/login', { state: { from: `/property/${id}` } });
                                                    return;
                                                }
                                                setIsReportModalOpen(true);
                                            }}
                                            className="text-xs text-gray-400 hover:text-red-500 flex items-center justify-center gap-1 mx-auto transition-colors"
                                        >
                                            <AlertTriangle size={12} /> Report this property
                                        </button>
                                    )}
                                </div>

                            </div>
                        </div>

                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default PropertyDetailsPage;
