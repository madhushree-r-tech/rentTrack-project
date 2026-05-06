import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Tenants() {
    const [tenants, setTenants] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        api.get('/api/tenants')
            .then(res => {
                setTenants(res.data);
                setFiltered(res.data);
                setLoading(false);
            })
            .catch(() => navigate('/login'));
    }, [navigate]);

    const handleSearch = (e) => {
        const val = e.target.value.toLowerCase();
        setSearch(val);
        setFiltered(tenants.filter(t =>
            t.name.toLowerCase().includes(val) ||
            t.phone.includes(val) ||
            t.room?.roomName?.toLowerCase().includes(val)
        ));
    };

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
                        onClick={() => navigate('/warden/dashboard')}
                        className="text-slate-500 hover:text-blue-600 text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-blue-50 transition"
                    >
                        ← Dashboard
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
            <div className="max-w-7xl mx-auto px-6 py-8">

                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-black text-slate-800">Tenants</h2>
                        <p className="text-slate-400 text-sm mt-1">{filtered.length} tenants found</p>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 mb-6">
                    <input
                        type="text"
                        value={search}
                        onChange={handleSearch}
                        placeholder="Search by name, phone or room number..."
                        className="w-full text-sm text-slate-700 placeholder-slate-400 focus:outline-none"
                    />
                </div>

                {/* Tenants Table */}
                <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="px-6 py-3 bg-slate-50 grid grid-cols-5 gap-4 border-b border-slate-100">
                        <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Tenant</p>
                        <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Phone</p>
                        <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Room</p>
                        <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Joining Date</p>
                        <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider text-right">Action</p>
                    </div>
                    <div className="divide-y divide-slate-50">
                        {filtered.length === 0 ? (
                            <div className="px-6 py-8 text-center">
                                <p className="text-slate-400 text-sm">No tenants found</p>
                            </div>
                        ) : (
                            filtered.map((tenant) => (
                                <div key={tenant.id} className="px-6 py-4 grid grid-cols-5 gap-4 items-center hover:bg-slate-50 transition">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                                            {tenant.profilePicture ? (
                                                <img src={tenant.profilePicture} alt={tenant.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-blue-600 text-sm font-bold">
                                                    {tenant.name.charAt(0).toUpperCase()}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-slate-700 text-sm font-semibold">{tenant.name}</p>
                                    </div>
                                    <p className="text-slate-500 text-sm">{tenant.phone}</p>
                                    <span className="bg-slate-100 text-slate-600 text-xs font-semibold px-2 py-1 rounded-lg w-fit">
                                        {tenant.room?.roomName}
                                    </span>
                                    <p className="text-slate-500 text-sm">{tenant.joiningDate || 'N/A'}</p>
                                    <div className="flex justify-end">
                                        <button
                                            onClick={() => navigate(`/warden/tenant/${tenant.id}`)}
                                            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition"
                                        >
                                            View Profile
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}