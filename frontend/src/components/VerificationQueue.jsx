import React, { useState, useEffect } from 'react';
import { Users, Building2, CheckCircle, XCircle, Eye, FileText } from 'lucide-react';
import AdminLayout from './AdminLayout';
import StatusBadge from './admin/StatusBadge';
import adminService from '../services/adminService';

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

    useEffect(() => {
        fetchPendingVerifications();
    }, [activeTab]);

    const fetchPendingVerifications = async () => {
        try {
            setLoading(true);
            if (activeTab === 'users') {
                const response = await adminService.getPendingUserVerifications();
                setUsers(response.data);
            } else {
                const response = await adminService.getPendingPropertyVerifications();
                setProperties(response.data);
            }
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
                    <h2 className="text-2xl font-bold text-white">Verification Queue</h2>
                    <p className="text-slate-400 text-sm mt-1">Review and approve pending verifications</p>
                </div>

                {/* Tabs */}
                <div className="flex gap-2">
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
                            activeTab === 'users'
                                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                                : 'bg-slate-800/40 text-slate-300 hover:bg-slate-700/50 border border-slate-700/50'
                        }`}
                    >
                        <Users size={20} /> User Verifications ({users.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('properties')}
                        className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
                            activeTab === 'properties'
                                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                                : 'bg-slate-800/40 text-slate-300 hover:bg-slate-700/50 border border-slate-700/50'
                        }`}
                    >
                        <Building2 size={20} /> Property Verifications ({properties.length})
                    </button>
                </div>

                {/* Verification List */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {loading ? (
                        <div className="col-span-full flex items-center justify-center py-12">
                            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : activeTab === 'users' ? (
                        users.length > 0 ? (
                            users.map((user) => (
                                <div key={user._id} className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:border-slate-600/50 transition-all">
                                    {/* User Info */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                                                {user.username?.[0]?.toUpperCase()}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-white">{user.username}</h3>
                                                <p className="text-sm text-slate-400">{user.email}</p>
                                                <p className="text-xs text-slate-500 mt-1">Role: {user.role}</p>
                                            </div>
                                        </div>
                                        <StatusBadge status={user.verification?.status} type="verification" />
                                    </div>

                                    {/* Documents */}
                                    <div className="mb-4">
                                        <p className="text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                                            <FileText size={16} /> Documents ({user.documents?.length || 0})
                                        </p>
                                        <div className="grid grid-cols-2 gap-2">
                                            {user.documents?.map((doc, idx) => (
                                                <a
                                                    key={idx}
                                                    href={doc.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-2 bg-slate-900/50 rounded-lg text-xs text-indigo-400 hover:bg-slate-900 transition-colors flex items-center gap-2"
                                                >
                                                    <Eye size={14} />
                                                    {doc.type}
                                                </a>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => openVerificationModal(user, 'approved')}
                                            className="flex-1 py-2 px-4 bg-green-600/10 text-green-400 hover:bg-green-600/20 border border-green-600/20 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                                        >
                                            <CheckCircle size={16} /> Approve
                                        </button>
                                        <button
                                            onClick={() => openVerificationModal(user, 'rejected')}
                                            className="flex-1 py-2 px-4 bg-red-600/10 text-red-400 hover:bg-red-600/20 border border-red-600/20 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                                        >
                                            <XCircle size={16} /> Reject
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-12 text-slate-400">
                                <CheckCircle size={48} className="mx-auto mb-3 opacity-50" />
                                <p>No pending user verifications</p>
                            </div>
                        )
                    ) : (
                        properties.length > 0 ? (
                            properties.map((property) => (
                                <div key={property._id} className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:border-slate-600/50 transition-all">
                                    {/* Property Info */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                                                <Building2 size={24} className="text-white" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-white capitalize">{property.type}</h3>
                                                <p className="text-sm text-slate-400">{property.location?.city}</p>
                                                <p className="text-xs text-slate-500 mt-1">Rent: ₹{property.rent?.toLocaleString()}/mo</p>
                                            </div>
                                        </div>
                                        <StatusBadge status={property.verification?.status} type="verification" />
                                    </div>

                                    {/* Owner Info */}
                                    <div className="mb-4 p-3 bg-slate-900/50 rounded-lg">
                                        <p className="text-xs text-slate-400 mb-1">Owner</p>
                                        <p className="text-sm font-medium text-white">{property.owner?.username}</p>
                                        <p className="text-xs text-slate-400">{property.owner?.email}</p>
                                    </div>

                                    {/* Documents */}
                                    <div className="mb-4">
                                        <p className="text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                                            <FileText size={16} /> Documents ({property.documents?.length || 0})
                                        </p>
                                        <div className="grid grid-cols-2 gap-2">
                                            {property.documents?.map((doc, idx) => (
                                                <a
                                                    key={idx}
                                                    href={doc.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-2 bg-slate-900/50 rounded-lg text-xs text-purple-400 hover:bg-slate-900 transition-colors flex items-center gap-2"
                                                >
                                                    <Eye size={14} />
                                                    {doc.type}
                                                </a>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => openVerificationModal(property, 'approved')}
                                            className="flex-1 py-2 px-4 bg-green-600/10 text-green-400 hover:bg-green-600/20 border border-green-600/20 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                                        >
                                            <CheckCircle size={16} /> Approve
                                        </button>
                                        <button
                                            onClick={() => openVerificationModal(property, 'rejected')}
                                            className="flex-1 py-2 px-4 bg-red-600/10 text-red-400 hover:bg-red-600/20 border border-red-600/20 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                                        >
                                            <XCircle size={16} /> Reject
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-12 text-slate-400">
                                <CheckCircle size={48} className="mx-auto mb-3 opacity-50" />
                                <p>No pending property verifications</p>
                            </div>
                        )
                    )}
                </div>
            </div>

            {/* Verification Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 max-w-md w-full">
                        <h3 className="text-xl font-bold text-white mb-4">
                            {verificationAction.status === 'approved' ? 'Approve Verification' : 'Reject Verification'}
                        </h3>
                        
                        {error && (
                            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                                {error}
                            </div>
                        )}
                        
                        {verificationAction.status === 'rejected' && (
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Rejection Reason (Required)
                                </label>
                                <textarea
                                    value={verificationAction.reason}
                                    onChange={(e) => setVerificationAction(prev => ({ ...prev, reason: e.target.value }))}
                                    className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500"
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
                                className="flex-1 py-2 px-4 bg-slate-700 text-white rounded-lg font-medium hover:bg-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleVerify}
                                disabled={(verificationAction.status === 'rejected' && !verificationAction.reason) || verifying}
                                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                                    verificationAction.status === 'approved'
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
        </AdminLayout>
    );
};

export default VerificationQueue;
