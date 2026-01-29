import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Users, Building2, AlertTriangle, CheckCircle,
    XCircle, Clock, TrendingUp, Eye, ArrowRight
} from 'lucide-react';
import AdminLayout from './AdminLayout';
import StatCard from './admin/StatCard';
import StatusBadge from './admin/StatusBadge';
import adminService from '../services/adminService';

const NewAdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [pendingUsers, setPendingUsers] = useState([]);
    const [pendingProperties, setPendingProperties] = useState([]);
    const [recentReports, setRecentReports] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const [statsData, usersData, propertiesData, reportsData] = await Promise.all([
                adminService.getDashboardStats(),
                adminService.getPendingUserVerifications(),
                adminService.getPendingPropertyVerifications(),
                adminService.getAllReports({ limit: 5, status: 'pending' })
            ]);

            setStats(statsData.data);
            setPendingUsers(usersData.data.slice(0, 5));
            setPendingProperties(propertiesData.data.slice(0, 5));
            setRecentReports(reportsData.data.reports || []);
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-center">
                        <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-slate-400">Loading dashboard...</p>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Welcome Section */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 shadow-xl">
                    <h2 className="text-2xl font-bold text-white mb-2">Welcome back, Admin! 👋</h2>
                    <p className="text-indigo-100">Here's what's happening with your platform today.</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        icon={Users}
                        label="Total Users"
                        value={stats?.totalUsers || 0}
                        color="indigo"
                    />
                    <StatCard
                        icon={Building2}
                        label="Total Properties"
                        value={stats?.totalProperties || 0}
                        color="purple"
                    />
                    <StatCard
                        icon={Clock}
                        label="Pending Verifications"
                        value={(stats?.pendingUserVerifications || 0) + (stats?.pendingPropertyVerifications || 0)}
                        color="orange"
                    />
                    <StatCard
                        icon={AlertTriangle}
                        label="Active Reports"
                        value={stats?.activeReports || 0}
                        color="red"
                    />
                </div>

                {/* Secondary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <StatCard
                        icon={XCircle}
                        label="Blocked Users"
                        value={stats?.blockedUsers || 0}
                        color="red"
                    />
                    <StatCard
                        icon={XCircle}
                        label="Blocked Properties"
                        value={stats?.blockedProperties || 0}
                        color="red"
                    />
                </div>

                {/* Pending Verifications Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Pending User Verifications */}
                    <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl overflow-hidden">
                        <div className="p-6 border-b border-slate-700/50">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                        <CheckCircle className="text-indigo-400" size={20} />
                                        Pending User Verifications
                                    </h3>
                                    <p className="text-sm text-slate-400 mt-1">
                                        {stats?.pendingUserVerifications || 0} users awaiting review
                                    </p>
                                </div>
                                <Link
                                    to="/admin/verifications"
                                    className="text-indigo-400 hover:text-indigo-300 text-sm font-medium flex items-center gap-1"
                                >
                                    View All <ArrowRight size={16} />
                                </Link>
                            </div>
                        </div>
                        <div className="divide-y divide-slate-700/50">
                            {pendingUsers.length > 0 ? (
                                pendingUsers.map((user) => (
                                    <div key={user._id} className="p-4 hover:bg-slate-700/30 transition-colors">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">
                                                    {user.username?.[0]?.toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-white">{user.username}</p>
                                                    <p className="text-xs text-slate-400">{user.email}</p>
                                                </div>
                                            </div>
                                            <Link
                                                to="/admin/verifications"
                                                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-medium flex items-center gap-1 transition-colors"
                                            >
                                                <Eye size={14} /> Review
                                            </Link>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-8 text-center text-slate-400">
                                    <CheckCircle size={48} className="mx-auto mb-2 opacity-50" />
                                    <p>No pending user verifications</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Pending Property Verifications */}
                    <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl overflow-hidden">
                        <div className="p-6 border-b border-slate-700/50">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                        <Building2 className="text-purple-400" size={20} />
                                        Pending Property Verifications
                                    </h3>
                                    <p className="text-sm text-slate-400 mt-1">
                                        {stats?.pendingPropertyVerifications || 0} properties awaiting review
                                    </p>
                                </div>
                                <Link
                                    to="/admin/verifications"
                                    className="text-purple-400 hover:text-purple-300 text-sm font-medium flex items-center gap-1"
                                >
                                    View All <ArrowRight size={16} />
                                </Link>
                            </div>
                        </div>
                        <div className="divide-y divide-slate-700/50">
                            {pendingProperties.length > 0 ? (
                                pendingProperties.map((property) => (
                                    <div key={property._id} className="p-4 hover:bg-slate-700/30 transition-colors">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                                                    <Building2 size={20} className="text-white" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-white capitalize">{property.type}</p>
                                                    <p className="text-xs text-slate-400">{property.location?.city}</p>
                                                </div>
                                            </div>
                                            <Link
                                                to="/admin/verifications"
                                                className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-medium flex items-center gap-1 transition-colors"
                                            >
                                                <Eye size={14} /> Review
                                            </Link>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-8 text-center text-slate-400">
                                    <CheckCircle size={48} className="mx-auto mb-2 opacity-50" />
                                    <p>No pending property verifications</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Recent Reports */}
                <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl overflow-hidden">
                    <div className="p-6 border-b border-slate-700/50">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    <AlertTriangle className="text-orange-400" size={20} />
                                    Recent Reports
                                </h3>
                                <p className="text-sm text-slate-400 mt-1">Latest reports requiring attention</p>
                            </div>
                            <Link
                                to="/admin/reports"
                                className="text-orange-400 hover:text-orange-300 text-sm font-medium flex items-center gap-1"
                            >
                                View All <ArrowRight size={16} />
                            </Link>
                        </div>
                    </div>
                    <div className="divide-y divide-slate-700/50">
                        {recentReports.length > 0 ? (
                            recentReports.map((report) => (
                                <div key={report._id} className="p-4 hover:bg-slate-700/30 transition-colors">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="px-2 py-0.5 bg-orange-500/10 text-orange-400 text-xs font-bold rounded border border-orange-500/20">
                                                    {report.targetModel}
                                                </span>
                                                <span className="text-slate-500">•</span>
                                                <span className="text-xs text-slate-400">
                                                    {report.reason}
                                                </span>
                                            </div>
                                            <p className="text-sm text-slate-300 line-clamp-2">{report.message}</p>
                                            <p className="text-xs text-slate-500 mt-2">
                                                Reported by: {report.reporter?.username || 'Unknown'}
                                            </p>
                                        </div>
                                        <Link
                                            to={`/admin/reports`}
                                            className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-medium flex items-center gap-1 transition-colors whitespace-nowrap"
                                        >
                                            <Eye size={14} /> Review
                                        </Link>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center text-slate-400">
                                <CheckCircle size={48} className="mx-auto mb-2 opacity-50" />
                                <p>No pending reports</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Link
                        to="/admin/users"
                        className="p-6 bg-gradient-to-br from-indigo-600/20 to-indigo-600/5 border border-indigo-600/30 rounded-xl hover:border-indigo-600/50 transition-all duration-300 group"
                    >
                        <Users className="text-indigo-400 mb-3 group-hover:scale-110 transition-transform" size={32} />
                        <h4 className="text-white font-bold mb-1">Manage Users</h4>
                        <p className="text-slate-400 text-sm">View, block, and verify users</p>
                    </Link>
                    <Link
                        to="/admin/properties"
                        className="p-6 bg-gradient-to-br from-purple-600/20 to-purple-600/5 border border-purple-600/30 rounded-xl hover:border-purple-600/50 transition-all duration-300 group"
                    >
                        <Building2 className="text-purple-400 mb-3 group-hover:scale-110 transition-transform" size={32} />
                        <h4 className="text-white font-bold mb-1">Manage Properties</h4>
                        <p className="text-slate-400 text-sm">View, block, and verify properties</p>
                    </Link>
                    <Link
                        to="/admin/analytics"
                        className="p-6 bg-gradient-to-br from-green-600/20 to-green-600/5 border border-green-600/30 rounded-xl hover:border-green-600/50 transition-all duration-300 group"
                    >
                        <TrendingUp className="text-green-400 mb-3 group-hover:scale-110 transition-transform" size={32} />
                        <h4 className="text-white font-bold mb-1">View Analytics</h4>
                        <p className="text-slate-400 text-sm">Insights and trends</p>
                    </Link>
                </div>
            </div>
        </AdminLayout>
    );
};

export default NewAdminDashboard;
