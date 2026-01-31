import React, { useState, useEffect } from 'react';
import { Users, Building2, CheckCircle, XCircle, Eye, FileText, Maximize2 } from 'lucide-react';
import AdminLayout from '../../components/layout/AdminLayout';
import StatusBadge from '../../components/admin/StatusBadge';
import adminService from '../../services/adminService';

const DocumentPreviewModal = ({ url, type, onClose }) => {
    if (!url) return null;

    return (
        <div className="fixed inset-0 bg-black/90 z-[60] flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={onClose}>
            <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
            >
                <XCircle size={32} />
            </button>
            <div className="max-w-4xl max-h-[90vh] w-full flex flex-col items-center" onClick={e => e.stopPropagation()}>
                <div className="mb-2 text-white font-medium px-4 py-1 bg-white/20 rounded-full text-sm">
                    {type}
                </div>
                <img
                    src={url}
                    alt={type}
                    className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/400x300?text=Format+Not+Supported';
                        e.target.parentElement.innerHTML += '<p class="text-white mt-2">Preview not available. <a href="' + url + '" target="_blank" class="underline text-brand-primary">Open in new tab</a></p>';
                    }}
                />
            </div>
        </div>
    );
};

const VerificationQueue = () => {
    const [activeTab, setActiveTab] = useState('users'); // users or properties
    const [users, setUsers] = useState([]);
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedItem, setSelectedItem] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [verificationAction, setVerificationAction] = useState({ status: '', reason: '' });
    const [verifying, setVerifying] = useState(false);
    const [error, setError] = useState('');
    const [previewDoc, setPreviewDoc] = useState(null); // { url: string, type: string }

    useEffect(() => {
        fetchPendingVerifications();
    }, []); // Run once on mount

    const fetchPendingVerifications = async () => {
        try {
            setLoading(true);
            const [usersRes, propertiesRes] = await Promise.all([
                adminService.getPendingUserVerifications(),
                adminService.getPendingPropertyVerifications()
            ]);
            setUsers(usersRes.data);
            setProperties(propertiesRes.data);
        } catch (error) {
            console.error('Failed to fetch verifications:', error);
            setError('Failed to load verifications. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async () => {
        try {
            setVerifying(true);
            setError('');

            console.log('Verifying:', {
                tab: activeTab,
                itemId: selectedItem._id,
                status: verificationAction.status,
                reason: verificationAction.reason
            });

            if (activeTab === 'users') {
                const result = await adminService.verifyUser(selectedItem._id, verificationAction.status, verificationAction.reason);
                console.log('User verification result:', result);
            } else {
                const result = await adminService.verifyProperty(selectedItem._id, verificationAction.status, verificationAction.reason);
                console.log('Property verification result:', result);
            }

            setShowModal(false);
            setSelectedItem(null);
            setVerificationAction({ status: '', reason: '' });
            fetchPendingVerifications();
        } catch (error) {
            console.error('Failed to verify - Full error:', error);
            console.error('Error response:', error.response);
            setError(error.response?.data?.message || 'Failed to update verification status. Please try again.');
        } finally {
            setVerifying(false);
        }
    };

    const openVerificationModal = (item, status) => {
        setSelectedItem(item);
        setVerificationAction({ status, reason: '' });
        setShowModal(true);
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Verification Queue</h2>
                    <p className="text-gray-600 text-sm mt-1">Review and approve pending verifications</p>
                </div>

                {/* Tabs */}
                <div className="flex gap-2">
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${activeTab === 'users'
                            ? 'bg-brand-primary text-white shadow-lg shadow-brand-dark/20'
                            : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                            }`}
                    >
                        <Users size={20} /> User Verifications ({users.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('properties')}
                        className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${activeTab === 'properties'
                            ? 'bg-brand-primary text-white shadow-lg shadow-brand-dark/20'
                            : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                            }`}
                    >
                        <Building2 size={20} /> Property Verifications ({properties.length})
                    </button>
                </div>

                {/* Verification List */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {loading ? (
                        <div className="col-span-full flex items-center justify-center py-12">
                            <div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : activeTab === 'users' ? (
                        users.length > 0 ? (
                            users.map((user) => (
                                <div key={user._id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all">
                                    {/* User Info */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold text-lg shadow-sm">
                                                {user.username?.[0]?.toUpperCase()}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-900">{user.username}</h3>
                                                <p className="text-sm text-gray-500">{user.email}</p>
                                                <p className="text-xs text-gray-400 mt-1">Role: {user.role}</p>
                                            </div>
                                        </div>
                                        <StatusBadge status={user.verification?.status} type="verification" />
                                    </div>

                                    {/* Documents */}
                                    <div className="mb-4">
                                        <p className="text-sm font-medium text-gray-600 mb-2 flex items-center gap-2">
                                            <FileText size={16} /> Documents ({user.documents?.length || 0})
                                        </p>
                                        <div className="grid grid-cols-2 gap-2">
                                            {user.documents?.map((doc, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => setPreviewDoc(doc)}
                                                    className="p-2 bg-gray-50 border border-gray-100 rounded-lg text-xs text-brand-primary hover:bg-gray-100 transition-colors flex items-center gap-2 group cursor-pointer text-left"
                                                >
                                                    <div className="bg-brand-primary/10 p-1.5 rounded-md group-hover:bg-brand-primary/20">
                                                        <Eye size={14} />
                                                    </div>
                                                    <span className="truncate flex-1 font-medium">{doc.type}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => openVerificationModal(user, 'approved')}
                                            className="flex-1 py-2 px-4 bg-green-50 text-green-600 hover:bg-green-100 border border-green-200 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                                        >
                                            <CheckCircle size={16} /> Approve
                                        </button>
                                        <button
                                            onClick={() => openVerificationModal(user, 'rejected')}
                                            className="flex-1 py-2 px-4 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                                        >
                                            <XCircle size={16} /> Reject
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-12 text-gray-400">
                                <CheckCircle size={48} className="mx-auto mb-3 opacity-20" />
                                <p>No pending user verifications</p>
                            </div>
                        )
                    ) : (
                        properties.length > 0 ? (
                            properties.map((property) => (
                                <div key={property._id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all">
                                    {/* Property Info */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-lg bg-brand-primary/10 text-brand-primary flex items-center justify-center">
                                                <Building2 size={24} />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-900 capitalize">{property.type}</h3>
                                                <p className="text-sm text-gray-500">{property.location?.city}</p>
                                                <p className="text-xs text-gray-400 mt-1">Rent: ₹{property.rent?.toLocaleString()}/mo</p>
                                            </div>
                                        </div>
                                        <StatusBadge status={property.verification?.status} type="verification" />
                                    </div>

                                    {/* Owner Info */}
                                    <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
                                        <p className="text-xs text-gray-400 mb-1">Owner</p>
                                        <p className="text-sm font-medium text-gray-900">{property.owner?.username}</p>
                                        <p className="text-xs text-gray-500">{property.owner?.email}</p>
                                    </div>

                                    {/* Documents */}
                                    <div className="mb-4">
                                        <p className="text-sm font-medium text-gray-600 mb-2 flex items-center gap-2">
                                            <FileText size={16} /> Documents ({property.documents?.length || 0})
                                        </p>
                                        <div className="grid grid-cols-2 gap-2">
                                            {property.documents?.map((doc, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => setPreviewDoc(doc)}
                                                    className="p-2 bg-gray-50 border border-gray-100 rounded-lg text-xs text-brand-primary hover:bg-gray-100 transition-colors flex items-center gap-2 group cursor-pointer text-left"
                                                >
                                                    <div className="bg-brand-primary/10 p-1.5 rounded-md group-hover:bg-brand-primary/20">
                                                        <Eye size={14} />
                                                    </div>
                                                    <span className="truncate flex-1 font-medium">{doc.type}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => openVerificationModal(property, 'approved')}
                                            className="flex-1 py-2 px-4 bg-green-50 text-green-600 hover:bg-green-100 border border-green-200 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                                        >
                                            <CheckCircle size={16} /> Approve
                                        </button>
                                        <button
                                            onClick={() => openVerificationModal(property, 'rejected')}
                                            className="flex-1 py-2 px-4 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                                        >
                                            <XCircle size={16} /> Reject
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-12 text-gray-400">
                                <CheckCircle size={48} className="mx-auto mb-3 opacity-20" />
                                <p>No pending property verifications</p>
                            </div>
                        )
                    )}
                </div>
            </div>

            {/* Verification Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full animate-in fade-in zoom-in duration-200">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">
                            {verificationAction.status === 'approved' ? 'Approve Verification' : 'Reject Verification'}
                        </h3>

                        {error && (
                            <div className="mb-4 p-3 bg-red-50 text-red-600 border border-red-100 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        {verificationAction.status === 'rejected' && (
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Rejection Reason (Required)
                                </label>
                                <textarea
                                    value={verificationAction.reason}
                                    onChange={(e) => setVerificationAction(prev => ({ ...prev, reason: e.target.value }))}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                                    rows="3"
                                    placeholder="Enter reason for rejection..."
                                />
                            </div>
                        )}

                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setShowModal(false);
                                    setSelectedItem(null);
                                    setVerificationAction({ status: '', reason: '' });
                                    setError('');
                                }}
                                disabled={verifying}
                                className="flex-1 py-2 px-4 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleVerify}
                                disabled={(verificationAction.status === 'rejected' && !verificationAction.reason) || verifying}
                                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${verificationAction.status === 'approved'
                                    ? 'bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed'
                                    : 'bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed'
                                    }`}
                            >
                                {verifying ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Processing...
                                    </>
                                ) : (
                                    'Confirm'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Document Preview Modal */}
            {previewDoc && (
                <DocumentPreviewModal
                    url={previewDoc.url}
                    type={previewDoc.type}
                    onClose={() => setPreviewDoc(null)}
                />
            )}
        </AdminLayout>
    );
};

export default VerificationQueue;
