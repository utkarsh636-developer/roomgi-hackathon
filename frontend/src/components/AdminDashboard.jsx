import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    LayoutDashboard, Users, FileText, CheckCircle, XCircle,
    AlertTriangle, Search, Filter, MoreHorizontal, Eye
} from 'lucide-react';

const AdminDashboard = () => {
    // Mock Data for Verification Queue
    const [pendingRequests, setPendingRequests] = useState([
        { id: 101, name: "Arvind Piprewar", property: "Sunshine Stays", date: "Oct 24, 2023", status: "Pending", type: "Owner", risk: "Low" },
        { id: 102, name: "Sneha Reddy", property: "Green View Apts", date: "Oct 25, 2023", status: "Pending", type: "Owner", risk: "Medium" },
        { id: 103, name: "Rajesh Kumar", property: "Student Haven", date: "Oct 26, 2023", status: "In Review", type: "Owner", risk: "Low" },
    ]);

    const stats = [
        { label: 'Total Users', value: '12,450', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Pending Verifications', value: '18', icon: AlertTriangle, color: 'text-orange-600', bg: 'bg-orange-50' },
        { label: 'Verified Properties', value: '850', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
        { label: 'Rejected Requests', value: '124', icon: XCircle, color: 'text-red-600', bg: 'bg-red-50' },
    ];

    return (
        <div className="min-h-screen bg-gray-100 font-montserrat flex">

            {/* Sidebar */}
            <div className="w-64 bg-slate-900 text-white hidden md:block fixed h-full">
                <div className="p-6 border-b border-slate-800">
                    <h2 className="text-2xl font-bold tracking-tight">RoomGi <span className="text-indigo-500">Admin</span></h2>
                </div>
                <nav className="p-4 space-y-2">
                    <a href="#" className="flex items-center gap-3 px-4 py-3 bg-indigo-600 rounded-xl text-white font-medium shadow-lg shadow-indigo-900/20">
                        <LayoutDashboard size={20} /> Dashboard
                    </a>
                    <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors">
                        <Users size={20} /> User Management
                    </a>
                    <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors">
                        <FileText size={20} /> Content Moderation
                    </a>
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 md:ml-64">
                {/* Topbar */}
                <div className="bg-white border-b border-gray-200 p-4 px-8 flex justify-between items-center sticky top-0 z-30">
                    <h1 className="text-xl font-bold text-gray-800">Overview</h1>
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold border border-indigo-200">
                            A
                        </div>
                    </div>
                </div>

                <div className="p-8">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        {stats.map((stat, idx) => (
                            <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                                        <stat.icon size={24} />
                                    </div>
                                    <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">+4.5%</span>
                                </div>
                                <h3 className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                                <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
                            </div>
                        ))}
                    </div>

                    {/* Verification Queue */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">Verification Queue</h3>
                                <p className="text-gray-500 text-sm">Review pending owner documents.</p>
                            </div>
                            <div className="flex gap-3">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input type="text" placeholder="Search request..." className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                                </div>
                                <button className="p-2 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50">
                                    <Filter size={20} />
                                </button>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-gray-600">
                                <thead className="bg-gray-50 text-gray-900 font-bold border-b border-gray-100 uppercase text-xs">
                                    <tr>
                                        <th className="px-6 py-4">Applicant</th>
                                        <th className="px-6 py-4">Property</th>
                                        <th className="px-6 py-4">Submitted On</th>
                                        <th className="px-6 py-4">Risk Level</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {pendingRequests.map((req) => (
                                        <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-gray-900">{req.name}</td>
                                            <td className="px-6 py-4">{req.property}</td>
                                            <td className="px-6 py-4">{req.date}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded text-xs font-bold border ${req.risk === 'Low' ? 'bg-green-50 text-green-700 border-green-200' :
                                                        req.risk === 'Medium' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                                            'bg-red-50 text-red-700 border-red-200'
                                                    }`}>
                                                    {req.risk} Risk
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-700 border border-orange-200">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span> {req.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Link to={`/admin/verify/${req.id}`} className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-xs shadow-sm transition-colors flex items-center gap-1">
                                                        <Eye size={14} /> Review
                                                    </Link>
                                                    <button className="p-1.5 border border-gray-200 rounded-lg text-gray-400 hover:text-gray-600">
                                                        <MoreHorizontal size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-center">
                            <button className="text-indigo-600 text-sm font-bold hover:underline">View All Requests</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
