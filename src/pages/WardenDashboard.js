import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import api from '../services/api';

export default function WardenDashboard() {
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedMonth, setSelectedMonth] = useState('');
    const [showFinancials, setShowFinancials] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');
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
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    const collectionRate = dashboard.totalExpectedRent > 0
        ? Math.round((dashboard.totalCollectedRent / dashboard.totalExpectedRent) * 100)
        : 0;

    const occupancyData = [
        { name: 'Occupied', value: dashboard.totalTenants },
        { name: 'Vacant', value: dashboard.vacantRooms },
    ];

    const collectionData = [
        { name: 'Collected', value: dashboard.totalCollectedRent },
        { name: 'Pending', value: dashboard.totalPendingRent },
    ];

    const OCCUPANCY_COLORS = ['#2563eb', '#e2e8f0'];
    const COLLECTION_COLORS = ['#059669', '#ef4444'];

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
                            <p className="text-slate-400 text-xs mt-0.5">{branchName}</p>
                        </div>
                    </div>
                </div>
                <nav className="flex-1 px-4 py-6 space-y-1">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition ${activeTab === 'overview' ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-slate-500 hover:bg-slate-50'}`}
                    >
                        Dashboard
                    </button>
                    <button
                        onClick={() => setActiveTab('analytics')}
                        className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition ${activeTab === 'analytics' ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-slate-500 hover:bg-slate-50'}`}
                    >
                        Analytics
                    </button>
                    <button
                        onClick={() => navigate('/warden/tenants')}
                        className="w-full text-left px-4 py-2.5 rounded-lg text-slate-500 hover:bg-slate-50 text-sm font-medium transition"
                    >
                        Tenants
                    </button>
                    <button
                        onClick={() => navigate('/warden/complaints')}
                        className="w-full text-left px-4 py-2.5 rounded-lg text-slate-500 hover:bg-slate-50 text-sm font-medium transition"
                    >
                        Complaints
                    </button>
                </nav>
                <div className="px-4 py-4 border-t border-slate-100">
                    <div className="flex items-center gap-3 px-2">
                        <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-slate-600 font-semibold text-sm">{name?.charAt(0)}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-slate-700 text-sm font-semibold truncate">{name}</p>
                            <p className="text-slate-400 text-xs">Warden</p>
                        </div>
                        <button onClick={handleLogout} className="text-slate-400 hover:text-red-500 text-xs transition">
                            Exit
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 ml-64">

                {/* Top Bar */}
                <div className="bg-white border-b border-slate-200 px-8 h-14 flex justify-between items-center">
                    <h2 className="text-sm font-semibold text-slate-800">
                        {activeTab === 'overview' ? 'Dashboard' : 'Analytics'}
                    </h2>
                    <div className="flex items-center gap-2">
                        <label className="text-xs text-slate-400">Period:</label>
                        <select
                            value={selectedMonth}
                            onChange={handleMonthChange}
                            className="border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        >
                            {generateMonths().map((month, index) => (
                                <option key={index} value={month}>{month}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <div className="p-8">

                        {/* Stats */}
                        <div className="grid grid-cols-4 gap-4 mb-6">
                            {[
                                { label: 'Total Rooms', value: dashboard.totalRooms, color: 'text-slate-800' },
                                { label: 'Occupied', value: dashboard.occupiedRooms, color: 'text-blue-600' },
                                { label: 'Vacant Beds', value: dashboard.vacantRooms, color: 'text-emerald-600' },
                                { label: 'Tenants', value: dashboard.totalTenants, color: 'text-slate-800' },
                            ].map(stat => (
                                <div key={stat.label} className="bg-white rounded-lg border border-slate-200 p-5">
                                    <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">{stat.label}</p>
                                    <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                                </div>
                            ))}
                        </div>

                        {/* Financial Summary */}
                        <div className="bg-white rounded-lg border border-slate-200 mb-6">
                            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                                <p className="text-sm font-semibold text-slate-800">Financial Summary — {dashboard.month}</p>
                                <button
                                    onClick={() => setShowFinancials(!showFinancials)}
                                    className="text-xs text-blue-600 border border-blue-200 px-3 py-1.5 rounded hover:bg-blue-50 transition"
                                >
                                    {showFinancials ? 'Hide' : 'View Summary'}
                                </button>
                            </div>
                            {showFinancials && (
                                <div className="grid grid-cols-3 gap-4 p-6">
                                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                                        <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Expected</p>
                                        <p className="text-lg font-bold text-slate-800">₹{dashboard.totalExpectedRent?.toLocaleString()}</p>
                                    </div>
                                    <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-100">
                                        <div className="flex justify-between items-center mb-1">
                                            <p className="text-xs text-emerald-600 uppercase tracking-wide">Collected</p>
                                            <span className="text-xs font-semibold text-emerald-600">{collectionRate}%</span>
                                        </div>
                                        <p className="text-lg font-bold text-emerald-700">₹{dashboard.totalCollectedRent?.toLocaleString()}</p>
                                        <div className="mt-2 bg-emerald-200 rounded-full h-1">
                                            <div className="bg-emerald-500 h-1 rounded-full" style={{ width: `${collectionRate}%` }}></div>
                                        </div>
                                    </div>
                                    <div className="bg-red-50 rounded-lg p-4 border border-red-100">
                                        <p className="text-xs text-red-500 uppercase tracking-wide mb-1">Pending</p>
                                        <p className="text-lg font-bold text-red-600">₹{dashboard.totalPendingRent?.toLocaleString()}</p>
                                        <p className="text-xs text-red-400 mt-1">{dashboard.unpaidTenants?.length} tenants</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Unpaid Tenants */}
                        <div className="bg-white rounded-lg border border-slate-200">
                            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                                <p className="text-sm font-semibold text-slate-800">Unpaid Tenants — {dashboard.month}</p>
                                <span className="text-xs font-semibold text-red-500 border border-red-200 bg-red-50 px-3 py-1 rounded">
                                    {dashboard.unpaidTenants?.length} pending
                                </span>
                            </div>
                            {dashboard.unpaidTenants?.length === 0 ? (
                                <div className="px-6 py-6 text-center">
                                    <p className="text-slate-400 text-sm">All tenants have paid this month</p>
                                </div>
                            ) : (
                                <div>
                                    <div className="px-6 py-3 bg-slate-50 grid grid-cols-4 gap-4 border-b border-slate-100">
                                        <p className="text-xs text-slate-400 font-semibold uppercase">Tenant</p>
                                        <p className="text-xs text-slate-400 font-semibold uppercase">Phone</p>
                                        <p className="text-xs text-slate-400 font-semibold uppercase">Room</p>
                                        <p className="text-xs text-slate-400 font-semibold uppercase">Status</p>
                                    </div>
                                    {dashboard.unpaidTenants?.map((tenant, index) => (
                                        <div key={index} className="px-6 py-3 grid grid-cols-4 gap-4 items-center border-b border-slate-50 hover:bg-slate-50 transition">
                                            <div className="flex items-center gap-2">
                                                <div className="w-7 h-7 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                    <span className="text-slate-600 text-xs font-semibold">{tenant.name.charAt(0).toUpperCase()}</span>
                                                </div>
                                                <p className="text-sm text-slate-700">{tenant.name}</p>
                                            </div>
                                            <p className="text-sm text-slate-500">{tenant.phone}</p>
                                            <span className="text-xs font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded w-fit">{tenant.roomNumber}</span>
                                            <span className="text-xs font-semibold text-red-500 border border-red-200 bg-red-50 px-2.5 py-0.5 rounded w-fit">Unpaid</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Analytics Tab */}
                {activeTab === 'analytics' && (
                    <div className="p-8">
                        <div className="grid grid-cols-2 gap-6 mb-6">

                            {/* Occupancy Chart */}
                            <div className="bg-white rounded-lg border border-slate-200 p-6">
                                <p className="text-sm font-semibold text-slate-800 mb-1">Bed Occupancy</p>
                                <p className="text-xs text-slate-400 mb-6">{dashboard.month}</p>
                                <ResponsiveContainer width="100%" height={220}>
                                    <PieChart>
                                        <Pie
                                            data={occupancyData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={90}
                                            paddingAngle={3}
                                            dataKey="value"
                                        >
                                            {occupancyData.map((entry, index) => (
                                                <Cell key={index} fill={OCCUPANCY_COLORS[index]} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(value) => [value, '']} />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="grid grid-cols-2 gap-3 mt-4">
                                    <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                                        <p className="text-xs text-blue-500 mb-0.5">Occupied</p>
                                        <p className="text-lg font-bold text-blue-600">{dashboard.totalTenants}</p>
                                    </div>
                                    <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                                        <p className="text-xs text-slate-400 mb-0.5">Vacant</p>
                                        <p className="text-lg font-bold text-slate-600">{dashboard.vacantRooms}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Collection Chart */}
                            <div className="bg-white rounded-lg border border-slate-200 p-6">
                                <p className="text-sm font-semibold text-slate-800 mb-1">Rent Collection</p>
                                <p className="text-xs text-slate-400 mb-6">{dashboard.month}</p>
                                <ResponsiveContainer width="100%" height={220}>
                                    <BarChart data={collectionData} barSize={48}>
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
                                        <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, '']} />
                                        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                            {collectionData.map((entry, index) => (
                                                <Cell key={index} fill={COLLECTION_COLORS[index]} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                                <div className="grid grid-cols-2 gap-3 mt-4">
                                    <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-100">
                                        <p className="text-xs text-emerald-500 mb-0.5">Collected</p>
                                        <p className="text-lg font-bold text-emerald-600">₹{dashboard.totalCollectedRent?.toLocaleString()}</p>
                                    </div>
                                    <div className="bg-red-50 rounded-lg p-3 border border-red-100">
                                        <p className="text-xs text-red-400 mb-0.5">Pending</p>
                                        <p className="text-lg font-bold text-red-500">₹{dashboard.totalPendingRent?.toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Collection Rate */}
                        <div className="bg-white rounded-lg border border-slate-200 p-6">
                            <p className="text-sm font-semibold text-slate-800 mb-4">Collection Rate — {dashboard.month}</p>
                            <div className="flex items-center gap-4">
                                <div className="flex-1 bg-slate-100 rounded-full h-3">
                                    <div
                                        className="bg-blue-600 h-3 rounded-full transition-all"
                                        style={{ width: `${collectionRate}%` }}
                                    ></div>
                                </div>
                                <span className="text-sm font-bold text-slate-800 w-12 text-right">{collectionRate}%</span>
                            </div>
                            <div className="grid grid-cols-3 gap-4 mt-6">
                                <div>
                                    <p className="text-xs text-slate-400 mb-1">Expected</p>
                                    <p className="text-base font-bold text-slate-800">₹{dashboard.totalExpectedRent?.toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 mb-1">Collected</p>
                                    <p className="text-base font-bold text-emerald-600">₹{dashboard.totalCollectedRent?.toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 mb-1">Pending</p>
                                    <p className="text-base font-bold text-red-500">₹{dashboard.totalPendingRent?.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}