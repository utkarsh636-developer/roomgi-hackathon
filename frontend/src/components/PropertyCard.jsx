import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Wifi, Wind, Coffee, BadgeCheck, Heart, Share2, Phone } from 'lucide-react';
import authService from '../services/authService';

const PropertyCard = ({ property }) => {
  const {
    name,
    location,
    price,
    rent,
    deposit,
    securityDeposit,
    sharing,
    gender,
    images = [],
    isVerified,
    amenities = []
  } = property;

  // Normalize data
  const displayPrice = price || rent || 0;
  const displayDeposit = deposit || securityDeposit || 0;
  const displayImage = images?.[0]?.url || property.imageUrl || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=800';
  const displayLocation = location?.addressLine || location?.city || location || 'Unknown Location';
  // Check for nested capacity object or flat property
  // Check for nested capacity object or flat property
  const displayCapacity = property.capacity?.total || property.capacity || '2+';

  const [isLiked, setIsLiked] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    if (currentUser && currentUser.favorites) {
      setIsLiked(currentUser.favorites.includes(property._id));
    }
  }, [property._id]);

  const handleLike = async (e) => {
    e.preventDefault(); // Prevent Link navigation
    e.stopPropagation();
    if (!user) {
      alert("Please login to like properties");
      return;
    }

    try {
      setIsLiked(!isLiked); // Optimistic UI update
      await authService.toggleFavorite(property._id);
    } catch (error) {
      setIsLiked(!isLiked); // Revert on error
      console.error("Failed to toggle favorite", error);
    }
  };

  return (
    <div className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      {/* Image Container */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={displayImage}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Verified Badge */}
        {isVerified && (
          <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1 shadow-sm border border-green-50">
            <BadgeCheck className="w-4 h-4 text-blue-500 fill-blue-50" />
            <span className="text-xs font-bold text-gray-700 font-montserrat tracking-wide">VERIFIED</span>
          </div>
        )}

        {/* Occupancy Tag */}
        <div className="absolute top-3 right-3 px-3 py-1 bg-white/95 backdrop-blur-sm rounded-full text-xs font-bold tracking-wide shadow-sm border border-gray-100 flex items-center gap-1 text-gray-700">
          <span className="text-indigo-600">👥</span> {displayCapacity} Occupancy
        </div>

        {/* Overlay Gradients */}
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/60 to-transparent" />

        <div className="absolute bottom-3 left-3 text-white">
          <p className="flex items-center text-xs opacity-90 mb-0.5">
            <MapPin className="w-3 h-3 mr-1" />
            {displayLocation}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-gray-900 font-montserrat leading-tight truncate pr-2" title={name}>
            {name}
          </h3>
          {(!user || user.role !== 'owner') && (
            <button
              onClick={handleLike}
              className={`transition-colors ${isLiked ? 'text-red-500 fill-current' : 'text-gray-400 hover:text-pink-500'}`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
            </button>
          )}
        </div>

        {/* Price Section */}
        <div className="flex items-baseline gap-1 mb-4">
          <span className="text-2xl font-bold text-indigo-600">₹{displayPrice.toLocaleString()}</span>
          <span className="text-gray-500 text-sm font-medium">/month</span>
          {displayDeposit > 0 && (
            <span className="text-xs text-gray-400 ml-2 border-l pl-2 border-gray-300">
              Dep: ₹{(displayDeposit / 1000).toFixed(1)}k
            </span>
          )}
        </div>

        {/* Amenities Preview */}
        <div className="flex flex-wrap gap-2 mb-5 border-y border-gray-50 py-3">
          {amenities.length > 0 ? (
            amenities.slice(0, 3).map((amenity, index) => {
              // Simple mapping helper inside selection
              const getIcon = (a) => {
                const lower = a.toLowerCase();
                if (lower.includes('wifi')) return <Wifi className="w-3.5 h-3.5" />;
                if (lower.includes('ac')) return <Wind className="w-3.5 h-3.5" />;
                if (lower.includes('food') || lower.includes('mess')) return <Coffee className="w-3.5 h-3.5" />;
                return <BadgeCheck className="w-3.5 h-3.5" />;
              };

              return (
                <div key={index} className="flex items-center gap-1.5 text-xs font-medium text-gray-600 bg-gray-50 px-2 py-1 rounded whitespace-nowrap">
                  {getIcon(amenity)} {amenity.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                </div>
              );
            })
          ) : (
            <div className="text-xs text-gray-400 italic">No amenities listed</div>
          )}
          {amenities.length > 3 && (
            <div className="flex items-center text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
              +{amenities.length - 3} more
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Link to={`/property/${property._id}`} className="flex items-center justify-center gap-2 border border-indigo-600 text-indigo-600 py-2.5 rounded-xl font-semibold text-sm hover:bg-indigo-50 transition-colors">
            View Details
          </Link>
          <button className="flex items-center justify-center gap-2 bg-indigo-600 text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-indigo-700 shadow-md hover:shadow-indigo-200 transition-all">
            <Phone className="w-4 h-4" />
            Contact
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
