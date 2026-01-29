import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
    ChevronLeft, CheckCircle, XCircle, AlertTriangle,
    FileText, ZoomIn, Download, ShieldCheck, Clock
} from 'lucide-react';

const VerificationReview = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [action, setAction] = useState(null); // 'approve', 'reject', 'partial'

    const handleAction = (type) => {
        setAction(type);
        // Simulate API call
        setTimeout(() => {
            alert(`Request ${type === 'approve' ? 'Approved' : type === 'reject' ? 'Rejected' : 'Marked Partial'} Successfully!`);
            navigate('/admin/dashboard');
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-gray-100 font-montserrat flex flex-col h-screen">

            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-4">
                    <Link to="/admin/dashboard" className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors">
                        <ChevronLeft size={24} />
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            Verification Request <span className="text-gray-400">#{id || '101'}</span>
                        </h1>
                        <p className="text-sm text-gray-500 flex items-center gap-2">
                            Submitted 2 days ago • <span className="flex items-center gap-1 text-orange-600 font-bold"><Clock size={12} /> Pending Review</span>
                        </p>
                    </div>
                </div>
                <div>
                    <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-xs font-bold border border-gray-200 uppercase tracking-wide">
                        Admin View
                    </span>
                </div>
            </div>

            {/* Main Content - Split View */}
            <div className="flex-1 flex overflow-hidden">

                {/* Left: Document Viewer */}
                <div className="flex-1 bg-slate-900 p-8 overflow-y-auto flex flex-col items-center justify-center relative">
                    <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm">
                        Aadhaar Card (Front)
                    </div>
                    <div className="max-w-2xl w-full bg-white rounded-lg shadow-2xl overflow-hidden group relative">
                        <img
                            src="https://upload.wikimedia.org/wikipedia/en/c/cf/Aadhaar_Logo.svg"
                            alt="Document Preview"
                            className="w-full h-auto opacity-90 group-hover:opacity-100 transition-opacity p-20 bg-white"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <button className="bg-white text-gray-900 px-4 py-2 rounded-full font-bold shadow-lg flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all">
                                <ZoomIn size={18} /> Zoom
                            </button>
                        </div>
                    </div>

                    {/* Thumbnails */}
                    <div className="mt-8 flex gap-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className={`w-20 h-20 rounded-lg border-2 cursor-pointer transition-all ${i === 1 ? 'border-indigo-500 ring-2 ring-indigo-500/50' : 'border-slate-700 hover:border-slate-500'} bg-slate-800 flex items-center justify-center`}>
                                <FileText className="text-slate-400" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: Data Checklist & Actions */}
                <div className="w-96 bg-white border-l border-gray-200 overflow-y-auto flex flex-col">
                    <div className="p-6 flex-grow">
                        <h3 className="font-bold text-gray-900 mb-6">Applicant Data</h3>

                        <div className="space-y-6">
                            {/* Section 1 */}
                            <div className="pb-6 border-b border-gray-100">
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Personal Info</h4>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs text-gray-500">Full Name</label>
                                        <div className="font-medium text-gray-900 flex justify-between items-center">
                                            Arvind Piprewar
                                            <CheckCircle size={16} className="text-green-500" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500">Property Name</label>
                                        <div className="font-medium text-gray-900">Sunshine Premium Stays</div>
                                    </div>
                                </div>
                            </div>

                            {/* Section 2 */}
                            <div className="pb-6 border-b border-gray-100">
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Document Matches</h4>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-100">
                                        <div className="flex items-center gap-3">
                                            <div className="p-1.5 bg-white rounded text-green-600"><CheckCircle size={14} /></div>
                                            <span className="text-sm font-bold text-green-800">Aadhaar ID Match</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100">
                                        <div className="flex items-center gap-3">
                                            <div className="p-1.5 bg-white rounded text-red-600"><AlertTriangle size={14} /></div>
                                            <span className="text-sm font-bold text-red-800">Electricity Bill Address Mismatch</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Internal Notes */}
                            <div>
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Internal Notes</h4>
                                <textarea
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                    rows="4"
                                    placeholder="Add notes for other admins..."
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    {/* Fixed Bottom Action Panel */}
                    <div className="p-6 border-t border-gray-200 bg-gray-50 sticky bottom-0">
                        <div className="flex flex-col gap-3">
                            <div className="grid grid-cols-2 gap-3">
                                <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg font-bold text-gray-700 hover:bg-gray-100 text-sm">
                                    Request Info
                                </button>
                                <button onClick={() => handleAction('reject')} className="px-4 py-2 bg-white border border-red-200 text-red-600 rounded-lg font-bold hover:bg-red-50 flex items-center justify-center gap-2 text-sm">
                                    <XCircle size={16} /> Reject
                                </button>
                            </div>
                            <button onClick={() => handleAction('approve')} className="w-full px-4 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 transition-all">
                                <ShieldCheck size={20} /> Approve & Verify
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default VerificationReview;
