import React, { useState, useEffect } from 'react';
import { Mail, Phone, Calendar, User, ArrowRight, MessageSquare, AlertCircle } from 'lucide-react';
import enquiryService from '../../services/enquiryService';

const EnquiryList = ({ enquiries = [] }) => {
    // const [enquiries, setEnquiries] = useState([]); // Moved to parent
    // const [loading, setLoading] = useState(true); // Handled by parent
    // const [error, setError] = useState(null); // Handled by parent

    // useEffect(() => {
    //     const fetchEnquiries = async () => {
    //         try {
    //             const response = await enquiryService.getEnquiriesByOwner();
    //             setEnquiries(response.data || []);
    //         } catch (err) {
    //             console.error("Failed to fetch enquiries:", err);
    //             setError("Failed to load enquiries.");
    //         } finally {
    //             setLoading(false);
    //         }
    //     };
    //     fetchEnquiries();
    // }, []);

    // Loading and Error states are now managed by OwnerDashboard
    // if (loading) return ...
    // if (error) return ...

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
        <div className="space-y-4">
            {enquiries.map((enquiry) => (
                <div key={enquiry._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
                    <div className="flex flex-col md:flex-row gap-6">
                        {/* Property Image & Basic Info */}
                        <div className="w-full md:w-48 shrink-0">
                            <div className="aspect-video rounded-xl overflow-hidden mb-3">
                                <img
                                    src={enquiry.property?.images?.[0]?.url || 'https://via.placeholder.com/300x200?text=No+Image'}
                                    alt={enquiry.property?.name || 'Property'}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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
                                <span className="px-3 py-1 bg-brand-primary/10 text-brand-primary text-xs font-bold rounded-full uppercase tracking-wide">
                                    New Enquiry
                                </span>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-4">
                                <p className="text-gray-700 italic">"{enquiry.message}"</p>
                            </div>

                            <div className="flex flex-wrap gap-3">
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
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default EnquiryList;
