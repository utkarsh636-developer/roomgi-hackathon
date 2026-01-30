import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Circle, useMap, GeoJSON } from 'react-leaflet';
import { Search, MapPin, X, Loader, Navigation } from 'lucide-react';
import { searchAddress } from '../utils/geocoding';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to update map view when position changes
const MapUpdater = ({ center, zoom }) => {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  
  return null;
};

// Draggable marker component
const DraggableMarker = ({ position, onPositionChange }) => {
  const markerRef = useRef(null);

  const eventHandlers = {
    dragend() {
      const marker = markerRef.current;
      if (marker != null) {
        const newPos = marker.getLatLng();
        onPositionChange([newPos.lat, newPos.lng]);
      }
    },
  };

  return (
    <Marker
      draggable={true}
      eventHandlers={eventHandlers}
      position={position}
      ref={markerRef}
    />
  );
};

const MapSearchModal = ({ isOpen, onClose, onApplySearch, initialLocation = null }) => {
  // Default location: Delhi, India
  const defaultCenter = [28.6139, 77.2090];
  const defaultRadius = 5; // 5km default

  const [center, setCenter] = useState(
    initialLocation ? [initialLocation.lat, initialLocation.lng] : defaultCenter
  );
  const [markerPosition, setMarkerPosition] = useState(
    initialLocation ? [initialLocation.lat, initialLocation.lng] : defaultCenter
  );
  const [radius, setRadius] = useState(initialLocation?.radius || defaultRadius);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [zoom, setZoom] = useState(13);
  const [searchType, setSearchType] = useState('address'); // 'address' or 'location'
  const [showTypeMenu, setShowTypeMenu] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null); // {city, state, pincode, type}
  const [boundaryGeoJSON, setBoundaryGeoJSON] = useState(null); // GeoJSON polygon for region

  // Fetch GeoJSON boundary for a location
  const fetchBoundary = async (displayName, osmType, osmId) => {
    try {
      console.log('Fetching boundary for:', displayName, osmType, osmId);
      // Use Nominatim's polygon API to get boundary
      const url = `https://nominatim.openstreetmap.org/lookup?osm_ids=${osmType}${osmId}&polygon_geojson=1&format=json`;
      console.log('Boundary URL:', url);
      
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'RoomGi Property Listing App'
        }
      });
      
      const data = await response.json();
      console.log('Boundary data:', data);
      
      if (data && data[0] && data[0].geojson) {
        console.log('Boundary GeoJSON found:', data[0].geojson);
        return data[0].geojson;
      } else {
        console.log('No GeoJSON boundary available for this location');
      }
    } catch (error) {
      console.error('Failed to fetch boundary:', error);
    }
    return null;
  };

  // Search for addresses with debounce
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (searchQuery.length >= 2) {
        setIsSearching(true);
        
        // Modify search query based on type for better results
        let searchTerm = searchQuery;
        if (searchType === 'location') {
          // Only append India if not already in the query
          if (!searchQuery.toLowerCase().includes('india')) {
            searchTerm = `${searchQuery}, India`;
          }
        }
        
        console.log('Searching for:', searchTerm);
        const results = await searchAddress(searchTerm);
        console.log('Raw results:', results);
        
        // For location search, show all results (don't filter by address fields)
        // The Nominatim API already returns relevant results
        let filteredResults = results;
        if (searchType === 'location' && results.length > 0) {
          // Just sort by relevance - results with matching city/state first
          filteredResults = results.sort((a, b) => {
            const aAddr = a.address || {};
            const bAddr = b.address || {};
            const query = searchQuery.toLowerCase();
            
            const aCity = (aAddr.city || aAddr.town || aAddr.village || '').toLowerCase();
            const bCity = (bAddr.city || bAddr.town || bAddr.village || '').toLowerCase();
            const aState = (aAddr.state || '').toLowerCase();
            const bState = (bAddr.state || '').toLowerCase();
            
            // Prioritize exact city matches
            if (aCity === query && bCity !== query) return -1;
            if (aCity !== query && bCity === query) return 1;
            
            // Then state matches
            if (aState === query && bState !== query) return -1;
            if (aState !== query && bState === query) return 1;
            
            // Then partial matches
            if (aCity.includes(query) && !bCity.includes(query)) return -1;
            if (!aCity.includes(query) && bCity.includes(query)) return 1;
            
            return 0;
          });
        }
        
        console.log('Filtered results:', filteredResults);
        setSearchResults(filteredResults);
        setIsSearching(false);
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, searchType]);

  // Handle search result selection
  const handleSelectResult = async (result) => {
    const newPosition = [result.lat, result.lon];
    setMarkerPosition(newPosition);
    setCenter(newPosition);
    
    const addr = result.address || {};
    
    if (searchType === 'location') {
      // Extract location details
      const city = addr.city || addr.town || addr.village || '';
      const state = addr.state || '';
      const pincode = addr.postcode || '';
      
      // Determine location type
      let locationType = 'city';
      if (state && !city) {
        locationType = 'state';
        setZoom(7);
      } else if (pincode) {
        locationType = 'pincode';
        setZoom(14);
      } else {
        setZoom(12);
      }
      
      setSelectedLocation({ city, state, pincode, type: locationType });
      
      // Fetch and display boundary
      if (result.osm_type && result.osm_id) {
        const boundary = await fetchBoundary(result.display_name, result.osm_type[0].toUpperCase(), result.osm_id);
        setBoundaryGeoJSON(boundary);
      }
    } else {
      setZoom(15);
      setSelectedLocation(null);
      setBoundaryGeoJSON(null);
    }
    
    setSearchQuery('');
    setSearchResults([]);
  };

  // Handle marker drag
  const handleMarkerDrag = (newPosition) => {
    setMarkerPosition(newPosition);
  };

  // Apply search
  const handleApply = () => {
    if (searchType === 'address' && markerPosition) {
      // For address search, send lat/lng/radius
      onApplySearch({
        lat: markerPosition[0],
        lng: markerPosition[1],
        radius: radius
      });
    } else if (searchType === 'location' && selectedLocation) {
      // For location search, send city/state/pincode
      onApplySearch({
        city: selectedLocation.city || undefined,
        state: selectedLocation.state || undefined,
        pincode: selectedLocation.pincode || undefined,
        locationType: selectedLocation.type
      });
    }
  };

  // Clear search
  const handleClear = () => {
    setMarkerPosition(defaultCenter);
    setCenter(defaultCenter);
    setRadius(defaultRadius);
    setZoom(13);
    setSearchQuery('');
    setSearchResults([]);
    setSearchType('address');
    setSelectedLocation(null);
    setBoundaryGeoJSON(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full h-[90vh] overflow-hidden relative">
        
        {/* Full-screen Map */}
        <MapContainer
          center={center}
          zoom={zoom}
          style={{ height: '100%', width: '100%' }}
          className="z-0 rounded-2xl"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapUpdater center={center} zoom={zoom} />
          <DraggableMarker 
            position={markerPosition} 
            onPositionChange={handleMarkerDrag}
          />
          
          {/* Show circle only for address search */}
          {searchType === 'address' && (
            <Circle
              center={markerPosition}
              radius={radius * 1000}
              pathOptions={{
                color: '#6366f1',
                fillColor: '#6366f1',
                fillOpacity: 0.1,
                weight: 2
              }}
            />
          )}
          
          {/* Show GeoJSON boundary for location search */}
          {searchType === 'location' && boundaryGeoJSON && (
            <GeoJSON
              key={JSON.stringify(boundaryGeoJSON)} // Force re-render on boundary change
              data={boundaryGeoJSON}
              style={{
                color: '#f59e0b',
                weight: 2,
                fillColor: '#f59e0b',
                fillOpacity: 0.1,
                dashArray: '5, 10'
              }}
            />
          )}
        </MapContainer>

        {/* Floating Header with Close Button */}
        <div className="absolute top-4 right-4 z-[1000]">
          <button
            onClick={onClose}
            className="p-3 bg-white hover:bg-gray-100 rounded-full shadow-lg transition-all"
            title="Close"
          >
            <X className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        {/* Floating Search Bar with Dropdown - Top Center */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] w-full max-w-xl px-4">
          <div className="bg-white rounded-xl shadow-lg">
            {/* Search Input with Type Selector */}
            <div className="relative p-3 flex gap-2">
              {/* Search Type Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowTypeMenu(!showTypeMenu)}
                  className="flex items-center gap-2 px-3 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-all border border-gray-200 text-sm font-medium text-gray-700"
                >
                  <span>
                    {searchType === 'address' && '📍'}
                    {searchType === 'location' && '🌍'}
                  </span>
                  <span className="capitalize">{searchType}</span>
                  <svg className={`w-4 h-4 transition-transform ${showTypeMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {/* Dropdown Menu */}
                {showTypeMenu && (
                  <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 py-1 min-w-[140px] z-50">
                    <button
                      onClick={() => { setSearchType('address'); setShowTypeMenu(false); }}
                      className="w-full px-4 py-2 text-left hover:bg-brand-primary/5 transition-colors flex items-center gap-2 text-sm"
                    >
                      <span>📍</span>
                      <span>Address</span>
                    </button>
                    <button
                      onClick={() => { setSearchType('location'); setShowTypeMenu(false); }}
                      className="w-full px-4 py-2 text-left hover:bg-brand-primary/5 transition-colors flex items-center gap-2 text-sm"
                    >
                      <span>🌍</span>
                      <span>Location</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Search Input */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder={
                    searchType === 'address' 
                      ? 'Search address or landmark...' 
                      : 'Search city or state...'
                  }
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg focus:ring-2 focus:ring-brand-primary/50 focus:outline-none text-sm border border-gray-200"
                />
                {isSearching && (
                  <Loader className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-primary animate-spin" />
                )}
              </div>
            </div>

            {/* Search Results Dropdown */}
            {searchResults.length > 0 && (
              <div className="border-t border-gray-100 max-h-72 overflow-y-auto">
                {searchResults.map((result, idx) => {
                  const addr = result.address || {};
                  const city = addr.city || addr.town || addr.village || '';
                  const state = addr.state || '';
                  const pincode = addr.postcode || '';
                  
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectResult(result)}
                      className="w-full p-3 text-left hover:bg-brand-primary/5 transition-colors border-b border-gray-50 last:border-0"
                    >
                      <div className="flex items-start gap-3">
                        <MapPin className="w-4 h-4 text-brand-primary mt-1 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900 font-medium truncate">
                            {result.displayName}
                          </p>
                          <div className="flex gap-3 mt-1 text-xs text-gray-500">
                            {city && <span className="flex items-center gap-1">🏙️ {city}</span>}
                            {state && <span className="flex items-center gap-1">🗺️ {state}</span>}
                            {pincode && <span className="flex items-center gap-1">📮 {pincode}</span>}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* No Results Message */}
            {searchQuery.length >= 2 && !isSearching && searchResults.length === 0 && (
              <div className="p-4 text-center text-sm text-gray-500 border-t border-gray-100">
                No results found for "{searchQuery}"
              </div>
            )}
          </div>
        </div>

        {/* Floating Radius Control - Top Left (Only for Address) */}
        {searchType === 'address' && (
          <div className="absolute top-4 left-4 z-[1000] bg-white rounded-xl shadow-lg p-4 w-64">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wide">
                Search Radius
              </label>
              <span className="text-sm font-bold text-brand-primary bg-brand-primary/10 px-2.5 py-1 rounded-lg">
                {radius} km
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="50"
              step="1"
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg cursor-pointer accent-brand-primary"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1.5">
              <span>1km</span>
              <span>50km</span>
            </div>
          </div>
        )}

        {/* Floating Tip - Bottom Left */}
        <div className="absolute bottom-24 left-4 z-[1000] bg-white/95 backdrop-blur-sm px-3 py-2 rounded-lg shadow-md max-w-xs">
          <p className="text-xs text-gray-600 flex items-center gap-2">
            <Navigation className="w-3.5 h-3.5 text-brand-primary flex-shrink-0" />
            <span>Drag the marker to adjust location</span>
          </p>
        </div>

        {/* Floating Action Buttons - Bottom */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[1000] flex gap-3">
          <button
            onClick={handleClear}
            className="px-5 py-2.5 bg-white hover:bg-gray-50 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl shadow-lg transition-all text-sm"
          >
            Clear
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-xl shadow-lg transition-all text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="px-8 py-2.5 bg-gradient-to-r from-brand-primary to-brand-secondary text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all text-sm"
          >
            Apply Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default MapSearchModal;
