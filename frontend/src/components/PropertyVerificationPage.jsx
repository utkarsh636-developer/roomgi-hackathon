import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import propertyService from '../services/propertyService';
import { Upload, X, ShieldCheck, Loader, FileText, Home } from 'lucide-react';

const DOCUMENT_TYPES = [
    { value: 'ownership_proof', label: 'Proof of Ownership (Required)' },
    { value: 'government_id', label: 'Government ID (Required)' },
    { value: 'rent_agreement', label: 'Rent Agreement' },
    { value: 'electricity_bill', label: 'Electricity Bill' },
    { value: 'water_bill', label: 'Water Bill' },
    { value: 'property_tax_receipt', label: 'Property Tax Receipt' },
    { value: 'other', label: 'Other' }
];

const PropertyVerificationPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [property, setProperty] = useState(null);
    const [error, setError] = useState('');
    const [docList, setDocList] = useState([]);

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                const response = await propertyService.getPropertyById(id);
                setProperty(response.data);
            } catch (err) {
                console.error("Failed to fetch property:", err);
                setError("Failed to load property details.");
            }
        };
        fetchProperty();
    }, [id]);

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        const newDocs = files.map(file => ({ file, type: 'ownership_proof' }));
        setDocList(prev => [...prev, ...newDocs]);
    };

    const handleTypeChange = (index, newType) => {
        setDocList(prev => prev.map((item, i) => i === index ? { ...item, type: newType } : item));
    };

    const removeDocument = (index) => {
        setDocList(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (docList.length < 2) {
            setError('Please upload at least 2 documents.');
            setLoading(false);
            return;
        }

        const types = docList.map(d => d.type);
        if (!types.includes('ownership_proof') || !types.includes('government_id')) {
            setError('Proof of Ownership and Government ID are mandatory.');
            setLoading(false);
            return;
        }

        try {
            const data = new FormData();
            docList.forEach(item => {
                data.append('documents', item.file);
                data.append('documentTypes', item.type);
            });

            await propertyService.verifyPropertyRequest(id, data);
            alert('Property verification documents submitted successfully!');
            navigate('/owner-dashboard');
        } catch (err) {
            console.error('Verification Error:', err);
            setError(err.message || 'Failed to submit verification request.');
        } finally {
            setLoading(false);
        }
    };

    if (!property) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader className="animate-spin text-indigo-600 w-8 h-8" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 font-montserrat flex flex-col">
            <Navbar />

            <main className="flex-grow pt-24 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-8 border-b border-gray-100 bg-purple-50">
                        <h1 className="text-2xl font-bold flex items-center gap-2 text-purple-900">
                            <ShieldCheck className="w-8 h-8 text-purple-600" /> Verify Property
                        </h1>
                        <p className="text-purple-700 mt-2 text-sm">
                            Submit documents for <span className="font-bold">"{property.type} in {property.location?.city}"</span>.
                            <br />
                            <span className="font-bold">Proof of Ownership</span> and <span className="font-bold">Government ID</span> are required.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-6">
                        {error && (
                            <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 text-sm font-medium">
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Upload Legal Documents</label>
                            <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer relative">
                                <input
                                    type="file"
                                    multiple
                                    accept=".pdf,image/*"
                                    onChange={handleFileChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                <div className="bg-purple-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Upload className="text-purple-600 w-8 h-8" />
                                </div>
                                <h3 className="font-bold text-gray-900 mb-1">Click to upload Documents</h3>
                                <p className="text-sm text-gray-500">PDF, JPG or PNG (Min 2 files)</p>
                            </div>

                            {/* Document List */}
                            {docList.length > 0 && (
                                <div className="mt-6 space-y-4">
                                    {docList.map((item, index) => (
                                        <div key={index} className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                                            <div className="flex items-center gap-3 flex-grow">
                                                <div className="bg-white p-2 rounded-lg border border-gray-200">
                                                    <FileText className="text-indigo-500 w-5 h-5" />
                                                </div>
                                                <span className="text-sm font-medium text-gray-700 truncate max-w-[150px]">{item.file.name}</span>
                                            </div>

                                            <div className="flex items-center gap-3 w-full sm:w-auto">
                                                <select
                                                    value={item.type}
                                                    onChange={(e) => handleTypeChange(index, e.target.value)}
                                                    className="w-full sm:w-56 px-3 py-2 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500"
                                                >
                                                    {DOCUMENT_TYPES.map(type => (
                                                        <option key={type.value} value={type.value}>{type.label}</option>
                                                    ))}
                                                </select>
                                                <button
                                                    type="button"
                                                    onClick={() => removeDocument(index)}
                                                    className="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-red-50 transition-colors"
                                                >
                                                    <X className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-lg shadow-purple-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <Loader className="animate-spin w-5 h-5" /> Submitting...
                                    </>
                                ) : (
                                    'Submit Verification Request'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default PropertyVerificationPage;
