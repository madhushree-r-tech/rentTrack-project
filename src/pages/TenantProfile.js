import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';

export default function TenantProfile() {
    const { id } = useParams();
    const [tenant, setTenant] = useState(null);
    const [paymentHistory, setPaymentHistory] = useState([]);
    const [currentMonthStatus, setCurrentMonthStatus] = useState(null);
    const [showHistory, setShowHistory] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        Promise.all([
            api.get(`/api/tenants/${id}`),
            api.get(`/api/tenants/${id}/payment-history`)
        ]).then(([tenantRes, historyRes]) => {
            setTenant(tenantRes.data);
            setPaymentHistory(historyRes.data);
            setCurrentMonthStatus(historyRes.data[0]);
            setLoading(false);
        }).catch(() => navigate('/login'));
    }, [id, navigate]);

    if (loading) return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50">

            {/* Navbar */}
            <div className="bg-white border-b border-slate-200 px-6 flex justify-between items-center h-16 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-black text-sm">R</span>
                    </div>
                    <div>
                        <h1 className="text-slate-800 font-black text-base leading-none">RentTrack</h1>
                        <p className="text-slate-400 text-xs">{localStorage.getItem('branchName')}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/warden/tenants')}
                        className="text-slate-500 hover:text-blue-600 text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-blue-50 transition"
                    >
                        ← Back to Tenants
                    </button>
                    <button
                        onClick={() => { localStorage.clear(); navigate('/login'); }}
                        className="text-slate-500 hover:text-red-500 text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-red-50 transition"
                    >
                        Logout
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-6 py-8">

                {/* Profile Card */}
                <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 mb-6">
                    <div className="flex items-start gap-6">
                        <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                            {tenant.profilePicture ? (
                                <img src={tenant.profilePicture} alt={tenant.name} className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-blue-600 text-3xl font-black">
                                    {tenant.name.charAt(0).toUpperCase()}
                                </span>
                            )}
                        </div>
                        <div className="flex-1">
                            <h2 className="text-2xl font-black text-slate-800">{tenant.name}</h2>
                            <p className="text-slate-400 text-sm mt-1">Room {tenant.room?.roomName}</p>

                            <div className="grid grid-cols-2 gap-4 mt-4">
                                <div>
                                    <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Phone</p>
                                    <p className="text-slate-700 text-sm font-medium">{tenant.phone}</p>
                                </div>
                                <div>
                                    <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Email</p>
                                    <p className="text-slate-700 text-sm font-medium">{tenant.email || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Emergency Contact</p>
                                    <p className="text-slate-700 text-sm font-medium">{tenant.emergencyContact || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Joining Date</p>
                                    <p className="text-slate-700 text-sm font-medium">{tenant.joiningDate || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Address</p>
                                    <p className="text-slate-700 text-sm font-medium">{tenant.address || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Room Rent</p>
                                    <p className="text-slate-700 text-sm font-medium">₹{tenant.room?.rent?.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Current Month Status */}
                <div className={`rounded-xl p-6 mb-6 border ${currentMonthStatus?.status === 'PAID' ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100'}`}>
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider mb-1 ${currentMonthStatus?.status === 'PAID' ? 'text-emerald-600' : 'text-red-500'}">
                                Current Month — {currentMonthStatus?.month}
                            </p>
                            <p className={`text-3xl font-black ${currentMonthStatus?.status === 'PAID' ? 'text-emerald-600' : 'text-red-500'}`}>
                                {currentMonthStatus?.status === 'PAID' ? 'PAID' : 'UNPAID'}
                            </p>
                            <p className={`text-sm mt-1 ${currentMonthStatus?.status === 'PAID' ? 'text-emerald-500' : 'text-red-400'}`}>
                                ₹{currentMonthStatus?.amount?.toLocaleString()}
                            </p>
                        </div>
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center ${currentMonthStatus?.status === 'PAID' ? 'bg-emerald-100' : 'bg-red-100'}`}>
                            <span className="text-3xl">{currentMonthStatus?.status === 'PAID' ? '✓' : '✗'}</span>
                        </div>
                    </div>
                </div>

                {/* Payment History */}
                <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                        <h3 className="text-slate-800 font-bold text-base">Payment History</h3>
                        <button
                            onClick={() => setShowHistory(!showHistory)}
                            className="text-blue-600 text-sm font-semibold hover:underline"
                        >
                            {showHistory ? 'Hide' : 'View Previous Months'}
                        </button>
                    </div>
                    {showHistory && (
                        <div className="divide-y divide-slate-50">
                            {paymentHistory.map((payment, index) => (
                                <div key={index} className="px-6 py-4 flex justify-between items-center">
                                    <p className="text-slate-600 text-sm font-medium">{payment.month}</p>
                                    <div className="flex items-center gap-4">
                                        <p className="text-slate-500 text-sm">₹{payment.amount?.toLocaleString()}</p>
                                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${payment.status === 'PAID' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-500 border border-red-100'}`}>
                                            {payment.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}