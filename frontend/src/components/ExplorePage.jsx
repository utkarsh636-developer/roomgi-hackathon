import React, { useState, useEffect } from 'react';
import PropertyCard from './PropertyCard';
import { Map, List, Filter, Search, Loader } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';
import propertyService from '../services/propertyService';

const FilterSection = ({ title, children }) => (
  <div className="py-5 border-b border-gray-100 last:border-0">
    <h4 className="font-bold mb-4 text-gray-800 text-sm tracking-wide uppercase">{title}</h4>
    <div className="space-y-3">
      {children}
    </div>
  </div>
);

const Checkbox = ({ label }) => (
  <label className="flex items-center text-gray-600 cursor-pointer hover:text-indigo-600 transition-colors">
    <div className="relative flex items-center">
      <input type="checkbox" className="peer h-5 w-5 text-indigo-600 border-2 border-gray-300 rounded focus:ring-indigo-500 checked:bg-indigo-600 checked:border-indigo-600 transition-all" />
      <svg className="absolute w-3.5 h-3.5 text-white hidden peer-checked:block left-1 top-1 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
    </div>
    <span className="ml-3 text-sm font-medium">{label}</span>
  </label>
);

const AMENITIES_LIST = [
  "wifi", "ac", "non_ac", "furnished", "semi_furnished", "unfurnished",
  "balcony", "garden", "terrace", "parking", "covered_parking",
  "power_backup", "water_supply_24x7", "water_geaser", "gas",
  "mess", "shared_kitchen", "private_kitchen", "refrigerator", "gas_stove",
  "gym", "yoga_room", "cctv", "security_guard", "laundry", "housekeeping",
  "tv_cable", "internet_high_speed", "pet_friendly", "smoking_allowed", "drinking_allowed"
];

const ExplorePage = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [budget, setBudget] = useState(25000); // Default max budget
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [showAllAmenities, setShowAllAmenities] = useState(false);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const data = await propertyService.getAllProperties();
      // The API returns { success: true, data: [...] } or just [...] depend on backend implementation
      // Assuming it might be nested in data based on other endpoints, but propertyService.getAllProperties returns response.data
      // Let's assume response.data is the array or { data: [] }
      // Adjusting based on common patterns. If response.data is the payload, check if it has a .data property
      setProperties(data.data || data || []);
    } catch (err) {
      console.error("Failed to fetch properties:", err);
      // Fallback to empty list or handle error
      setError("Failed to load properties. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const FilterContent = () => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full">
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
        <h3 className="text-xl font-bold text-gray-900 font-montserrat">Filters</h3>
        <button onClick={() => setBudget(25000)} className="text-sm text-indigo-600 font-semibold hover:text-indigo-800">Reset</button>
      </div>

      <FilterSection title="Budget Range">
        <div className="relative pt-2">
          <input
            type="range"
            min="5000"
            max="50000"
            step="500"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="w-full h-2 bg-gray-200 rounded-lg cursor-pointer accent-indigo-600"
          />
          <div className="flex justify-between text-sm text-gray-500 mt-3 font-medium">
            <span>₹5k</span>
            <span className="text-indigo-600 bg-indigo-50 px-2 py-1 rounded">₹{Number(budget).toLocaleString()}</span>
            <span>₹50k+</span>
          </div>
        </div>
      </FilterSection>

      <FilterSection title="Property Type">
        <Checkbox label="Flat / Apartment" />
        <Checkbox label="PG" />
        <Checkbox label="Hostel" />
      </FilterSection>

      <FilterSection title="Amenities">
        <div className="space-y-3">
          {AMENITIES_LIST.slice(0, showAllAmenities ? AMENITIES_LIST.length : 5).map(amenity => (
            <Checkbox key={amenity} label={amenity.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())} />
          ))}
        </div>
        <button
          onClick={() => setShowAllAmenities(!showAllAmenities)}
          className="mt-3 text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1"
        >
          {showAllAmenities ? 'Show Less' : 'Show More...'}
        </button>
      </FilterSection>
    </div>
  );

  return (
    <div className="bg-slate-50 min-h-screen pt-24 font-sans">
      <Navbar />
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Page Header & Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 font-montserrat">
              Explore
              <span className="text-indigo-600 ml-2">Stays</span>
            </h1>
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            {/* Search Bar */}
            <div className="relative flex-grow md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by area, college..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all outline-none"
              />
            </div>

            {/* Map Toggle (Desktop) */}
            <div className="bg-white p-1 rounded-xl border border-gray-200 hidden md:flex">
              <button
                onClick={() => setShowMap(false)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${!showMap ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
              >
                <List className="w-4 h-4" /> List
              </button>
              <button
                onClick={() => setShowMap(true)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${showMap ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
              >
                <Map className="w-4 h-4" /> Map
              </button>
            </div>

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="md:hidden flex items-center justify-center p-3 bg-white border border-gray-200 rounded-xl text-gray-700"
            >
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Filter Drawer (Conditional) */}
        {isFilterOpen && (
          <div className="md:hidden mb-6 animate-in slide-in-from-top-2 duration-200">
            <FilterContent />
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">

          {/* Sidebar Filters */}
          <div className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-28">
              <FilterContent />
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-grow">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
                <p className="text-gray-500 font-medium">Loading properties...</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <p className="text-red-500 font-bold mb-2">Oops!</p>
                <p className="text-gray-500">{error}</p>
              </div>
            ) : properties.length > 0 ? (
              showMap ? (
                // Placeholder for Map View
                <div className="bg-white rounded-2xl h-[600px] flex flex-col items-center justify-center border border-gray-200 p-8 text-center">
                  <div className="bg-indigo-50 p-6 rounded-full mb-6">
                    <Map className="w-12 h-12 text-indigo-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Map View Coming Soon</h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    We are integrating Google Maps to show you verified properties near your college or office.
                  </p>
                  <button
                    onClick={() => setShowMap(false)}
                    className="mt-6 px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
                  >
                    Switch to List View
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {properties
                    .filter(prop => {
                      // Basic client-side filter for budget if API doesn't handle it yet
                      // Ensure property.price exists and is a number, assume rent is price
                      // You might need to adjust field names based on API response (rent vs price)
                      const price = Number(prop.rent || prop.price || 0);
                      return price <= Number(budget);
                    })
                    .map(prop => <PropertyCard key={prop._id || prop.id} property={prop} />)}
                </div>
              )
            ) : (
              // Empty State
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <img src="/images/no-results.svg" alt="No Data" className="w-64 h-64 mb-6 opacity-80" />
                <h3 className="text-2xl font-bold text-gray-800">No Properties Found</h3>
                <p className="text-gray-500 mt-2">Try adjusting your filters or search for a different area.</p>
                <button onClick={() => setBudget(25000)} className="mt-6 text-indigo-600 font-semibold hover:underline">
                  Clear Filters
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ExplorePage;
