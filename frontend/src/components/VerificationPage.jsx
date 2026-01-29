import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import authService from '../services/authService';
import { Upload, X, ShieldCheck, Loader, FileText } from 'lucide-react';

const DOCUMENT_TYPES = [
    { value: 'aadhaar', label: 'Aadhaar Card' },
    { value: 'pan_card', label: 'PAN Card' },
    { value: 'voter_id', label: 'Voter ID' },
    { value: 'driving_license', label: 'Driving License' },
    { value: 'passport', label: 'Passport' },
    { value: 'other', label: 'Other' }
];

const VerificationPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    // Store files with their selected type: [{ file: File, type: 'government_id' }]
    const [docList, setDocList] = useState([]);

    React.useEffect(() => {
        const checkStatus = async () => {
            try {
                const currentUser = await authService.fetchCurrentUser();
                if (currentUser?.data?.verification?.status === 'approved') {
                    navigate(currentUser.data.role === 'owner' ? '/owner-dashboard' : '/profile');
                }
            } catch (e) {
                console.error("Failed to check status", e);
            }
        };
        checkStatus();
    }, [navigate]);

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        // Default new files to 'aadhaar' or first option, user can change later
        const newDocs = files.map(file => ({ file, type: 'aadhaar' }));
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
            setError('Please upload at least 2 documents as required.');
            setLoading(false);
            return;
        }

        try {
            const data = new FormData();
            docList.forEach(item => {
                data.append('documents', item.file);
                data.append('documentTypes', item.type);
            });

            await authService.verifyRequest(data);
            alert('Verification request submitted successfully!');

            // Fetch latest user data to determine redirect
            const currentUser = await authService.getCurrentUser();
            // Fallback to local storage if user state isn't updated instantly? 
            // Better to rely on the role passing or refetch
            const role = currentUser?.role || 'tenant';
            navigate(role === 'owner' ? '/owner-dashboard' : '/profile');
        } catch (err) {
            console.error('Verification Error:', err);
            const errorMessage = err.response?.data?.message || err.message || 'Failed to submit verification request.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 font-montserrat flex flex-col">
            <Navbar />

            <main className="flex-grow pt-24 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-8 border-b border-gray-100 bg-orange-50">
                        <h1 className="text-2xl font-bold flex items-center gap-2 text-orange-800">
                            <ShieldCheck className="w-8 h-8 text-orange-600" /> Identity Verification
                        </h1>
                        <p className="text-orange-700 mt-2 text-sm">
                            To ensure safety, we need to verify your identity. <span className="font-bold">Please upload at least 2 documents.</span>
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-6">
                        {error && (
                            <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 text-sm font-medium">
                                {error}
                            </div>
                        )}

                        {/* Document Upload */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Upload Documents</label>
                            <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer relative">
                                <input
                                    type="file"
                                    multiple
                                    accept=".pdf,image/*"
                                    onChange={handleFileChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                <div className="bg-indigo-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Upload className="text-indigo-600 w-8 h-8" />
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
                                                    className="w-full sm:w-48 px-3 py-2 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
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

                        {/* Submit Button */}
                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <Loader className="animate-spin w-5 h-5" /> Submitting...
                                    </>
                                ) : (
                                    'Submit for Verification'
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

export default VerificationPage;
