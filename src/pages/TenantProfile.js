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
    const [marking, setMarking] = useState(false);
    const navigate = useNavigate();

    const currentMonth = new Date().toLocaleString('en-US', { month: 'long' }) + '-' + new Date().getFullYear();

    const fetchData = () => {
        Promise.all([
            api.get(`/api/tenants/${id}`),
            api.get(`/api/tenants/${id}/payment-history`)
        ]).then(([tenantRes, historyRes]) => {
            setTenant(tenantRes.data);
            setPaymentHistory(historyRes.data);
            setCurrentMonthStatus(historyRes.data[0]);
            setLoading(false);
        }).catch(() => navigate('/login'));
    };

    useEffect(() => { fetchData(); }, [id]);

    const handleMarkAsPaid = async (rent) => {
        setMarking(true);
        try {
            await api.post('/api/payments', {
                tenantId: parseInt(id),
                amountPaid: rent,
                month: currentMonth,
                status: 'PAID'
            });
            fetchData();
        } catch (err) {
            alert('Error marking as paid: ' + err.message);
        }
        setMarking(false);
    };

    const handleRemoveTenant = async () => {
        if (!window.confirm(`Are you sure you want to remove ${tenant.name}?`)) return;
        try {
            await api.put(`/api/tenants/${id}/deactivate`);
            navigate('/warden/tenants');
        } catch (err) {
            alert('Error removing tenant: ' + err.message);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    const rent = tenant.room?.rent;

    return (
        <div className="min-h-screen bg-slate-50 flex">

            {/* Sidebar */}
            <div className="w-64 bg-white border-r border-slate-200 flex flex-col fixed h-full">
                <div className="px-6 py-5 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-black text-sm">R</span>
                        </div>
                        <div>
                            <h1 className="text-slate-800 font-black text-base leading-none">RentTrack</h1>
                            <p className="text-slate-400 text-xs mt-0.5">{localStorage.getItem('branchName')}</p>
                        </div>
                    </div>
                </div>
                <nav className="flex-1 px-4 py-6 space-y-1">
                    <button onClick={() => navigate('/warden/dashboard')} className="w-full text-left px-4 py-2.5 rounded-lg text-slate-500 hover:bg-slate-50 text-sm font-medium transition">
                        Dashboard
                    </button>
                    <button onClick={() => navigate('/warden/tenants')} className="w-full text-left px-4 py-2.5 rounded-lg bg-blue-50 text-blue-600 text-sm font-semibold">
                        Tenants
                    </button>
                </nav>
                <div className="px-4 py-4 border-t border-slate-100">
                    <div className="flex items-center gap-3 px-2">
                        <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-slate-600 font-semibold text-sm">{localStorage.getItem('name')?.charAt(0)}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-slate-700 text-sm font-semibold truncate">{localStorage.getItem('name')}</p>
                            <p className="text-slate-400 text-xs">Warden</p>
                        </div>
                        <button onClick={() => { localStorage.clear(); navigate('/login'); }} className="text-slate-400 hover:text-red-500 text-xs transition">
                            Exit
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 ml-64">

                {/* Top Bar */}
                <div className="bg-white border-b border-slate-200 px-8 h-14 flex justify-between items-center">
                    <h2 className="text-sm font-semibold text-slate-800">Tenant Profile</h2>
                    <div className="flex items-center gap-2">
                        <button onClick={() => navigate('/warden/tenants')} className="text-xs text-slate-500 hover:text-slate-700 px-3 py-1.5 rounded border border-slate-200 hover:bg-slate-50 transition">
                            Back
                        </button>
                        <button onClick={handleRemoveTenant} className="text-xs text-red-500 px-3 py-1.5 rounded border border-red-200 hover:bg-red-50 transition">
                            Remove Tenant
                        </button>
                    </div>
                </div>

                <div className="p-8 max-w-3xl">

                    {/* Profile Info */}
                    <div className="bg-white rounded-lg border border-slate-200 mb-4">
                        <div className="px-6 py-4 border-b border-slate-100">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                                    {tenant.profilePicture ? (
                                        <img src={tenant.profilePicture} alt={tenant.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-white text-lg font-bold">{tenant.name.charAt(0).toUpperCase()}</span>
                                    )}
                                </div>
                                <div>
                                    <h2 className="text-base font-bold text-slate-800">{tenant.name}</h2>
                                    <p className="text-xs text-slate-400 mt-0.5">Room {tenant.room?.roomName} &nbsp;|&nbsp; ₹{rent?.toLocaleString()}/month</p>
                                </div>
                            </div>
                        </div>
                        <div className="px-6 py-4 grid grid-cols-3 gap-x-6 gap-y-4">
                            {[
                                { label: "Phone", value: tenant.phone },
                                { label: "Email", value: tenant.email || '—' },
                                { label: "Emergency Contact", value: tenant.emergencyContact || '—' },
                                { label: "Joining Date", value: tenant.joiningDate || '—' },
                                { label: "Address", value: tenant.address || '—' },
                                { label: "Status", value: tenant.status },
                            ].map(item => (
                                <div key={item.label}>
                                    <p className="text-xs text-slate-400 mb-0.5">{item.label}</p>
                                    <p className="text-sm text-slate-700 font-medium">{item.value}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Payment Status */}
                    <div className="bg-white rounded-lg border border-slate-200 mb-4">
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                            <div>
                                <p className="text-xs text-slate-400 uppercase tracking-wide">Current Month</p>
                                <p className="text-sm font-semibold text-slate-800 mt-0.5">{currentMonthStatus?.month}</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="text-right">
                                    <p className="text-xs text-slate-400">Amount</p>
                                    <p className="text-sm font-bold text-slate-800">₹{rent?.toLocaleString()}</p>
                                </div>
                                <span className={`text-xs font-semibold px-3 py-1 rounded ${
                                    currentMonthStatus?.status === 'PAID'
                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                        : 'bg-red-50 text-red-600 border border-red-200'
                                }`}>
                                    {currentMonthStatus?.status === 'PAID' ? 'Paid' : 'Unpaid'}
                                </span>
                                {currentMonthStatus?.status !== 'PAID' && (
                                    <button
                                        onClick={() => handleMarkAsPaid(rent)}
                                        disabled={marking}
                                        className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded transition disabled:opacity-50"
                                    >
                                        {marking ? 'Saving...' : 'Mark as Paid'}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Payment History */}
                    <div className="bg-white rounded-lg border border-slate-200">
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                            <p className="text-sm font-semibold text-slate-800">Payment History</p>
                            <button onClick={() => setShowHistory(!showHistory)} className="text-xs text-blue-600 hover:underline">
                                {showHistory ? 'Hide' : 'View previous months'}
                            </button>
                        </div>
                        {showHistory && (
                            <div>
                                {/* Table Header */}
                                <div className="px-6 py-2 bg-slate-50 border-b border-slate-100 grid grid-cols-3 gap-4">
                                    <p className="text-xs text-slate-400 font-semibold uppercase">Month</p>
                                    <p className="text-xs text-slate-400 font-semibold uppercase">Amount</p>
                                    <p className="text-xs text-slate-400 font-semibold uppercase">Status</p>
                                </div>
                                {paymentHistory.length === 0 ? (
                                    <div className="px-6 py-6 text-center">
                                        <p className="text-slate-400 text-sm">No payment history available</p>
                                    </div>
                                ) : (
                                    paymentHistory.map((payment, index) => (
                                        <div key={index} className="px-6 py-3 grid grid-cols-3 gap-4 border-b border-slate-50 hover:bg-slate-50 transition">
                                            <p className="text-sm text-slate-700">{payment.month}</p>
                                            <p className="text-sm text-slate-700">₹{payment.amount?.toLocaleString()}</p>
                                            <span className={`text-xs font-semibold w-fit px-2.5 py-0.5 rounded ${
                                                payment.status === 'PAID'
                                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                    : 'bg-red-50 text-red-600 border border-red-200'
                                            }`}>
                                                {payment.status === 'PAID' ? 'Paid' : 'Unpaid'}
                                            </span>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}