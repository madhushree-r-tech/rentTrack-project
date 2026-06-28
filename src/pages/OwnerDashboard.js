import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function OwnerDashboard() {
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showFinancials, setShowFinancials] = useState(false);
    const navigate = useNavigate();

    const name = localStorage.getItem('name');

    useEffect(() => {
        api.get('/api/owner/dashboard')
            .then(res => {
                setDashboard(res.data);
                setLoading(false);
            })
            .catch(() => navigate('/login'));
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    if (loading) return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

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
                            <p className="text-slate-400 text-xs mt-0.5">Owner Panel</p>
                        </div>
                    </div>
                </div>
                <nav className="flex-1 px-4 py-6 space-y-1">
                    <button className="w-full text-left px-4 py-2.5 rounded-lg bg-blue-50 text-blue-600 text-sm font-semibold">
                        Dashboard
                    </button>
                </nav>
                <div className="px-4 py-4 border-t border-slate-100">
                    <div className="flex items-center gap-3 px-2">
                        <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-slate-600 font-semibold text-sm">{name?.charAt(0)}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-slate-700 text-sm font-semibold truncate">{name}</p>
                            <p className="text-slate-400 text-xs">Owner</p>
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
                    <h2 className="text-sm font-semibold text-slate-800">Owner Dashboard</h2>
                    <p className="text-xs text-slate-400">
                        {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>

                <div className="p-8">

                    {/* Stats Row */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="bg-white rounded-lg border border-slate-200 p-5">
                            <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Total Branches</p>
                            <p className="text-2xl font-bold text-slate-800">{dashboard.totalBranches}</p>
                        </div>
                        <div className="bg-white rounded-lg border border-slate-200 p-5">
                            <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Total Rooms</p>
                            <p className="text-2xl font-bold text-slate-800">{dashboard.totalRooms}</p>
                        </div>
                        <div className="bg-white rounded-lg border border-slate-200 p-5">
                            <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Total Tenants</p>
                            <p className="text-2xl font-bold text-blue-600">{dashboard.totalTenants}</p>
                        </div>
                    </div>

                    {/* Financial Summary */}
                    <div className="bg-white rounded-lg border border-slate-200 mb-6">
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                            <p className="text-sm font-semibold text-slate-800">Financial Summary</p>
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
                                    <p className="text-lg font-bold text-slate-800">₹{dashboard.combinedExpectedRent?.toLocaleString()}</p>
                                </div>
                                <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-100">
                                    <p className="text-xs text-emerald-600 uppercase tracking-wide mb-1">Collected</p>
                                    <p className="text-lg font-bold text-emerald-700">₹{dashboard.combinedCollectedRent?.toLocaleString()}</p>
                                </div>
                                <div className="bg-red-50 rounded-lg p-4 border border-red-100">
                                    <p className="text-xs text-red-500 uppercase tracking-wide mb-1">Pending</p>
                                    <p className="text-lg font-bold text-red-600">₹{dashboard.combinedPendingRent?.toLocaleString()}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Branch Overview */}
                    <div className="bg-white rounded-lg border border-slate-200">
                        <div className="px-6 py-4 border-b border-slate-100">
                            <p className="text-sm font-semibold text-slate-800">Branch Overview</p>
                        </div>
                        <div className="divide-y divide-slate-100">
                            <div className="px-6 py-3 bg-slate-50 grid grid-cols-6 gap-4">
                                <p className="text-xs text-slate-400 font-semibold uppercase">Branch</p>
                                <p className="text-xs text-slate-400 font-semibold uppercase">Warden</p>
                                <p className="text-xs text-slate-400 font-semibold uppercase">Rooms</p>
                                <p className="text-xs text-slate-400 font-semibold uppercase">Tenants</p>
                                <p className="text-xs text-slate-400 font-semibold uppercase">Vacant</p>
                                <p className="text-xs text-slate-400 font-semibold uppercase">Collected</p>
                            </div>
                            {dashboard.branches?.map((branch, index) => (
                                <div key={index} className="px-6 py-4 grid grid-cols-6 gap-4 items-center hover:bg-slate-50 transition">
                                    <p className="text-sm font-semibold text-slate-800">{branch.branchName}</p>
                                    <div>
                                        <p className="text-sm text-slate-700">{branch.wardenName}</p>
                                        <p className="text-xs text-slate-400">{branch.wardenPhone}</p>
                                    </div>
                                    <p className="text-sm text-slate-700">{branch.totalRooms}</p>
                                    <p className="text-sm text-slate-700">{branch.totalTenants}</p>
                                    <p className="text-sm text-emerald-600 font-medium">{branch.totalVacancy}</p>
                                    <p className="text-sm text-slate-700">₹{branch.totalCollectedRent?.toLocaleString()}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}