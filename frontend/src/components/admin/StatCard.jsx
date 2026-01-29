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
        <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 hover:border-slate-600/50 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-900/20">
            <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${colorClasses[color]} shadow-lg`}>
                    <Icon size={24} className="text-white" />
                </div>
                {trend && (
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${trend > 0
                            ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                            : 'bg-red-500/10 text-red-400 border border-red-500/20'
                        }`}>
                        {trend > 0 ? '+' : ''}{trend}%
                    </span>
                )}
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">{value}</h3>
            <p className="text-slate-400 text-sm font-medium">{label}</p>
        </div>
    );
};

export default StatCard;
