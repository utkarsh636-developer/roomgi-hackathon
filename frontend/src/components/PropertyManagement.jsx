import React, { useState, useEffect } from 'react';
import { Search, Ban, CheckCircle, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import AdminLayout from './AdminLayout';
import StatusBadge from './admin/StatusBadge';
import adminService from '../services/adminService';

const PropertyManagement = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalCount: 0 });
    const [filters, setFilters] = useState({
        search: '',
        type: '',
        verificationStatus: '',
        isBlocked: '',
        city: ''
    });

    useEffect(() => {
        fetchProperties();
    }, [pagination.currentPage, filters]);

    const fetchProperties = async () => {
        try {
            setLoading(true);
            const params = {
                page: pagination.currentPage,
                limit: 20,
                ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== ''))
            };
            const response = await adminService.getAllProperties(params);
            setProperties(response.data.properties);
            setPagination(response.data.pagination);
        } catch (error) {
            console.error('Failed to fetch properties:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleBlockToggle = async (propertyId) => {
        try {
            await adminService.toggleBlockProperty(propertyId);
            fetchProperties();
        } catch (error) {
            console.error('Failed to toggle block:', error);
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setPagination(prev => ({ ...prev, currentPage: 1 }));
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h2 className="text-2xl font-bold text-white">Property Management</h2>
                    <p className="text-slate-400 text-sm mt-1">Manage and moderate property listings</p>
                </div>

                {/* Filters */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search properties..."
                                value={filters.search}
                                onChange={(e) => handleFilterChange('search', e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-black/30 border border-white/10 rounded-lg text-white placeholder-brand-bg/50 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                            />
                        </div>
                        <select
                            value={filters.type}
                            onChange={(e) => handleFilterChange('type', e.target.value)}
                            className="px-4 py-2 bg-black/30 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-primary"
                        >
                            <option value="">All Types</option>
                            <option value="flat">Flat</option>
                            <option value="PG">PG</option>
                            <option value="hostel">Hostel</option>
                        </select>
                        <input
                            type="text"
                            placeholder="City"
                            value={filters.city}
                            onChange={(e) => handleFilterChange('city', e.target.value)}
                            className="px-4 py-2 bg-black/30 border border-white/10 rounded-lg text-white placeholder-brand-bg/50 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                        />
                        <select
                            value={filters.verificationStatus}
                            onChange={(e) => handleFilterChange('verificationStatus', e.target.value)}
                            className="px-4 py-2 bg-black/30 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-primary"
                        >
                            <option value="">All Verification</option>
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                        </select>
                        <select
                            value={filters.isBlocked}
                            onChange={(e) => handleFilterChange('isBlocked', e.target.value)}
                            className="px-4 py-2 bg-black/30 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-primary"
                        >
                            <option value="">All Status</option>
                            <option value="false">Active</option>
                            <option value="true">Blocked</option>
                        </select>
                    </div>
                </div>

                {/* Properties Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? (
                        <div className="col-span-full flex items-center justify-center py-12">
                            <div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : properties.length > 0 ? (
                        properties.map((property) => (
                            <div key={property._id} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden hover:border-brand-primary/30 transition-all duration-300">
                                {/* Property Image */}
                                <div className="relative h-48 bg-gradient-to-br from-brand-secondary/20 to-brand-primary/20">
                                    {property.images?.[0]?.url ? (
                                        <img
                                            src={property.images[0].url}
                                            alt={property.type}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <MapPin size={48} className="text-slate-600" />
                                        </div>
                                    )}
                                    <div className="absolute top-3 right-3">
                                        <StatusBadge status={property.isBlocked} type="block" />
                                    </div>
                                </div>

                                {/* Property Details */}
                                <div className="p-4">
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <h3 className="font-bold text-white capitalize">{property.type}</h3>
                                            <p className="text-sm text-slate-400 flex items-center gap-1 mt-1">
                                                <MapPin size={14} />
                                                {property.location?.city}
                                            </p>
                                        </div>
                                        <StatusBadge status={property.verification?.status} type="verification" />
                                    </div>

                                    <div className="flex items-center justify-between text-sm mb-3">
                                        <span className="text-slate-400">Rent</span>
                                        <span className="font-bold text-white">₹{property.rent?.toLocaleString()}/mo</span>
                                    </div>

                                    <div className="flex items-center gap-2 mb-3 text-xs">
                                        <div className="flex items-center gap-1 text-slate-400">
                                            <span>Owner:</span>
                                            <span className="text-white">{property.owner?.username}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleBlockToggle(property._id)}
                                            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${property.isBlocked
                                                    ? 'bg-green-600/10 text-green-400 hover:bg-green-600/20 border border-green-600/20'
                                                    : 'bg-red-600/10 text-red-400 hover:bg-red-600/20 border border-red-600/20'
                                                }`}
                                        >
                                            {property.isBlocked ? <><CheckCircle size={16} className="inline mr-1" /> Unblock</> : <><Ban size={16} className="inline mr-1" /> Block</>}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12 text-slate-400">
                            No properties found
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl px-6 py-4 flex items-center justify-between">
                        <p className="text-sm text-slate-400">
                            Showing {((pagination.currentPage - 1) * 20) + 1} to {Math.min(pagination.currentPage * 20, pagination.totalCount)} of {pagination.totalCount} properties
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
                                disabled={pagination.currentPage === 1}
                                className="p-2 rounded-lg bg-white/5 text-slate-300 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <span className="text-sm text-slate-300">
                                Page {pagination.currentPage} of {pagination.totalPages}
                            </span>
                            <button
                                onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
                                disabled={pagination.currentPage === pagination.totalPages}
                                className="p-2 rounded-lg bg-white/5 text-slate-300 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default PropertyManagement;
