import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import { Lock, Mail, AlertCircle, Loader2, ShieldCheck } from 'lucide-react';

const AdminLoginPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError(''); // Clear error on input
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await authService.login(formData);

            const user = authService.getCurrentUser();
            if (user && user.role === 'admin') {
                navigate('/admin/dashboard');
            } else {
                // Log out immediately if not admin
                await authService.logout();
                setError('Access Denied: You do not have administrator privileges.');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-brand-dark font-montserrat p-4">
            <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700">
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <div className="bg-brand-primary p-3 rounded-full">
                            <ShieldCheck className="w-8 h-8 text-white" />
                        </div>
                    </div>
                    <h2 className="text-3xl font-bold text-white">Admin Portal</h2>
                    <p className="text-gray-400 mt-2">Secure access for administrators only</p>
                </div>

                {error && (
                    <div className="bg-red-900/50 text-red-200 p-3 rounded-lg mb-6 flex items-center gap-2 text-sm font-medium border border-red-800">
                        <AlertCircle size={18} />
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-300 mb-2">Email Address</label>
                        <div className="relative">
                            <input
                                type="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-xl focus:ring-2 focus:ring-brand-primary focus:bg-gray-700 text-white outline-none transition-all placeholder-gray-500"
                                placeholder="admin@example.com"
                            />
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-300 mb-2">Password</label>
                        <div className="relative">
                            <input
                                type="password"
                                name="password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-xl focus:ring-2 focus:ring-brand-primary focus:bg-gray-700 text-white outline-none transition-all placeholder-gray-500"
                                placeholder="••••••••"
                            />
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-brand-primary text-white py-3.5 rounded-xl font-bold hover:bg-brand-secondary focus:ring-4 focus:ring-brand-secondary/50 transition-all flex items-center justify-center gap-2 shadow-lg"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : 'Login to Dashboard'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLoginPage;
