import React from 'react';
import { Link } from 'react-router-dom';
import { Home, MapPin, Edit, Trash2, Clock, ShieldCheck, CheckCircle, AlertCircle } from 'lucide-react';

const OwnerPropertyList = ({ properties, onDeleteClick }) => {
    if (properties.length === 0) {
        return (
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-12 text-center text-gray-500">
                    You haven't listed any properties yet.
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Home size={20} className="text-brand-primary" /> My Listings
                </h3>
                <div className="text-sm text-gray-500">
                    Showing {properties.length} listings
                </div>
            </div>

            <div className="divide-y divide-gray-100">
                {properties.map((property) => (
                    <div key={property._id} className="p-6 hover:bg-gray-50 transition-colors group">
                        <div className="flex flex-col md:flex-row gap-6 items-center">
                            <Link to={`/property/${property._id}`} className="contents">
                                <div className="w-full md:w-48 h-32 rounded-xl overflow-hidden shadow-sm">
                                    <img
                                        src={property.images?.[0]?.url || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=800'}
                                        alt={property.type}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>

                                <div className="flex-1 w-full text-center md:text-left">
                                    <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2 justify-center md:justify-start">
                                        <h4 className="text-lg font-bold text-gray-900 capitalize group-hover:text-brand-primary transition-colors">{property.title || property.name || `${property.type} in ${property.location?.city}`}</h4>
                                        {property.verification?.status === 'approved' ? (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200">
                                                <CheckCircle size={12} /> Verified
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-100 text-orange-700 border border-orange-200 uppercase">
                                                <AlertCircle size={12} /> {property.verification?.status || 'Pending'}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-500 text-sm justify-center md:justify-start mb-4 md:mb-0">
                                        <MapPin size={16} /> {property.location?.addressLine}, {property.location?.city}
                                    </div>
                                </div>

                                <div className="flex gap-8 text-center md:text-left">
                                    <div>
                                        <p className="text-xs text-gray-400 font-bold uppercase">Rent</p>
                                        <p className="font-bold text-gray-900">₹{property.rent?.toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 font-bold uppercase">Status</p>
                                        <p className={`font-bold ${property.status === 'available' ? 'text-green-600' : 'text-red-600'} capitalize`}>
                                            {property.status}
                                        </p>
                                    </div>
                                </div>
                            </Link>

                            <div className="flex gap-2 w-full md:w-auto mt-4 md:mt-0">
                                <Link
                                    to={`/edit-property/${property._id}`}
                                    className="flex-1 md:flex-none px-4 py-2 border border-brand-secondary/20 rounded-lg text-brand-secondary font-bold hover:bg-brand-bg hover:text-brand-primary transition-colors flex items-center justify-center gap-2"
                                >
                                    <Edit size={16} /> Edit
                                </Link>
                                <button
                                    onClick={() => onDeleteClick(property._id)}
                                    className="p-2 border border-gray-200 rounded-lg text-gray-400 hover:text-red-500 hover:border-red-200 transition-colors"
                                >
                                    <Trash2 size={20} />
                                </button>
                                {property.verification?.status !== 'approved' && (
                                    (property.verification?.status === 'pending' && property.documents?.length > 0) ? (
                                        <div className="flex-1 md:flex-none px-4 py-2 bg-blue-50 text-blue-600 font-bold rounded-lg border border-blue-200 flex items-center justify-center gap-2">
                                            <Clock size={16} /> Under Review
                                        </div>
                                    ) : (
                                        <Link
                                            to={`/property/${property._id}/verify`}
                                            className={`flex-1 md:flex-none px-4 py-2 ${property.verification?.status === 'rejected' ? 'bg-red-600 hover:bg-red-700' : 'bg-brand-primary hover:bg-brand-secondary'} text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2`}
                                        >
                                            <ShieldCheck size={16} /> {property.verification?.status === 'rejected' ? 'Re-Verify' : 'Verify'}
                                        </Link>
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OwnerPropertyList;
