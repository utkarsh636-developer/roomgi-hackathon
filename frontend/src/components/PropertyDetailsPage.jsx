import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    MapPin, Wifi, Wind, Coffee, Share2, Heart, Star,
    CheckCircle, ArrowLeft, Calendar, User, ShieldCheck,
    Bath, BedDouble, Home, Maximize, Phone, Utensils, Car, Thermometer, Camera, Dumbbell, Activity
} from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';

const PropertyDetailsPage = () => {
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState('overview');
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);

    // Mock Data (In a real app, fetch based on ID)
    const property = {
        id: 1,
        name: 'Sunshine Premium Stays',
        location: 'Koramangala 4th Block, Bangalore',
        price: 12000,
        deposit: 25000,
        rating: 4.8,
        reviews: 124,
        type: 'Co-living',
        gender: 'Unisex',
        verified: true,
        images: [
            '/images/landing-page2-upscaled.jpg', // Main
            '/images/girls-room.jpg',
            'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1555854743-e3c771764658?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800'
        ],
        amenities: [
            { icon: Wifi, name: 'High-Speed Wifi' },
            { icon: Wind, name: 'Air Conditioning' },
            { icon: Coffee, name: 'Breakfast & Dinner' },
            { icon: Utensils, name: 'Shared Kitchen' },
            { icon: Bath, name: 'Attached Washroom' },
            { icon: Thermometer, name: 'Hot Water/Geyser' },
            { icon: Home, name: 'Daily Housekeeping' },
            { icon: Camera, name: 'CCTV Surveillance' },
            { icon: User, name: '24/7 Security' },
            { icon: Car, name: 'Parking Available' },
            { icon: Dumbbell, name: 'Gym & Fitness' },
            { icon: Activity, name: 'Sports Area' },
        ],
        highlights: [
            { label: 'Room Type', value: 'Double Sharing' },
            { label: 'Furnishing', value: 'Fully Furnished' },
            { label: 'Food', value: 'Both Veg & Non-Veg' },
            { label: 'Building Type', value: 'Standalone' },
        ],
        owner: {
            name: "Arvind Piprewar",
            listings: 48,
            localities: "Koramangala, Indiranagar, HSR",
            rera: "A51900000000"
        },
        description: "Experience premium student living at Sunshine Stays. Located in the heart of Koramangala, we offer fully furnished rooms designed for comfort and productivity. Our property features a dedicated study lounge, high-speed internet, and nutritious home-style meals. With 24/7 security and biometric access, your safety is our priority."
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 font-montserrat">
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
                            {property.images.map((img, idx) => (
                                <img key={idx} src={img} alt={`Gallery ${idx}`} className="w-full h-auto rounded-xl shadow-2xl" />
                            ))}
                        </div>
                    </div>
                )}

                {/* Top Navigation / Breadcrumbs */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
                    <Link to="/explore" className="inline-flex items-center text-gray-500 hover:text-indigo-600 transition-colors mb-4 text-sm font-medium">
                        <ArrowLeft size={16} className="mr-2" /> Back to Explore
                    </Link>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold uppercase tracking-wide">
                                    {property.type}
                                </span>
                                {property.verified && (
                                    <span className="flex items-center gap-1 px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-xs font-bold uppercase tracking-wide">
                                        <ShieldCheck size={14} /> Verified Property
                                    </span>
                                )}
                            </div>
                            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
                                {property.name}
                            </h1>
                            <div className="flex items-center gap-2 text-gray-500 mt-2 text-sm md:text-base">
                                <MapPin size={18} className="text-indigo-500" />
                                {property.location}
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button className="p-3 bg-white border border-gray-200 rounded-full shadow-sm hover:bg-gray-50 hover:text-red-500 transition-colors">
                                <Heart size={20} />
                            </button>
                            <button className="p-3 bg-white border border-gray-200 rounded-full shadow-sm hover:bg-gray-50 hover:text-indigo-500 transition-colors">
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
                            <img src={property.images[0]} alt="Main" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                        </div>

                        {/* Right column top image */}
                        <div className="hidden md:block relative group cursor-pointer overflow-hidden" onClick={() => setIsGalleryOpen(true)}>
                            <img src={property.images[1]} alt="Sub 1" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        </div>

                        {/* Right column top-right image */}
                        <div className="hidden md:block relative group cursor-pointer overflow-hidden" onClick={() => setIsGalleryOpen(true)}>
                            <img src={property.images[2]} alt="Sub 2" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        </div>

                        {/* Right column bottom image */}
                        <div className="hidden md:block relative group cursor-pointer overflow-hidden" onClick={() => setIsGalleryOpen(true)}>
                            <img src={property.images[3]} alt="Sub 3" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        </div>

                        {/* View All Overlay Button Image */}
                        <div className="hidden md:block relative group cursor-pointer overflow-hidden" onClick={() => setIsGalleryOpen(true)}>
                            <img src={property.images[4]} alt="Sub 4" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center hover:bg-black/50 transition-colors">
                                <span className="text-white font-bold flex items-center gap-2">
                                    <Maximize size={18} /> View All
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
                                {property.highlights.map((item, idx) => (
                                    <div key={idx} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:-translate-y-1 transition-transform">
                                        <span className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-1">{item.label}</span>
                                        <span className="text-gray-800 font-bold text-sm md:text-base">{item.value}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Description */}
                            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">About the Property</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {property.description}
                                </p>
                            </div>

                            {/* Amenities */}
                            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                                <h3 className="text-xl font-bold text-gray-900 mb-6">Amenity Highlights</h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-4">
                                    {property.amenities.map((amenity, idx) => (
                                        <div key={idx} className="flex items-center gap-3 text-gray-700">
                                            <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                                                <amenity.icon size={20} />
                                            </div>
                                            <span className="font-medium text-sm">{amenity.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Reviews Preview (Placeholder) */}
                            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-bold text-gray-900">Guest Reviews</h3>
                                    <div className="flex items-center gap-2">
                                        <Star size={20} className="text-yellow-400 fill-current" />
                                        <span className="font-bold text-lg">{property.rating}</span>
                                        <span className="text-gray-400">({property.reviews} reviews)</span>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-500 text-xs">RK</div>
                                            <div>
                                                <p className="font-bold text-sm text-gray-900">Riya Kapoor</p>
                                                <p className="text-xs text-gray-400">Posted 2 days ago</p>
                                            </div>
                                        </div>
                                        <p className="text-gray-600 text-sm">Ideally located and super clean! The Wifi is actually fast, which is rare.</p>
                                    </div>
                                </div>
                                <button className="mt-4 text-indigo-600 font-bold text-sm hover:underline">View all reviews</button>
                            </div>

                        </div>

                        {/* Right Column: Sticky Owner/Pricing Card */}
                        <div className="w-full lg:w-1/3">
                            <div className="sticky top-28 bg-white p-6 rounded-3xl shadow-xl border border-gray-100">
                                <div className="flex justify-between items-end mb-6">
                                    <div>
                                        <span className="text-sm text-gray-400 block mb-1">Rent/Month</span>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-3xl font-extrabold text-gray-900">₹{property.price.toLocaleString()}</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xs text-gray-400 block">Security Deposit</span>
                                        <span className="font-bold text-gray-700">₹{property.deposit.toLocaleString()}</span>
                                    </div>
                                </div>

                                <hr className="border-gray-100 mb-6" />

                                <div className="mb-6">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden border-2 border-white shadow-md">
                                            <div className="w-full h-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-2xl">
                                                {property.owner?.name.charAt(0)}
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-bold text-gray-900">{property.owner?.name}</h4>
                                            <p className="text-xs text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded inline-block mt-1 border border-green-100">RERA VERIFIED</p>
                                        </div>
                                    </div>

                                    <div className="space-y-3 p-4 bg-gray-50 rounded-2xl border border-gray-100 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">RERA ID</span>
                                            <span className="font-medium text-gray-900">{property.owner?.rera}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Properties Listed</span>
                                            <span className="font-medium text-gray-900">{property.owner?.listings}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500 block mb-1">Active Localities</span>
                                            <span className="font-medium text-gray-900">{property.owner?.localities}</span>
                                        </div>
                                    </div>
                                </div>

                                <button className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-indigo-600/20 transition-all hover:scale-[1.02] active:scale-[0.98] group">
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
