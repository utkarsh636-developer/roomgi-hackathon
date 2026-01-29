import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, Users, Building2, AlertTriangle,
    CheckCircle, BarChart3, LogOut, Menu, X
} from 'lucide-react';
import authService from '../services/authService';

const AdminLayout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = React.useState(true);
    const location = useLocation();
    const navigate = useNavigate();
    const user = authService.getCurrentUser();

    const handleLogout = async () => {
        await authService.logout();
        navigate('/');
    };

    const navItems = [
        { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/admin/users', icon: Users, label: 'Users' },
        { path: '/admin/properties', icon: Building2, label: 'Properties' },
        { path: '/admin/reports', icon: AlertTriangle, label: 'Reports' },
        { path: '/admin/verifications', icon: CheckCircle, label: 'Verifications' },
        { path: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-brand-dark via-[#2c301b] to-black font-sans flex">
            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-brand-dark/95 backdrop-blur-xl border-r border-white/10 transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="p-6 border-b border-white/10">
                        <h2 className="text-2xl font-bold text-brand-primary">
                            RoomGi Admin
                        </h2>
                        <p className="text-xs text-slate-400 mt-1">Management Portal</p>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${isActive
                                        ? 'bg-brand-primary text-white shadow-lg shadow-brand-dark/30'
                                        : 'text-brand-bg/60 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    <Icon size={20} />
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User Profile & Logout */}
                    <div className="p-4 border-t border-white/10">
                        <div className="flex items-center gap-3 mb-3 p-3 rounded-xl bg-white/5">
                            <div className="w-10 h-10 rounded-full bg-brand-primary flex items-center justify-center text-white font-bold">
                                {user?.username?.[0]?.toUpperCase() || 'A'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">{user?.username || 'Admin'}</p>
                                <p className="text-xs text-slate-400 truncate">{user?.email || ''}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-600/10 text-red-400 hover:bg-red-600/20 border border-red-600/20 transition-all duration-200 font-medium"
                        >
                            <LogOut size={18} />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : ''}`}>
                {/* Top Bar */}
                <header className="sticky top-0 z-40 bg-brand-dark/80 backdrop-blur-xl border-b border-white/10">
                    <div className="flex items-center justify-between px-6 py-4">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors"
                        >
                            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                        <h1 className="text-xl font-bold text-white">
                            {navItems.find(item => item.path === location.pathname)?.label || 'Admin Panel'}
                        </h1>
                        <div className="w-10" /> {/* Spacer for alignment */}
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-6">
                    {children}
                </main>
            </div>

            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
        </div>
    );
};

export default AdminLayout;
