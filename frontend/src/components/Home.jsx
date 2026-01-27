import React from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

const Home = () => {
    const navigate = useNavigate();
    const user = authService.getCurrentUser();

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8 font-montserrat">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Welcome, {user?.username || 'User'}!</h1>
                    <button
                        onClick={handleLogout}
                        className="bg-red-50 text-red-600 px-4 py-2 rounded-lg font-bold hover:bg-red-100 transition-colors"
                    >
                        Logout
                    </button>
                </div>

                <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6">
                    <h2 className="text-xl font-bold text-indigo-900 mb-2">You are logged in!</h2>
                    <p className="text-indigo-700">
                        This is a protected home page. Your access token is stored and being sent with requests.
                    </p>
                    <div className="mt-4 p-4 bg-white rounded-lg text-sm font-mono overflow-auto border border-gray-200">
                        {JSON.stringify(user, null, 2)}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
