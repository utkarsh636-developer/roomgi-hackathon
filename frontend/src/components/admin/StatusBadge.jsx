import React from 'react';

const StatusBadge = ({ status, type = 'verification' }) => {
    const getStatusStyles = () => {
        if (type === 'verification') {
            switch (status) {
                case 'approved':
                    return 'bg-green-500/10 text-green-400 border-green-500/20';
                case 'rejected':
                    return 'bg-red-500/10 text-red-400 border-red-500/20';
                case 'pending':
                    return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
                default:
                    return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
            }
        } else if (type === 'block') {
            return status 
                ? 'bg-red-500/10 text-red-400 border-red-500/20'
                : 'bg-green-500/10 text-green-400 border-green-500/20';
        } else if (type === 'report') {
            switch (status) {
                case 'resolved':
                    return 'bg-green-500/10 text-green-400 border-green-500/20';
                case 'dismissed':
                    return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
                case 'pending':
                    return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
                default:
                    return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
            }
        }
    };

    const getStatusText = () => {
        if (type === 'block') {
            return status ? 'Blocked' : 'Active';
        }
        return status?.charAt(0).toUpperCase() + status?.slice(1) || 'Unknown';
    };

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusStyles()}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${status === 'pending' ? 'animate-pulse' : ''} ${
                type === 'verification' && status === 'approved' ? 'bg-green-400' :
                type === 'verification' && status === 'rejected' ? 'bg-red-400' :
                type === 'verification' && status === 'pending' ? 'bg-orange-400' :
                type === 'block' && status ? 'bg-red-400' :
                type === 'block' && !status ? 'bg-green-400' :
                type === 'report' && status === 'resolved' ? 'bg-green-400' :
                type === 'report' && status === 'dismissed' ? 'bg-slate-400' :
                'bg-orange-400'
            }`} />
            {getStatusText()}
        </span>
    );
};

export default StatusBadge;
