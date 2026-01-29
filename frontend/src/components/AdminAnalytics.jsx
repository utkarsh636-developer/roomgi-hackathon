import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, Building2, AlertTriangle, PieChart } from 'lucide-react';
import AdminLayout from './AdminLayout';
import StatCard from './admin/StatCard';
import adminService from '../services/adminService';

const AdminAnalytics = () => {
    const [userAnalytics, setUserAnalytics] = useState(null);
    const [propertyAnalytics, setPropertyAnalytics] = useState(null);
    const [reportAnalytics, setReportAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const [users, properties, reports] = await Promise.all([
                adminService.getUserAnalytics(),
                adminService.getPropertyAnalytics(),
                adminService.getReportAnalytics()
            ]);
            setUserAnalytics(users.data);
            setPropertyAnalytics(properties.data);
            setReportAnalytics(reports.data);
        } catch (error) {
            console.error('Failed to fetch analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-center">
                        <div className="w-16 h-16 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-500">Loading analytics...</p>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
                    <p className="text-gray-500 text-sm mt-1">Platform insights and trends</p>
                </div>

                {/* User Analytics */}
                <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Users className="text-brand-primary" size={24} />
                        User Analytics
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Role Distribution */}
                        <div>
                            <p className="text-sm font-medium text-gray-400 mb-3">Role Distribution</p>
                            <div className="space-y-2">
                                {userAnalytics?.roleDistribution?.map((item) => (
                                    <div key={item._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <span className="text-gray-700 capitalize">{item._id}</span>
                                        <span className="font-bold text-gray-900">{item.count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Verification Distribution */}
                        <div>
                            <p className="text-sm font-medium text-gray-400 mb-3">Verification Status</p>
                            <div className="space-y-2">
                                {userAnalytics?.verificationDistribution?.map((item) => (
                                    <div key={item._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <span className="text-gray-700 capitalize">{item._id}</span>
                                        <span className="font-bold text-gray-900">{item.count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* User Growth */}
                        <div>
                            <p className="text-sm font-medium text-gray-400 mb-3">Recent Growth (30 days)</p>
                            <div className="p-4 bg-gray-50 rounded-lg text-center">
                                <TrendingUp className="text-green-500 mx-auto mb-2" size={32} />
                                <p className="text-2xl font-bold text-gray-900">
                                    {userAnalytics?.userGrowth?.reduce((sum, day) => sum + day.count, 0) || 0}
                                </p>
                                <p className="text-xs text-gray-500">New Users</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Property Analytics */}
                <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Building2 className="text-brand-secondary" size={24} />
                        Property Analytics
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Type Distribution */}
                        <div>
                            <p className="text-sm font-medium text-gray-400 mb-3">Property Types</p>
                            <div className="space-y-2">
                                {propertyAnalytics?.typeDistribution?.map((item) => (
                                    <div key={item._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <span className="text-gray-700 capitalize">{item._id}</span>
                                        <span className="font-bold text-gray-900">{item.count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Verification Distribution */}
                        <div>
                            <p className="text-sm font-medium text-gray-400 mb-3">Verification Status</p>
                            <div className="space-y-2">
                                {propertyAnalytics?.verificationDistribution?.map((item) => (
                                    <div key={item._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <span className="text-gray-700 capitalize">{item._id}</span>
                                        <span className="font-bold text-gray-900">{item.count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Top Cities */}
                        <div>
                            <p className="text-sm font-medium text-gray-400 mb-3">Top Cities</p>
                            <div className="space-y-2 max-h-48 overflow-y-auto">
                                {propertyAnalytics?.cityDistribution?.map((item) => (
                                    <div key={item._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <span className="text-gray-700">{item._id}</span>
                                        <span className="font-bold text-gray-900">{item.count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Report Analytics */}
                <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <AlertTriangle className="text-orange-400" size={24} />
                        Report Analytics
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Status Distribution */}
                        <div>
                            <p className="text-sm font-medium text-gray-400 mb-3">Report Status</p>
                            <div className="space-y-2">
                                {reportAnalytics?.statusDistribution?.map((item) => (
                                    <div key={item._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <span className="text-gray-700 capitalize">{item._id}</span>
                                        <span className="font-bold text-gray-900">{item.count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Target Distribution */}
                        <div>
                            <p className="text-sm font-medium text-gray-400 mb-3">Report Targets</p>
                            <div className="space-y-2">
                                {reportAnalytics?.targetDistribution?.map((item) => (
                                    <div key={item._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <span className="text-gray-700">{item._id}</span>
                                        <span className="font-bold text-gray-900">{item.count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Top Reasons */}
                        <div>
                            <p className="text-sm font-medium text-gray-400 mb-3">Top Reasons</p>
                            <div className="space-y-2 max-h-48 overflow-y-auto">
                                {reportAnalytics?.reasonDistribution?.map((item) => (
                                    <div key={item._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <span className="text-gray-700 text-sm">{item._id}</span>
                                        <span className="font-bold text-gray-900">{item.count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminAnalytics;
