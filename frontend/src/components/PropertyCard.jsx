import React from 'react';
import { MapPin, Wifi, Wind, Coffee, BadgeCheck, Heart, Share2, Phone } from 'lucide-react';

const PropertyCard = ({ property }) => {
  const { 
    name, 
    location, 
    price, 
    deposit, 
    sharing, 
    gender, 
    imageUrl, 
    isVerified, 
    amenities = [] 
  } = property;

  return (
    <div className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      {/* Image Container */}
      <div className="relative h-56 overflow-hidden">
        <img 
          src={imageUrl} 
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

        {/* Gender Tag */}
        <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold tracking-wide shadow-sm
          ${gender === 'Girls' ? 'bg-pink-50 text-pink-600 border border-pink-100' : 
            gender === 'Boys' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 
            'bg-purple-50 text-purple-600 border border-purple-100'}`}>
          {gender}
        </div>

        {/* Overlay Gradients */}
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/60 to-transparent" />
        
        <div className="absolute bottom-3 left-3 text-white">
          <p className="flex items-center text-xs opacity-90 mb-0.5">
            <MapPin className="w-3 h-3 mr-1" />
            {location}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-gray-900 font-montserrat leading-tight truncate pr-2" title={name}>
            {name}
          </h3>
          <button className="text-gray-400 hover:text-pink-500 transition-colors">
            <Heart className="w-5 h-5" />
          </button>
        </div>

        {/* Price Section */}
        <div className="flex items-baseline gap-1 mb-4">
          <span className="text-2xl font-bold text-indigo-600">₹{price.toLocaleString()}</span>
          <span className="text-gray-500 text-sm font-medium">/month</span>
          {deposit > 0 && (
             <span className="text-xs text-gray-400 ml-2 border-l pl-2 border-gray-300">
               Dep: ₹{(deposit / 1000).toFixed(1)}k
             </span>
          )}
        </div>

        {/* Amenities Preview */}
        <div className="flex gap-3 mb-5 border-y border-gray-50 py-3">
            <div className="flex items-center gap-1.5 text-xs font-medium text-gray-600 bg-gray-50 px-2 py-1 rounded">
                <Wind className="w-3.5 h-3.5" /> AC
            </div>
            <div className="flex items-center gap-1.5 text-xs font-medium text-gray-600 bg-gray-50 px-2 py-1 rounded">
                <Wifi className="w-3.5 h-3.5" /> Wi-Fi
            </div>
            <div className="flex items-center gap-1.5 text-xs font-medium text-gray-600 bg-gray-50 px-2 py-1 rounded">
                <Coffee className="w-3.5 h-3.5" /> Food
            </div>
             <div className="flex items-center gap-1.5 text-xs font-medium text-gray-600 bg-gray-50 px-2 py-1 rounded ml-auto">
                {sharing}
            </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button className="flex items-center justify-center gap-2 border border-indigo-600 text-indigo-600 py-2.5 rounded-xl font-semibold text-sm hover:bg-indigo-50 transition-colors">
            View Details
          </button>
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
