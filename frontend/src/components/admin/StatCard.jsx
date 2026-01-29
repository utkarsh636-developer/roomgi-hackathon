import React from 'react';

const StatCard = ({ icon: Icon, label, value, trend, color = 'indigo' }) => {
    const colorClasses = {
        indigo: 'from-indigo-600 to-indigo-500',
        purple: 'from-purple-600 to-purple-500',
        green: 'from-green-600 to-green-500',
        orange: 'from-orange-600 to-orange-500',
        red: 'from-red-600 to-red-500',
        blue: 'from-blue-600 to-blue-500',
        'brand': 'from-brand-primary to-brand-primary/80',
        'brand-dark': 'from-brand-secondary to-brand-secondary/80',
    };

    return (
        <div className="bg-white border border-gray-100 rounded-2xl p-6 hover:border-brand-primary/20 transition-all duration-300 hover:shadow-lg hover:shadow-brand-primary/5">
            <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${colorClasses[color]} shadow-lg text-white`}>
                    <Icon size={24} />
                </div>
                {trend && (
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${trend > 0
                        ? 'bg-green-100 text-green-700 border border-green-200'
                        : 'bg-red-100 text-red-700 border border-red-200'
                        }`}>
                        {trend > 0 ? '+' : ''}{trend}%
                    </span>
                )}
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">{value}</h3>
            <p className="text-gray-500 text-sm font-medium">{label}</p>
        </div>
    );
};

export default StatCard;
