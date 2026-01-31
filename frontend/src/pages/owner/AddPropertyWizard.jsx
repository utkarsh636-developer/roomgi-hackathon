import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Home, MapPin, Camera, DollarSign, ShieldCheck,
    ChevronRight, ChevronLeft, Upload, Check, AlertCircle,
    Wifi, Wind, Coffee, Utensils, Car, Thermometer, Activity, Dumbbell
} from 'lucide-react';

const AddPropertyWizard = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '', type: 'PG', gender: 'Unisex',
        address: '', locality: '', city: 'Bangalore',
        amenities: [],
        price: '', deposit: '',
        reraId: '', aadhaarFile: null, billFile: null
    });

    const totalSteps = 4;

    const handleNext = () => {
        if (step < totalSteps) setStep(step + 1);
        else {
            // Simulate submission
            setTimeout(() => {
                alert("Property Submitted for Verification!");
                navigate('/owner-dashboard');
            }, 1000);
        }
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

    const toggleAmenity = (name) => {
        setFormData(prev => ({
            ...prev,
            amenities: prev.amenities.includes(name)
                ? prev.amenities.filter(a => a !== name)
                : [...prev.amenities, name]
        }));
    };

    return (
        <div className="min-h-screen bg-brand-bg pt-24 pb-12 font-montserrat">
            <div className="max-w-3xl mx-auto px-4 sm:px-6">

                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex justify-between text-sm font-bold text-gray-500 mb-2 uppercase tracking-wide">
                        <span>Step {step} of {totalSteps}</span>
                        <span>{Math.round((step / totalSteps) * 100)}% Completed</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                            className="bg-brand-primary h-2.5 rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${(step / totalSteps) * 100}%` }}
                        ></div>
                    </div>
                </div>

                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">

                    {/* Header */}
                    <div className="bg-brand-primary p-6 md:p-8 text-white">
                        <h1 className="text-2xl md:text-3xl font-bold">List Your Property</h1>
                        <p className="text-brand-bg/80 mt-2">Fill in the details to get your property verified and listed.</p>
                    </div>

                    <div className="p-6 md:p-10">

                        {/* Step 1: Basic Info */}
                        {step === 1 && (
                            <div className="space-y-6 animate-in slide-in-from-right-4 fade-in duration-300">
                                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                    <Home className="text-brand-primary" /> Basic Details
                                </h2>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Property Name</label>
                                    <input
                                        type="text"
                                        className="w-full p-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none transition-all"
                                        placeholder="e.g. Sri Sai PG for Gents"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Property Type</label>
                                        <select
                                            className="w-full p-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none"
                                            value={formData.type}
                                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                        >
                                            <option>PG (Paying Guest)</option>
                                            <option>Flat / Apartment</option>
                                            <option>Hostel</option>
                                            <option>Co-living Space</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Gender Preference</label>
                                        <select
                                            className="w-full p-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none"
                                            value={formData.gender}
                                            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                        >
                                            <option>Unisex</option>
                                            <option>Boys Only</option>
                                            <option>Girls Only</option>
                                            <option>Family</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Location & Amenities */}
                        {step === 2 && (
                            <div className="space-y-8 animate-in slide-in-from-right-4 fade-in duration-300">
                                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                    <MapPin className="text-brand-primary" /> Location & Amenities
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Full Address</label>
                                        <textarea
                                            rows="3"
                                            className="w-full p-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none"
                                            placeholder="#123, Street Name, Landmark..."
                                            value={formData.address}
                                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        ></textarea>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Locality</label>
                                        <input
                                            type="text"
                                            className="w-full p-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none"
                                            placeholder="e.g. Koramangala 4th Block"
                                            value={formData.locality}
                                            onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">City</label>
                                        <input
                                            type="text"
                                            className="w-full p-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none"
                                            value={formData.city}
                                            readOnly
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-4">Select Amenities</label>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {[
                                            { icon: Wifi, label: 'Wifi' }, { icon: Wind, label: 'AC' },
                                            { icon: Utensils, label: 'Food' }, { icon: Car, label: 'Parking' },
                                            { icon: Thermometer, label: 'Geyser' }, { icon: Dumbbell, label: 'Gym' }
                                        ].map((am) => (
                                            <div
                                                key={am.label}
                                                onClick={() => toggleAmenity(am.label)}
                                                className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 cursor-pointer transition-all ${formData.amenities.includes(am.label)
                                                    ? 'border-brand-primary bg-brand-primary/10 text-brand-primary'
                                                    : 'border-gray-100 hover:border-brand-secondary/30 text-gray-500'
                                                    }`}
                                            >
                                                <am.icon size={24} />
                                                <span className="font-bold text-sm">{am.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Photos & Pricing */}
                        {step === 3 && (
                            <div className="space-y-8 animate-in slide-in-from-right-4 fade-in duration-300">
                                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                    <DollarSign className="text-brand-primary" /> Pricing & Photos
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Monthly Rent (₹)</label>
                                        <input
                                            type="number"
                                            className="w-full p-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none text-xl font-bold text-gray-900"
                                            placeholder="12000"
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Security Deposit (₹)</label>
                                        <input
                                            type="number"
                                            className="w-full p-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none text-xl font-bold text-gray-900"
                                            placeholder="25000"
                                            value={formData.deposit}
                                            onChange={(e) => setFormData({ ...formData, deposit: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-brand-primary hover:bg-brand-primary/5 transition-all cursor-pointer group">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-white text-gray-400 group-hover:text-brand-primary transition-colors">
                                        <Camera size={32} />
                                    </div>
                                    <h3 className="font-bold text-lg text-gray-900">Upload Property Photos</h3>
                                    <p className="text-gray-500 text-sm mt-1">Drag and drop or click to browse. At least 3 photos required.</p>
                                </div>
                            </div>
                        )}

                        {/* Step 4: Verification */}
                        {step === 4 && (
                            <div className="space-y-8 animate-in slide-in-from-right-4 fade-in duration-300">
                                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                    <ShieldCheck className="text-green-600" /> Identity Verification
                                </h2>

                                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex gap-3 text-sm text-yellow-800">
                                    <AlertCircle className="shrink-0" />
                                    To get the "Verified" badge and 3x more views, please upload valid government ID and property documents.
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">RERA ID (Optional)</label>
                                    <input
                                        type="text"
                                        className="w-full p-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none uppercase tracking-widest font-mono"
                                        placeholder="A5190000..."
                                        value={formData.reraId}
                                        onChange={(e) => setFormData({ ...formData, reraId: e.target.value })}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Aadhaar Card (Front/Back)</label>
                                        <div className="border border-gray-200 rounded-xl p-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-gray-100 rounded-lg text-gray-500"><Upload size={20} /></div>
                                                <span className="text-sm font-medium text-gray-600">Upload File</span>
                                            </div>
                                            <span className="text-xs text-gray-400">PDF, JPG</span>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Electricity Bill (Recent)</label>
                                        <div className="border border-gray-200 rounded-xl p-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-gray-100 rounded-lg text-gray-500"><Upload size={20} /></div>
                                                <span className="text-sm font-medium text-gray-600">Upload File</span>
                                            </div>
                                            <span className="text-xs text-gray-400">PDF, JPG</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 mt-4">
                                    <div className={`mt-1 w-5 h-5 rounded border flex items-center justify-center cursor-pointer ${true ? 'bg-brand-primary border-brand-primary text-white' : 'border-gray-300'}`}>
                                        <Check size={14} />
                                    </div>
                                    <p className="text-sm text-gray-600">I declare that the information provided is true and I am the lawful owner/manager of this property.</p>
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex justify-between pt-10 mt-6 border-t border-gray-100">
                            <button
                                onClick={handleBack}
                                className={`px-6 py-3 font-bold text-gray-500 hover:text-gray-800 transition-colors ${step === 1 ? 'opacity-0 pointer-events-none' : ''}`}
                            >
                                Back
                            </button>
                            <button
                                onClick={handleNext}
                                className="px-8 py-3 bg-brand-primary hover:bg-brand-secondary text-white font-bold rounded-xl shadow-lg shadow-brand-dark/20 transition-all flex items-center gap-2"
                            >
                                {step === totalSteps ? 'Submit for Review' : 'Next Step'} <ChevronRight size={20} />
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddPropertyWizard;
