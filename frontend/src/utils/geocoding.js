// Geocoding utilities using Nominatim (OpenStreetMap) - 100% FREE

const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org';

// Search for addresses (Forward Geocoding)
export const searchAddress = async (query) => {
    if (!query || query.length < 3) return [];

    try {
        const response = await fetch(
            `${NOMINATIM_BASE_URL}/search?format=json&q=${encodeURIComponent(query)}&countrycodes=in&limit=5`,
            {
                headers: {
                    'User-Agent': 'RoomGi Property Listing App'
                }
            }
        );

        if (!response.ok) throw new Error('Geocoding failed');

        const results = await response.json();
        return results.map(result => ({
            displayName: result.display_name,
            lat: parseFloat(result.lat),
            lon: parseFloat(result.lon),
            address: result.address || {}
        }));
    } catch (error) {
        console.error('Address search error:', error);
        return [];
    }
};

// Get address from coordinates (Reverse Geocoding)
export const getAddressFromCoords = async (lat, lng) => {
    try {
        const response = await fetch(
            `${NOMINATIM_BASE_URL}/reverse?format=json&lat=${lat}&lon=${lng}`,
            {
                headers: {
                    'User-Agent': 'RoomGi Property Listing App'
                }
            }
        );

        if (!response.ok) throw new Error('Reverse geocoding failed');

        const data = await response.json();
        const addr = data.address || {};

        return {
            displayName: data.display_name || '',
            address: addr.road || addr.suburb || '',
            city: addr.city || addr.town || addr.village || '',
            state: addr.state || '',
            pincode: addr.postcode || '',
            country: addr.country || 'India'
        };
    } catch (error) {
        console.error('Reverse geocoding error:', error);
        return null;
    }
};

// Validate coordinates
export const isValidCoordinate = (lat, lng) => {
    return (
        typeof lat === 'number' &&
        typeof lng === 'number' &&
        lat >= -90 && lat <= 90 &&
        lng >= -180 && lng <= 180
    );
};

// Calculate distance between two points (Haversine formula)
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
};
