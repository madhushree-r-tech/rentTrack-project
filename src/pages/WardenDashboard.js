import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function WardenDashboard() {
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedMonth, setSelectedMonth] = useState('');
    const [showFinancials, setShowFinancials] = useState(false);
    const navigate = useNavigate();

    const name = localStorage.getItem('name');
    const branchName = localStorage.getItem('branchName');

    const generateMonths = () => {
        const months = [];
        for (let i = 0; i < 12; i++) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            const month = date.toLocaleString('en-US', { month: 'long' });
            const year = date.getFullYear();
            months.push(`${month}-${year}`);
        }
        return months;
    };

    const fetchDashboard = (month = '') => {
        setLoading(true);
        const url = month ? `/api/warden/dashboard?month=${month}` : '/api/warden/dashboard';
        api.get(url)
            .then(res => {
                setDashboard(res.data);
                setLoading(false);
            })
            .catch(() => navigate('/login'));
    };

    useEffect(() => { fetchDashboard(); }, []);

    const handleMonthChange = (e) => {
        setSelectedMonth(e.target.value);
        fetchDashboard(e.target.value);
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    if (loading) return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <div className="text-center">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                <p className="text-slate-500 text-sm">Loading...</p>
            </div>
        </div>
    );

    const collectionRate = dashboard.totalExpectedRent > 0
        ? Math.round((dashboard.totalCollectedRent / dashboard.totalExpectedRent) * 100)
        : 0;

    return (
        <div className="min-h-screen bg-slate-50 flex">

            {/* Sidebar */}
            <div className="w-64 bg-white border-r border-slate-200 flex flex-col fixed h-full shadow-sm">
                <div className="px-6 py-5 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-black text-sm">R</span>
                        </div>
                        <div>
                            <h1 className="text-slate-800 font-black text-base leading-none">RentTrack</h1>
                            <p className="text-slate-400 text-xs mt-0.5">{branchName}</p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-1">
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-50 text-blue-600 font-semibold text-sm">
                        Dashboard
                    </button>
                    <button
                        onClick={() => navigate('/warden/tenants')}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-slate-50 font-medium text-sm transition"
                    >
                        Tenants
                    </button>
                </nav>

                <div className="px-4 py-4 border-t border-slate-100">
                    <div className="flex items-center gap-3 px-2 py-2">
                        <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-blue-600 font-bold text-sm">{name?.charAt(0)}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-slate-700 text-sm font-semibold truncate">{name}</p>
                            <p className="text-slate-400 text-xs">Warden</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="text-slate-400 hover:text-red-500 text-xs transition"
                        >
                            Exit
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 ml-64">

                {/* Top Bar */}
                <div className="bg-white border-b border-slate-200 px-8 h-16 flex justify-between items-center shadow-sm">
                    <div>
                        <h2 className="text-lg font-black text-slate-800">Dashboard</h2>
                        <p className="text-slate-400 text-xs">
                            {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="text-slate-500 text-sm font-medium">Period:</label>
                        <select
                            value={selectedMonth}
                            onChange={handleMonthChange}
                            className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        >
                            {generateMonths().map((month, index) => (
                                <option key={index} value={month}>{month}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Page Content */}
                <div className="p-8">

                    {/* Stats Row */}
                    <div className="grid grid-cols-4 gap-4 mb-6">
                        <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
                            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">Total Rooms</p>
                            <p className="text-3xl font-black text-slate-800">{dashboard.totalRooms}</p>
                            <p className="text-slate-400 text-xs mt-1">All floors</p>
                        </div>
                        <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
                            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">Occupied</p>
                            <p className="text-3xl font-black text-blue-600">{dashboard.occupiedRooms}</p>
                            <p className="text-slate-400 text-xs mt-1">Rooms in use</p>
                        </div>
                        <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
                            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">Vacant Beds</p>
                            <p className="text-3xl font-black text-emerald-500">{dashboard.vacantRooms}</p>
                            <p className="text-slate-400 text-xs mt-1">Beds available</p>
                        </div>
                        <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
                            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">Tenants</p>
                            <p className="text-3xl font-black text-slate-800">{dashboard.totalTenants}</p>
                            <p className="text-slate-400 text-xs mt-1">Currently staying</p>
                        </div>
                    </div>

                    {/* Financial Summary */}
                    <div className="bg-white rounded-xl border border-slate-100 shadow-sm mb-6">
                        <div className="px-6 py-4 flex justify-between items-center">
                            <div>
                                <h3 className="text-slate-800 font-bold text-base">Financial Summary</h3>
                                <p className="text-slate-400 text-xs mt-0.5">{dashboard.month}</p>
                            </div>
                            <button
                                onClick={() => setShowFinancials(!showFinancials)}
                                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition"
                            >
                                {showFinancials ? 'Hide' : 'View Summary'}
                            </button>
                        </div>

                        {showFinancials && (
                            <div className="grid grid-cols-3 gap-4 px-6 pb-6">
                                <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                                    <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">Expected</p>
                                    <p className="text-xl font-black text-slate-800">₹{dashboard.totalExpectedRent.toLocaleString()}</p>
                                </div>
                                <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-100">
                                    <div className="flex justify-between items-center mb-2">
                                        <p className="text-emerald-600 text-xs font-semibold uppercase tracking-wider">Collected</p>
                                        <span className="bg-emerald-100 text-emerald-600 text-xs font-bold px-2 py-0.5 rounded-full">{collectionRate}%</span>
                                    </div>
                                    <p className="text-xl font-black text-emerald-600">₹{dashboard.totalCollectedRent.toLocaleString()}</p>
                                    <div className="mt-2 bg-emerald-200 rounded-full h-1">
                                        <div className="bg-emerald-500 h-1 rounded-full" style={{ width: `${collectionRate}%` }}></div>
                                    </div>
                                </div>
                                <div className="bg-red-50 rounded-xl p-5 border border-red-100">
                                    <p className="text-red-500 text-xs font-semibold uppercase tracking-wider mb-2">Pending</p>
                                    <p className="text-xl font-black text-red-500">₹{dashboard.totalPendingRent.toLocaleString()}</p>
                                    <p className="text-red-400 text-xs mt-1">{dashboard.unpaidTenants.length} tenants</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Unpaid Tenants */}
                    <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                            <div>
                                <h3 className="text-slate-800 font-bold text-base">Unpaid Tenants</h3>
                                <p className="text-slate-400 text-xs mt-0.5">{dashboard.month}</p>
                            </div>
                            <span className="bg-red-50 text-red-500 text-xs font-bold px-3 py-1 rounded-full border border-red-100">
                                {dashboard.unpaidTenants.length} pending
                            </span>
                        </div>

                        {dashboard.unpaidTenants.length === 0 ? (
                            <div className="px-6 py-8 text-center">
                                <p className="text-emerald-500 font-semibold">All tenants have paid this month!</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-50">
                                <div className="px-6 py-3 bg-slate-50 grid grid-cols-4 gap-4">
                                    <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Tenant</p>
                                    <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Phone</p>
                                    <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Room</p>
                                    <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider text-right">Status</p>
                                </div>
                                {dashboard.unpaidTenants.map((tenant, index) => (
                                    <div key={index} className="px-6 py-4 grid grid-cols-4 gap-4 items-center hover:bg-slate-50 transition">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                <span className="text-blue-600 text-xs font-bold">
                                                    {tenant.name.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            <p className="text-slate-700 text-sm font-medium">{tenant.name}</p>
                                        </div>
                                        <p className="text-slate-500 text-sm">{tenant.phone}</p>
                                        <span className="bg-slate-100 text-slate-600 text-xs font-semibold px-2 py-1 rounded-lg w-fit">
                                            {tenant.roomNumber}
                                        </span>
                                        <div className="flex justify-end">
                                            <span className="bg-red-50 text-red-500 text-xs font-bold px-3 py-1 rounded-full border border-red-100">
                                                UNPAID
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}