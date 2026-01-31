import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { Search, MapPin, X, Loader } from 'lucide-react';
import { searchAddress, getAddressFromCoords } from '../../utils/geocoding';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const LocationPicker = ({ onLocationSelect, onClose, initialPosition = [28.6139, 77.2090] }) => {
  const [position, setPosition] = useState(initialPosition);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle map click
  function LocationMarker() {
    useMapEvents({
      async click(e) {
        const { lat, lng } = e.latlng;
        setPosition([lat, lng]);
        setLoading(true);
        
        try {
          const addressData = await getAddressFromCoords(lat, lng);
          if (addressData) {
            setSelectedAddress(addressData);
          }
        } catch (error) {
          console.error('Failed to get address:', error);
        } finally {
          setLoading(false);
        }
      }
    });
    
    return position ? <Marker position={position} /> : null;
  }

  // Search for addresses
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (searchQuery.length >= 3) {
        setSearching(true);
        const results = await searchAddress(searchQuery);
        setSearchResults(results);
        setSearching(false);
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Handle search result selection
  const handleSelectResult = async (result) => {
    setPosition([result.lat, result.lon]);
    setSearchQuery('');
    setSearchResults([]);
    setLoading(true);
    
    try {
      const addressData = await getAddressFromCoords(result.lat, result.lon);
      if (addressData) {
        setSelectedAddress(addressData);
      }
    } catch (error) {
      console.error('Failed to get address:', error);
    } finally {
      setLoading(false);
    }
  };

  // Confirm location selection
  const handleConfirm = () => {
    if (position && selectedAddress) {
      onLocationSelect({
        coordinates: {
          lng: position[1],
          lat: position[0]
        },
        address: selectedAddress.address || selectedAddress.displayName,
        city: selectedAddress.city,
        state: selectedAddress.state,
        pincode: selectedAddress.pincode
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <MapPin className="w-6 h-6 text-indigo-600" />
              Select Location
            </h2>
            <p className="text-sm text-gray-500 mt-1">Search or click on the map to select location</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-6 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for address, landmark, or area..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
            {searching && (
              <Loader className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-600 animate-spin" />
            )}
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
              {searchResults.map((result, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectResult(result)}
                  className="w-full p-3 text-left hover:bg-indigo-50 transition-colors border-b border-gray-100 last:border-0"
                >
                  <p className="text-sm text-gray-900">{result.displayName}</p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Map */}
        <div className="flex-grow relative">
          <MapContainer
            center={position}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
            className="z-0"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationMarker />
          </MapContainer>
          
          {loading && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 z-10">
              <Loader className="w-4 h-4 text-indigo-600 animate-spin" />
              <span className="text-sm font-medium text-gray-700">Getting address...</span>
            </div>
          )}
        </div>

        {/* Selected Address Display */}
        {selectedAddress && (
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <h3 className="text-sm font-bold text-gray-700 mb-2">Selected Location:</h3>
            <div className="bg-white p-4 rounded-xl border border-gray-200">
              <p className="text-sm text-gray-900 mb-2">{selectedAddress.displayName}</p>
              <div className="grid grid-cols-3 gap-2 text-xs text-gray-600">
                <div>
                  <span className="font-semibold">City:</span> {selectedAddress.city || 'N/A'}
                </div>
                <div>
                  <span className="font-semibold">State:</span> {selectedAddress.state || 'N/A'}
                </div>
                <div>
                  <span className="font-semibold">Pincode:</span> {selectedAddress.pincode || 'N/A'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedAddress}
            className="flex-1 py-3 px-4 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Confirm Location
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationPicker;
