import React, { useState, useEffect } from 'react';
import PropertyCard from './PropertyCard';
import PropertyMapView from './PropertyMapView';
import MapSearchModal from './MapSearchModal';
import { Map, List, Filter, Search, Loader, MapPin, X } from 'lucide-react';
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
  <label className="flex items-center text-gray-600 cursor-pointer hover:text-brand-primary transition-colors">
    <div className="relative flex items-center">
      <input type="checkbox" className="peer h-5 w-5 text-brand-primary border-2 border-gray-300 rounded focus:ring-brand-primary checked:bg-brand-primary checked:border-brand-primary transition-all" />
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
  /* ------------------------------------------------------------
   * STATE
   * ------------------------------------------------------------ */
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  // Initialize budget with a high value or handle it as 'max'
  const [budget, setBudget] = useState(50000);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState([]);

  // UI State
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [showAllAmenities, setShowAllAmenities] = useState(false);

  // Map Search State
  const [mapSearchActive, setMapSearchActive] = useState(false);
  const [mapSearchParams, setMapSearchParams] = useState(null); // { lat, lng, radius }
  const [showMapSearchModal, setShowMapSearchModal] = useState(false);

  /* ------------------------------------------------------------
   * FETCH LOGIC
   * ------------------------------------------------------------ */
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchProperties();
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [budget, searchQuery, selectedType, selectedAmenities, mapSearchParams]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {};

      // Only add params if they restrict the search
      if (budget < 50000) {
        params.maxRent = budget;
      }

      if (searchQuery.trim()) {
        params.preferences = searchQuery;
      }

      if (selectedType) {
        params.type = selectedType;
      }

      if (selectedAmenities.length > 0) {
        params.amenities = selectedAmenities.join(',');
      }

      // Add map search parameters if active
      if (mapSearchParams) {
        if (mapSearchParams.lat && mapSearchParams.lng) {
          // Address search with lat/lng/radius
          params.lat = mapSearchParams.lat;
          params.lng = mapSearchParams.lng;
          params.maxDistance = mapSearchParams.radius;
        } else {
          // Location search with city/state/pincode
          if (mapSearchParams.city) params.city = mapSearchParams.city;
          if (mapSearchParams.state) params.state = mapSearchParams.state;
          if (mapSearchParams.pincode) params.pincode = mapSearchParams.pincode;
        }
      }

      const data = await propertyService.getAllProperties(params);
      setProperties(data.data || data || []);
    } catch (err) {
      console.error("Failed to fetch properties:", err);
      // Don't show error on empty search, just show empty list or generic message if critical
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  /* ------------------------------------------------------------
   * HANDLERS
   * ------------------------------------------------------------ */
  const handleTypeChange = (type) => {
    setSelectedType(prev => prev === type.toLowerCase() ? '' : type.toLowerCase());
  };

  const handleAmenityChange = (amenity) => {
    setSelectedAmenities(prev => {
      if (prev.includes(amenity)) {
        return prev.filter(a => a !== amenity);
      } else {
        return [...prev, amenity];
      }
    });
  };

  const handleResetFilters = () => {
    setBudget(50000);
    setSearchQuery('');
    setSelectedType('');
    setSelectedAmenities([]);
    setMapSearchParams(null);
    setMapSearchActive(false);
  };

  const handleApplyMapSearch = (searchData) => {
    setMapSearchParams(searchData);
    setMapSearchActive(true);
    setShowMapSearchModal(false);
  };

  const handleClearMapSearch = () => {
    setMapSearchParams(null);
    setMapSearchActive(false);
  };

  const FilterContent = () => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full overflow-y-auto max-h-[calc(100vh-140px)] sticky-sidebar">
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
        <h3 className="text-xl font-bold text-gray-900 font-montserrat">Filters</h3>
        <button onClick={handleResetFilters} className="text-sm text-brand-primary font-semibold hover:text-brand-secondary">Reset</button>
      </div>

      <FilterSection title="Budget Range (Max)">
        <div className="relative pt-2">
          <input
            type="range"
            min="2000"
            max="50000"
            step="1000"
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg cursor-pointer accent-brand-primary"
          />
          <div className="flex justify-between text-sm text-gray-500 mt-3 font-medium">
            <span>₹2k</span>
            <span className="text-brand-primary bg-brand-primary/10 px-2 py-1 rounded">
              {budget >= 50000 ? '50k+' : `₹${budget.toLocaleString()}`}
            </span>
            <span>₹50k+</span>
          </div>
        </div>
      </FilterSection>

      <FilterSection title="Property Type">
        <div className="space-y-3">
          {['Flat', 'PG', 'Hostel'].map((type) => (
            <label key={type} className="flex items-center text-gray-600 cursor-pointer hover:text-brand-primary transition-colors">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  checked={selectedType === type.toLowerCase()}
                  onChange={() => handleTypeChange(type)}
                  className="peer h-5 w-5 text-brand-primary border-2 border-gray-300 rounded focus:ring-brand-primary checked:bg-brand-primary checked:border-brand-primary transition-all"
                />
                <svg className="absolute w-3.5 h-3.5 text-white hidden peer-checked:block left-1 top-1 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <span className="ml-3 text-sm font-medium">{type}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Amenities">
        <div className="space-y-3">
          {AMENITIES_LIST.slice(0, showAllAmenities ? AMENITIES_LIST.length : 5).map(amenity => (
            <label key={amenity} className="flex items-center text-gray-600 cursor-pointer hover:text-brand-primary transition-colors">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  checked={selectedAmenities.includes(amenity)}
                  onChange={() => handleAmenityChange(amenity)}
                  className="peer h-5 w-5 text-brand-primary border-2 border-gray-300 rounded focus:ring-brand-primary checked:bg-brand-primary checked:border-brand-primary transition-all"
                />
                <svg className="absolute w-3.5 h-3.5 text-white hidden peer-checked:block left-1 top-1 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <span className="ml-3 text-sm font-medium">{amenity.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</span>
            </label>
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
    <div className="bg-brand-bg min-h-screen pt-24 font-sans">
      <Navbar />
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Page Header & Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 font-montserrat">
              Explore
              <span className="text-brand-primary ml-2">Stays</span>
            </h1>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Search Bar */}
            {/* Location Search (Replaces Search Bar) */}
            {/* Location Search (Replaces Search Bar) */}
            <div className="relative flex-grow md:flex-grow-0 z-20">
              {!mapSearchActive ? (
                <button
                  onClick={() => setShowMapSearchModal(true)}
                  className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-brand-primary text-white rounded-lg font-medium hover:shadow-lg hover:bg-brand-primary/90 transition-all text-sm"
                >
                  <MapPin className="w-4 h-4" />
                  Search by Map
                </button>
              ) : (
                <div className="flex items-center bg-brand-primary text-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all">
                  <button
                    onClick={() => setShowMapSearchModal(true)}
                    className="flex items-center gap-2 px-4 py-3 hover:bg-white/10 transition-colors text-sm font-medium"
                    title="Update Search Location"
                  >
                    <MapPin className="w-4 h-4" />
                    <span className="max-w-[150px] truncate">
                      {mapSearchParams.radius
                        ? `Within ${mapSearchParams.radius}km`
                        : (mapSearchParams.city || mapSearchParams.state || 'Location Selected')
                      }
                    </span>
                  </button>
                  <div className="w-[1px] h-5 bg-white/20"></div>
                  <button
                    onClick={handleClearMapSearch}
                    className="px-3 py-3 hover:bg-white/10 transition-colors"
                    title="Clear Search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Map Toggle (Desktop) */}
            <div className="bg-white p-1 rounded-xl border border-gray-200 hidden md:flex">
              <button
                onClick={() => setShowMap(false)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${!showMap ? 'bg-brand-primary text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
              >
                <List className="w-4 h-4" /> List
              </button>
              <button
                onClick={() => setShowMap(true)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${showMap ? 'bg-brand-primary text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
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
                <Loader className="w-10 h-10 text-brand-primary animate-spin mb-4" />
                <p className="text-gray-500 font-medium">Loading properties...</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <p className="text-red-500 font-bold mb-2">Oops!</p>
                <p className="text-gray-500">{error}</p>
              </div>
            ) : properties.length > 0 ? (
              showMap ? (
                <PropertyMapView properties={properties} />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {properties.map(prop => <PropertyCard key={prop._id || prop.id} property={prop} />)}
                </div>
              )
            ) : (
              // Empty State
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <img src="/images/no-results.svg" alt="No Data" className="w-64 h-64 mb-6 opacity-80" />
                <h3 className="text-2xl font-bold text-gray-800">No Properties Found</h3>
                <p className="text-gray-500 mt-2">Try adjusting your filters or search for a different area.</p>
                <button onClick={handleResetFilters} className="mt-6 text-brand-primary font-semibold hover:underline">
                  Clear Filters
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
      <Footer />

      {/* Map Search Modal */}
      <MapSearchModal
        isOpen={showMapSearchModal}
        onClose={() => setShowMapSearchModal(false)}
        onApplySearch={handleApplyMapSearch}
        initialLocation={mapSearchParams}
      />
    </div>
  );
};

export default ExplorePage;
