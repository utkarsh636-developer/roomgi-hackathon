import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import { MapPin, IndianRupee, Home } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const PropertyMapView = ({ properties = [] }) => {
  const navigate = useNavigate();

  // Filter properties that have valid coordinates
  const propertiesWithCoords = properties.filter(
    p => p.location?.coordinates?.coordinates &&
      p.location.coordinates.coordinates.length === 2
  );

  // Calculate center position (average of all properties or default to Delhi)
  const getCenter = () => {
    if (propertiesWithCoords.length === 0) {
      return [28.6139, 77.2090]; // Default to Delhi
    }

    const avgLat = propertiesWithCoords.reduce((sum, p) =>
      sum + p.location.coordinates.coordinates[1], 0) / propertiesWithCoords.length;
    const avgLng = propertiesWithCoords.reduce((sum, p) =>
      sum + p.location.coordinates.coordinates[0], 0) / propertiesWithCoords.length;

    return [avgLat, avgLng];
  };

  const handlePropertyClick = (propertyId) => {
    navigate(`/property/${propertyId}`);
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200">
      {propertiesWithCoords.length === 0 ? (
        <div className="h-[600px] flex flex-col items-center justify-center p-8 text-center">
          <div className="bg-brand-primary/10 p-6 rounded-full mb-6">
            <MapPin className="w-12 h-12 text-brand-primary" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">No Properties with Location Data</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            Properties need to have location coordinates to appear on the map.
            {properties.length > 0 && ` ${properties.length} properties found but no location data available.`}
          </p>
        </div>
      ) : (
        <>
          <div className="p-4 bg-brand-primary/10 border-b border-brand-primary/20">
            <p className="text-sm font-semibold text-brand-primary">
              <MapPin className="w-4 h-4 inline mr-1" />
              Showing {propertiesWithCoords.length} {propertiesWithCoords.length === 1 ? 'property' : 'properties'} on map
            </p>
          </div>

          <MapContainer
            center={getCenter()}
            zoom={12}
            style={{ height: '600px', width: '100%' }}
            className="z-0"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {propertiesWithCoords.map((property) => {
              const [lng, lat] = property.location.coordinates.coordinates;

              return (
                <Marker
                  key={property._id}
                  position={[lat, lng]}
                  eventHandlers={{
                    click: () => handlePropertyClick(property._id)
                  }}
                >
                  <Popup>
                    <div className="min-w-[200px]">
                      {property.images && property.images.length > 0 && (
                        <img
                          src={property.images[0].url}
                          alt={property.title || property.name}
                          className="w-full h-32 object-cover rounded-lg mb-2"
                        />
                      )}
                      <h4 className="font-bold text-gray-900 mb-1">
                        {property.title || property.name || 'Property'}
                      </h4>
                      <p className="text-xs text-gray-600 mb-2 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {property.location.city}, {property.location.state}
                      </p>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-bold text-brand-primary flex items-center">
                          <IndianRupee className="w-3 h-3" />
                          {property.rent?.toLocaleString()}/mo
                        </span>
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded capitalize">
                          {property.type}
                        </span>
                      </div>
                      <button
                        onClick={() => handlePropertyClick(property._id)}
                        className="w-full py-2 bg-brand-primary text-white text-sm font-semibold rounded-lg hover:bg-brand-secondary transition-colors"
                      >
                        View Details
                      </button>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </>
      )}
    </div>
  );
};

export default PropertyMapView;
