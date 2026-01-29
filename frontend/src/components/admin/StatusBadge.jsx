import React from 'react';

const StatusBadge = ({ status, type = 'verification' }) => {
    const getStatusStyles = () => {
        if (type === 'verification') {
            switch (status) {
                case 'approved':
                    return 'bg-green-100 text-green-700 border-green-200';
                case 'rejected':
                    return 'bg-red-100 text-red-700 border-red-200';
                case 'pending':
                    return 'bg-orange-100 text-orange-700 border-orange-200';
                default:
                    return 'bg-gray-100 text-gray-700 border-gray-200';
            }
        } else if (type === 'block') {
            return status
                ? 'bg-red-100 text-red-700 border-red-200'
                : 'bg-green-100 text-green-700 border-green-200';
        } else if (type === 'report') {
            switch (status) {
                case 'resolved':
                    return 'bg-green-100 text-green-700 border-green-200';
                case 'dismissed':
                    return 'bg-gray-100 text-gray-700 border-gray-200';
                case 'pending':
                    return 'bg-orange-100 text-orange-700 border-orange-200';
                default:
                    return 'bg-gray-100 text-gray-700 border-gray-200';
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
            <span className={`w-1.5 h-1.5 rounded-full ${status === 'pending' ? 'animate-pulse' : ''} ${type === 'verification' && status === 'approved' ? 'bg-green-600' :
                    type === 'verification' && status === 'rejected' ? 'bg-red-600' :
                        type === 'verification' && status === 'pending' ? 'bg-orange-600' :
                            type === 'block' && status ? 'bg-red-600' :
                                type === 'block' && !status ? 'bg-green-600' :
                                    type === 'report' && status === 'resolved' ? 'bg-green-600' :
                                        type === 'report' && status === 'dismissed' ? 'bg-gray-500' :
                                            'bg-orange-600'
                }`} />
            {getStatusText()}
        </span>
    );
};

export default StatusBadge;
