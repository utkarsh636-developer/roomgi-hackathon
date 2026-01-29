import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    MapPin, Wifi, Wind, Coffee, Share2, Heart, Star,
    CheckCircle, ArrowLeft, Calendar, User, ShieldCheck,
    Bath, BedDouble, Home, Maximize, Phone, Utensils, Car, Thermometer, Camera, Dumbbell, Activity,
    Zap, Tv, Droplets, Cigarette, Wine
} from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';
import propertyService from '../services/propertyService';
import ReviewSection from './ReviewSection';

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


const PropertyDetailsPage = () => {
    const { id } = useParams();
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);

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
                            <button className="p-3 bg-white border border-gray-200 rounded-full shadow-sm hover:bg-gray-50 hover:text-red-500 transition-colors">
                                <Heart size={20} />
                            </button>
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

                                <button className="w-full flex items-center justify-center gap-2 bg-brand-primary hover:bg-brand-secondary text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-brand-dark/20 transition-all hover:scale-[1.02] active:scale-[0.98] group">
                                    <Phone size={20} className="group-hover:animate-pulse" />
                                    Contact Owner
                                </button>

                                <p className="text-xs text-center text-gray-400 mt-4">
                                    By contacting, you agree to our Terms & Privacy Policy.
                                </p>

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
