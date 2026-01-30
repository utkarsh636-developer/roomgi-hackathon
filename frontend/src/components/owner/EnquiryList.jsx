import React, { useState, useMemo } from 'react';
import { Mail, Phone, Calendar, User, MessageSquare, Send, X, Filter, CheckCircle, Clock, XCircle } from 'lucide-react';
import enquiryService from '../../services/enquiryService';

const EnquiryList = ({ enquiries = [], onEnquiryUpdate }) => {
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyText, setReplyText] = useState('');
    const [sending, setSending] = useState(false);
    const [filterStatus, setFilterStatus] = useState('all');

    // Filter enquiries by status
    const filteredEnquiries = useMemo(() => {
        if (filterStatus === 'all') return enquiries;
        return enquiries.filter(e => e.status === filterStatus);
    }, [enquiries, filterStatus]);

    // Count by status
    const statusCounts = useMemo(() => {
        return {
            all: enquiries.length,
            pending: enquiries.filter(e => e.status === 'pending').length,
            contacted: enquiries.filter(e => e.status === 'contacted').length,
            rejected: enquiries.filter(e => e.status === 'rejected').length
        };
    }, [enquiries]);

    const handleReply = async (enquiryId) => {
        if (!replyText.trim()) {
            alert('Please enter a reply message');
            return;
        }

        setSending(true);
        try {
            await enquiryService.respondToEnquiry(enquiryId, replyText);
            setReplyingTo(null);
            setReplyText('');
            if (onEnquiryUpdate) onEnquiryUpdate();
        } catch (error) {
            console.error('Failed to send reply:', error);
            alert('Failed to send reply. Please try again.');
        } finally {
            setSending(false);
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            pending: { icon: Clock, color: 'bg-yellow-100 text-yellow-700 border-yellow-200', label: 'Pending' },
            contacted: { icon: CheckCircle, color: 'bg-green-100 text-green-700 border-green-200', label: 'Contacted' },
            rejected: { icon: XCircle, color: 'bg-red-100 text-red-700 border-red-200', label: 'Rejected' }
        };
        const badge = badges[status] || badges.pending;
        const Icon = badge.icon;
        
        return (
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${badge.color} uppercase tracking-wide`}>
                <Icon size={14} />
                {badge.label}
            </span>
        );
    };

    if (enquiries.length === 0) {
        return (
            <div className="bg-white p-12 rounded-3xl border border-gray-100 text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                    <MessageSquare size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No Enquiries Yet</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                    Your properties haven't received any enquiries yet. Make sure your listings are attractive and up-to-date!
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Filter Tabs */}
            <div className="flex gap-2 border-b border-gray-200 pb-2">
                {['all', 'pending', 'contacted', 'rejected'].map(status => (
                    <button
                        key={status}
                        onClick={() => setFilterStatus(status)}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors capitalize ${
                            filterStatus === status
                                ? 'bg-brand-primary text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        {status} <span className="ml-1 px-2 py-0.5 rounded-full bg-white/20 text-xs">{statusCounts[status]}</span>
                    </button>
                ))}
            </div>

            {/* Enquiries List */}
            <div className="space-y-4">
                {filteredEnquiries.length > 0 ? (
                    filteredEnquiries.map((enquiry) => (
                        <div key={enquiry._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="flex flex-col md:flex-row gap-6">
                                {/* Property Image & Basic Info */}
                                <div className="w-full md:w-48 shrink-0">
                                    <div className="aspect-video rounded-xl overflow-hidden mb-3">
                                        <img
                                            src={enquiry.property?.images?.[0]?.url || 'https://via.placeholder.com/300x200?text=No+Image'}
                                            alt={enquiry.property?.name || 'Property'}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <h4 className="font-bold text-gray-900 text-sm truncate">{enquiry.property?.name || enquiry.property?.type}</h4>
                                    <p className="text-xs text-gray-500 truncate">{enquiry.property?.location?.city}</p>
                                </div>

                                {/* Message & User Details */}
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-brand-bg flex items-center justify-center text-brand-primary font-bold overflow-hidden">
                                                {enquiry.user?.profileImage ? (
                                                    <img src={enquiry.user.profileImage} alt={enquiry.user.username} className="w-full h-full object-cover" />
                                                ) : (
                                                    enquiry.user?.username?.charAt(0).toUpperCase() || <User size={18} />
                                                )}
                                            </div>
                                            <div>
                                                <h5 className="font-bold text-gray-900">{enquiry.user?.username || 'Unknown User'}</h5>
                                                <p className="text-xs text-gray-500 flex items-center gap-1">
                                                    <Calendar size={12} /> {new Date(enquiry.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        {getStatusBadge(enquiry.status)}
                                    </div>

                                    {/* Enquiry Message */}
                                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-4">
                                        <p className="text-gray-700 italic">"{enquiry.message}"</p>
                                    </div>

                                    {/* Owner's Reply (if exists) */}
                                    {enquiry.reply && (
                                        <div className="bg-brand-primary/5 p-4 rounded-xl border border-brand-primary/20 mb-4">
                                            <p className="text-xs font-bold text-brand-primary mb-1">Your Reply:</p>
                                            <p className="text-gray-700">{enquiry.reply}</p>
                                            <p className="text-xs text-gray-500 mt-2">Sent on {new Date(enquiry.updatedAt).toLocaleDateString()}</p>
                                        </div>
                                    )}

                                    {/* Contact Info */}
                                    <div className="flex flex-wrap gap-3 mb-4">
                                        {enquiry.user?.email && (
                                            <a href={`mailto:${enquiry.user.email}`} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-700 hover:text-brand-primary hover:border-brand-primary transition-colors">
                                                <Mail size={16} /> {enquiry.user.email}
                                            </a>
                                        )}
                                        {enquiry.user?.phoneNumber && (
                                            <a href={`tel:${enquiry.user.phoneNumber}`} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-700 hover:text-brand-primary hover:border-brand-primary transition-colors">
                                                <Phone size={16} /> {enquiry.user.phoneNumber}
                                            </a>
                                        )}
                                    </div>

                                    {/* Reply Form */}
                                    {replyingTo === enquiry._id ? (
                                        <div className="space-y-3">
                                            <textarea
                                                value={replyText}
                                                onChange={(e) => setReplyText(e.target.value)}
                                                placeholder="Type your response..."
                                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none resize-none"
                                                rows={4}
                                            />
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleReply(enquiry._id)}
                                                    disabled={sending}
                                                    className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg font-bold hover:bg-brand-secondary transition-colors disabled:opacity-50"
                                                >
                                                    <Send size={16} />
                                                    {sending ? 'Sending...' : 'Send Response'}
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setReplyingTo(null);
                                                        setReplyText('');
                                                    }}
                                                    className="px-4 py-2 border border-gray-200 rounded-lg font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        enquiry.status === 'pending' && (
                                            <button
                                                onClick={() => {
                                                    setReplyingTo(enquiry._id);
                                                    setReplyText(enquiry.reply || '');
                                                }}
                                                className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg font-bold hover:bg-brand-secondary transition-colors"
                                            >
                                                <MessageSquare size={16} />
                                                Reply to Enquiry
                                            </button>
                                        )
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="bg-white p-12 rounded-2xl border border-gray-100 text-center">
                        <p className="text-gray-500">No {filterStatus} enquiries found.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EnquiryList;
