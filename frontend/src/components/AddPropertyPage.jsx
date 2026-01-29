
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import propertyService from '../services/propertyService';
import LocationPicker from './LocationPicker';
import { Upload, X, Home, MapPin, IndianRupee, Loader, CheckSquare, Square, Map } from 'lucide-react';

const AMENITIES_LIST = [
    "wifi", "ac", "non_ac", "furnished", "semi_furnished", "unfurnished",
    "balcony", "garden", "terrace", "parking", "covered_parking",
    "power_backup", "water_supply_24x7", "water_geaser", "gas",
    "mess", "shared_kitchen", "private_kitchen", "refrigerator", "gas_stove",
    "gym", "yoga_room", "cctv", "security_guard", "laundry", "housekeeping",
    "tv_cable", "internet_high_speed", "pet_friendly", "smoking_allowed", "drinking_allowed"
];

const AddPropertyPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);
    const [error, setError] = useState('');
    const [images, setImages] = useState([]);
    const [existingImages, setExistingImages] = useState([]);
    const [showLocationPicker, setShowLocationPicker] = useState(false);
    const [coordinates, setCoordinates] = useState(null);

    const [formData, setFormData] = useState({
        title: '',
        type: 'flat',
        address: '',
        city: '',
        state: '',
        pincode: '',
        rent: '',
        securityDeposit: '',
        capacity: '',
        description: '',
        amenities: []
    });

    useEffect(() => {
        if (id) {
            const fetchProperty = async () => {
                setFetching(true);
                try {
                    const response = await propertyService.getPropertyById(id);
                    console.log("Fetched Property for Edit:", response.data);
                    const property = response.data;

                    setFormData({
                        title: property.title || property.name || '',
                        type: property.type,
                        address: property.location.addressLine,
                        city: property.location.city,
                        state: property.location.state,
                        pincode: property.location.pincode,
                        rent: property.rent,
                        securityDeposit: property.securityDeposit,
                        capacity: property.capacity.total,
                        description: property.description,
                        amenities: property.amenities || []
                    });

                    if (property.images && property.images.length > 0) {
                        setExistingImages(property.images);
                    }
                } catch (err) {
                    console.error('Failed to fetch property details:', err);
                    setError('Failed to load property details.');
                } finally {
                    setFetching(false);
                }
            };
            fetchProperty();
        }
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAmenityToggle = (amenity) => {
        setFormData(prev => {
            const current = prev.amenities;
            if (current.includes(amenity)) {
                return { ...prev, amenities: current.filter(a => a !== amenity) };
            } else {
                return { ...prev, amenities: [...current, amenity] };
            }
        });
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImages(prev => [...prev, ...files]);
    };

    const removeImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const removeExistingImage = (index) => {
        setExistingImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleLocationSelect = (locationData) => {
        setCoordinates(locationData.coordinates);
        setFormData(prev => ({
            ...prev,
            address: locationData.address || prev.address,
            city: locationData.city || prev.city,
            state: locationData.state || prev.state,
            pincode: locationData.pincode || prev.pincode
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const data = new FormData();

            data.append('title', formData.title);
            data.append('type', formData.type);
            data.append('description', formData.description);
            data.append('rent', formData.rent);
            data.append('securityDeposit', formData.securityDeposit);

            // Backend keys
            data.append('capacity.total', formData.capacity);

            // Location keys - flat strings
            data.append('address', formData.address);
            data.append('city', formData.city);
            data.append('state', formData.state);
            data.append('pincode', formData.pincode);

            // Coordinates - use selected coordinates or default
            if (coordinates) {
                data.append('coordinates.lng', coordinates.lng);
                data.append('coordinates.lat', coordinates.lat);
            } else {
                // Default coordinates (Delhi) if not selected
                data.append('coordinates.lng', '77.2090');
                data.append('coordinates.lat', '28.6139');
            }

            // Amenities
            formData.amenities.forEach((amenity) => {
                data.append('amenities', amenity);
            });

            // Handle Existing Images (Keep vs Delete)
            const keptPublicIds = existingImages.map(img => img.publicId);
            data.append('keptPublicIds', JSON.stringify(keptPublicIds));

            // Handle New Images
            images.forEach(image => {
                data.append('images', image);
            });

            if (id) {
                await propertyService.updateProperty(id, data);
            } else {
                await propertyService.addProperty(data);
            }

            navigate('/owner-dashboard');
        } catch (err) {
            console.error('Property Form Error:', err);
            setError(err.message || `Failed to ${id ? 'update' : 'add'} property.Please try again.`);
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader className="animate-spin text-brand-primary w-8 h-8" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-brand-bg font-montserrat flex flex-col">
            <Navbar />

            <main className="flex-grow pt-24 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-8 border-b border-gray-100 bg-brand-primary text-white">
                        <h1 className="text-2xl font-bold flex items-center gap-2">
                            <Home className="w-6 h-6" /> {id ? 'Edit Property' : 'List New Property'}
                        </h1>
                        <p className="text-brand-bg/80 mt-2">{id ? 'Update property details below.' : 'Fill in the details to list your property on RoomGi.'}</p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-8">
                        {error && (
                            <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 text-sm font-medium">
                                {error}
                            </div>
                        )}

                        {/* Basic Info */}
                        <section>
                            <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Basic Info</h3>
                            <div className="mb-6">
                                <label className="block text-sm font-bold text-gray-700 mb-2">Property Title <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    placeholder="e.g. Sunny Boys PG"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all text-gray-900"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Property Type</label>
                                    <select
                                        name="type"
                                        value={formData.type}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all"
                                    >
                                        <option value="flat">Flat / Apartment</option>
                                        <option value="PG">PG (Paying Guest)</option>
                                        <option value="hostel">Hostel</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Total Capacity (Persons)</label>
                                    <input
                                        type="number"
                                        name="capacity"
                                        value={formData.capacity}
                                        onChange={handleInputChange}
                                        placeholder="e.g. 10"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="mt-6">
                                <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Describe your property clearly..."
                                    rows="4"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all resize-none"
                                    required
                                />
                            </div>
                        </section>

                        {/* Pricing */}
                        <section>
                            <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Pricing</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Monthly Rent (₹)</label>
                                    <div className="relative">
                                        <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            type="number"
                                            name="rent"
                                            value={formData.rent}
                                            onChange={handleInputChange}
                                            placeholder="15000"
                                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all"
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Security Deposit (₹)</label>
                                    <div className="relative">
                                        <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            type="number"
                                            name="securityDeposit"
                                            value={formData.securityDeposit}
                                            onChange={handleInputChange}
                                            placeholder="50000"
                                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Location */}
                        <section>
                            <div className="flex items-center justify-between mb-4 border-b pb-2">
                                <h3 className="text-lg font-bold text-gray-900">Location</h3>
                                <button
                                    type="button"
                                    onClick={() => setShowLocationPicker(true)}
                                    className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white text-sm font-semibold rounded-lg hover:bg-brand-secondary transition-colors"
                                >
                                    <Map className="w-4 h-4" />
                                    Select on Map
                                </button>
                            </div>

                            {coordinates && (
                                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-green-600" />
                                    <span className="text-sm text-green-800 font-medium">
                                        Location selected: {coordinates.lat.toFixed(4)}, {coordinates.lng.toFixed(4)}
                                    </span>
                                </div>
                            )}

                            <div className="mb-6">
                                <label className="block text-sm font-bold text-gray-700 mb-2">Address Line</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                                    <textarea
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        placeholder="Full address of the property"
                                        rows="2"
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all resize-none"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">City</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        placeholder="Mumbai"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">State</label>
                                    <input
                                        type="text"
                                        name="state"
                                        value={formData.state}
                                        onChange={handleInputChange}
                                        placeholder="Maharashtra"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Pincode</label>
                                    <input
                                        type="text"
                                        name="pincode"
                                        value={formData.pincode}
                                        onChange={handleInputChange}
                                        placeholder="400001"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all"
                                        required
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Amenities */}
                        <section>
                            <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Amenities</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {AMENITIES_LIST.map(amenity => (
                                    <label key={amenity} className="flex items-center space-x-2 cursor-pointer group">
                                        <div
                                            className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${formData.amenities.includes(amenity)
                                                ? 'bg-brand-primary border-brand-primary text-white'
                                                : 'border-gray-300 text-transparent group-hover:border-brand-primary/50'
                                                }`}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleAmenityToggle(amenity);
                                            }}
                                        >
                                            <CheckSquare className="w-3.5 h-3.5" />
                                        </div>
                                        <span className="text-sm text-gray-600 capitalize">{amenity.replace(/_/g, ' ')}</span>
                                    </label>
                                ))}
                            </div>
                        </section>

                        {/* Image Upload */}
                        <section>
                            <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Property Images</h3>

                            {/* Existing Images Display */}
                            {existingImages.length > 0 && (
                                <div className="mb-6">
                                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Current Images</h4>
                                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                                        {existingImages.map((img, index) => (
                                            <div key={index} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200">
                                                <img
                                                    src={img.url}
                                                    alt={`Existing ${index}`}
                                                    className="w-full h-full object-cover"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeExistingImage(index)}
                                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity transform scale-90 hover:scale-100"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">
                                        Note: Uploading new images will replace all these existing images.
                                    </p>
                                </div>
                            )}

                            <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer relative">
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                <Upload className="mx-auto text-brand-primary w-10 h-10 mb-2" />
                                <span className="text-sm text-gray-500 font-medium">Click to upload images</span>
                            </div>

                            {/* Image Previews */}
                            {images.length > 0 && (
                                <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 gap-4">
                                    {images.map((file, index) => (
                                        <div key={index} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200">
                                            <img
                                                src={URL.createObjectURL(file)}
                                                alt={`Preview ${index} `}
                                                className="w-full h-full object-cover"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity transform scale-90 hover:scale-100"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>

                        {/* Submit Button */}
                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 bg-brand-primary hover:bg-brand-secondary text-white font-bold rounded-xl shadow-lg shadow-brand-dark/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <Loader className="animate-spin w-5 h-5" /> {id ? 'Updating...' : 'Publishing...'}
                                    </>
                                ) : (
                                    id ? 'Update Property' : 'List Property'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </main>

            <Footer />

            {showLocationPicker && (
                <LocationPicker
                    onLocationSelect={handleLocationSelect}
                    onClose={() => setShowLocationPicker(false)}
                    initialPosition={coordinates ? [coordinates.lat, coordinates.lng] : undefined}
                />
            )}
        </div>
    );
};

export default AddPropertyPage;
