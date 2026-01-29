import React, { useState, useEffect } from 'react';
import { AlertTriangle, User, Building2, ChevronLeft, ChevronRight, CheckCircle, XCircle } from 'lucide-react';
import AdminLayout from './AdminLayout';
import StatusBadge from './admin/StatusBadge';
import adminService from '../services/adminService';

const ReportsManagement = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalCount: 0 });
    const [activeTab, setActiveTab] = useState('all'); // all, user, property
    const [statusFilter, setStatusFilter] = useState('');

    useEffect(() => {
        fetchReports();
    }, [pagination.currentPage, activeTab, statusFilter]);

    const fetchReports = async () => {
        try {
            setLoading(true);
            const params = {
                page: pagination.currentPage,
                limit: 20,
                ...(statusFilter && { status: statusFilter }),
                ...(activeTab !== 'all' && { targetModel: activeTab === 'user' ? 'User' : 'Property' })
            };
            const response = await adminService.getAllReports(params);
            setReports(response.data.reports);
            setPagination(response.data.pagination);
        } catch (error) {
            console.error('Failed to fetch reports:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (reportId, status) => {
        try {
            await adminService.updateReportStatus(reportId, status);
            fetchReports();
        } catch (error) {
            console.error('Failed to update report status:', error);
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h2 className="text-2xl font-bold text-white">Reports Management</h2>
                    <p className="text-slate-400 text-sm mt-1">Review and manage user and property reports</p>
                </div>

                {/* Tabs and Filters */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div className="flex gap-2">
                            <button
                                onClick={() => setActiveTab('all')}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'all'
                                        ? 'bg-gradient-to-r from-brand-primary to-brand-secondary text-white'
                                        : 'bg-white/5 text-brand-bg/60 hover:bg-white/10'
                                    }`}
                            >
                                All Reports
                            </button>
                            <button
                                onClick={() => setActiveTab('user')}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${activeTab === 'user'
                                        ? 'bg-gradient-to-r from-brand-primary to-brand-secondary text-white'
                                        : 'bg-white/5 text-brand-bg/60 hover:bg-white/10'
                                    }`}
                            >
                                <User size={16} /> User Reports
                            </button>
                            <button
                                onClick={() => setActiveTab('property')}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${activeTab === 'property'
                                        ? 'bg-gradient-to-r from-brand-primary to-brand-secondary text-white'
                                        : 'bg-white/5 text-brand-bg/60 hover:bg-white/10'
                                    }`}
                            >
                                <Building2 size={16} /> Property Reports
                            </button>
                        </div>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-2 bg-black/30 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-primary"
                        >
                            <option value="">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="resolved">Resolved</option>
                            <option value="dismissed">Dismissed</option>
                        </select>
                    </div>
                </div>

                {/* Reports List */}
                <div className="space-y-4">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : reports.length > 0 ? (
                        reports.map((report) => (
                            <div key={report._id} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-brand-primary/30 transition-all">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        {/* Report Header */}
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="p-2 rounded-lg bg-brand-primary/10 border border-brand-primary/20">
                                                {report.targetModel === 'User' ? (
                                                    <User size={20} className="text-brand-primary" />
                                                ) : (
                                                    <Building2 size={20} className="text-brand-primary" />
                                                )}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="px-2 py-0.5 bg-brand-primary/10 text-brand-primary text-xs font-bold rounded border border-brand-primary/20">
                                                        {report.targetModel}
                                                    </span>
                                                    <span className="text-slate-500">•</span>
                                                    <span className="text-sm font-medium text-white">{report.reason}</span>
                                                </div>
                                                <p className="text-xs text-slate-400 mt-1">
                                                    Reported by: {report.reporter?.username || 'Unknown'} • {new Date(report.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Report Message */}
                                        <p className="text-slate-300 mb-3">{report.message}</p>

                                        {/* Target Info */}
                                        <div className="bg-white/5 rounded-lg p-3 mb-3">
                                            <p className="text-xs text-slate-400 mb-1">Reported {report.targetModel}:</p>
                                            {report.targetModel === 'User' && report.targetUser ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center text-white text-sm font-bold">
                                                        {report.targetUser.username?.[0]?.toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-white">{report.targetUser.username}</p>
                                                        <p className="text-xs text-slate-400">{report.targetUser.email}</p>
                                                    </div>
                                                </div>
                                            ) : report.targetModel === 'Property' && report.targetProperty ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-lg bg-brand-primary flex items-center justify-center">
                                                        <Building2 size={16} className="text-white" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-white capitalize">{report.targetProperty.type}</p>
                                                        <p className="text-xs text-slate-400">{report.targetProperty.location?.city}</p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <p className="text-sm text-slate-400">Target not found</p>
                                            )}
                                        </div>

                                        {/* Status */}
                                        <StatusBadge status={report.status} type="report" />
                                    </div>

                                    {/* Actions */}
                                    {report.status === 'pending' && (
                                        <div className="flex flex-col gap-2">
                                            <button
                                                onClick={() => handleStatusUpdate(report._id, 'resolved')}
                                                className="px-4 py-2 bg-green-600/10 text-green-400 hover:bg-green-600/20 border border-green-600/20 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                                            >
                                                <CheckCircle size={16} /> Resolve
                                            </button>
                                            <button
                                                onClick={() => handleStatusUpdate(report._id, 'dismissed')}
                                                className="px-4 py-2 bg-slate-600/10 text-slate-400 hover:bg-slate-600/20 border border-slate-600/20 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                                            >
                                                <XCircle size={16} /> Dismiss
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-12 text-slate-400">
                            <AlertTriangle size={48} className="mx-auto mb-3 opacity-50" />
                            <p>No reports found</p>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl px-6 py-4 flex items-center justify-between">
                        <p className="text-sm text-slate-400">
                            Showing {((pagination.currentPage - 1) * 20) + 1} to {Math.min(pagination.currentPage * 20, pagination.totalCount)} of {pagination.totalCount} reports
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

export default ReportsManagement;
