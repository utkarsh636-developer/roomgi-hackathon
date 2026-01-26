import React, { useState } from 'react';

// Dummy data for property listings
const properties = [
  {
    id: 1,
    name: 'Sunshine PG for Girls',
    location: 'Koramangala, Bangalore',
    price: 8500,
    deposit: 15000,
    sharing: 'Double Sharing',
    gender: 'Girls',
    imageUrl: '/images/girls-room.jpg' // Assuming you have images in public/images
  },
  {
    id: 2,
    name: 'Zenith Student Hostel',
    location: 'HSR Layout, Bangalore',
    price: 7000,
    deposit: 10000,
    sharing: 'Triple Sharing',
    gender: 'Boys',
    imageUrl: '/images/pg-room.avif'
  },
  {
    id: 3,
    name: 'Pro-Stay for Working Professionals',
    location: 'Indiranagar, Bangalore',
    price: 12000,
    deposit: 25000,
    sharing: 'Single Room',
    gender: 'Both',
    imageUrl: '/images/room3.jpg'
  },
  {
    id: 4,
    name: 'Cozy Nook PG',
    location: 'Marathahalli, Bangalore',
    price: 6500,
    deposit: 10000,
    sharing: 'Double Sharing',
    gender: 'Girls',
    imageUrl: '/images/room4.jpg'
  }
];

// --- Sub-components for clarity ---

const PropertyCard = ({ property }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
    <img src={property.imageUrl} alt={property.name} className="w-full h-48 object-cover" />
    <div className="p-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-xl font-bold font-montserrat text-gray-800">{property.name}</h3>
        {property.gender && (
          <span className="text-xs font-semibold px-2 py-1 rounded-full bg-indigo-100 text-indigo-800">
            {property.gender}
          </span>
        )}
      </div>
      <p className="text-sm text-gray-500 mt-1">{property.location}</p>
      <div className="mt-4 flex justify-between items-center">
        <div>
          <p className="text-lg font-semibold text-gray-900">₹{property.price.toLocaleString()}<span className="text-sm font-normal text-gray-500">/bed</span></p>
          <p className="text-xs text-gray-500">Deposit: ₹{property.deposit.toLocaleString()}</p>
        </div>
        <p className="text-sm bg-gray-200 text-gray-700 px-2 py-1 rounded-full">{property.sharing}</p>
      </div>
      <button className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition">
        Contact Now
      </button>
    </div>
  </div>
);

const FilterSection = ({ title, children }) => (
  <div className="py-4 border-b border-gray-200">
    <h4 className="font-semibold mb-3 text-gray-800">{title}</h4>
    <div className="space-y-2">
      {children}
    </div>
  </div>
);

const Checkbox = ({ label }) => (
  <label className="flex items-center text-gray-600">
    <input type="checkbox" className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
    <span className="ml-2">{label}</span>
  </label>
);


// --- Main Explore Page Component ---

const ExplorePage = () => {
  const [budget, setBudget] = useState(15000);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const FilterContent = () => (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-2xl font-bold mb-4 border-b pb-4">Filters</h3>
      <FilterSection title="Budget">
        <div className="relative">
          <input 
            type="range" 
            min="5000" 
            max="25000" 
            step="500"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-indigo" 
          />
          <div className="flex justify-between text-sm text-gray-500 mt-2">
              <span>₹5k</span>
              <span className="font-semibold text-indigo-600">₹{Number(budget).toLocaleString()}</span>
              <span>₹25k+</span>
          </div>
        </div>
      </FilterSection>
      <FilterSection title="Available For">
        <Checkbox label="Girls" />
        <Checkbox label="Boys" />
        <Checkbox label="Both" />
        <Checkbox label="College Students" />
        <Checkbox label="Working Professionals" />
      </FilterSection>
      <FilterSection title="Sharing">
        <Checkbox label="Single" />
        <Checkbox label="Double" />
        <Checkbox label="Triple" />
      </FilterSection>
      <FilterSection title="Amenities">
        <Checkbox label="Wi-Fi" />
        <Checkbox label="AC" />
        <Checkbox label="Laundry" />
        <Checkbox label="Parking" />
      </FilterSection>
      <FilterSection title="Furnishing Status">
        <Checkbox label="Fully Furnished" />
        <Checkbox label="Semi-Furnished" />
        <Checkbox label="Unfurnished" />
      </FilterSection>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen pt-28">
      <div className="max-w-screen-xl mx-auto px-8 py-12 md:py-8">
        
        {/* Mobile Filter Button */}
        <div className="md:hidden mb-6">
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="w-full flex justify-between items-center p-4 bg-white rounded-lg shadow-md"
          >
            <span className="text-lg font-bold">Filters</span>
            <svg className={`w-6 h-6 transition-transform ${isFilterOpen ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {isFilterOpen && (
            <div className="mt-4">
              <FilterContent />
            </div>
          )}
        </div>

        <div className="flex flex-col md:flex-row md:gap-8">

          {/* Right Column: Filters (for Desktop) */}
          <div className="hidden md:block md:w-1/4">
            <div className="sticky top-28">
              <FilterContent />
            </div>
          </div>

          {/* Left Column: Listings */}
          <div className="md:w-3/4">
            <h2 className="text-3xl font-bold mb-6 text-gray-900 hidden md:block">Rooms & PGs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {properties.map(prop => <PropertyCard key={prop.id} property={prop} />)}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ExplorePage;
