import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Tenants() {
    const [tenants, setTenants] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [availableRooms, setAvailableRooms] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({
        name: '',
        phone: '',
        email: '',
        address: '',
        emergencyContact: '',
        joiningDate: '',
        roomId: '',
        profilePicture: null
    });
    const navigate = useNavigate();

    useEffect(() => {
        fetchTenants();
        fetchAvailableRooms();
    }, []);

    const fetchTenants = () => {
        api.get('/api/tenants')
            .then(res => {
                setTenants(res.data);
                setFiltered(res.data);
                setLoading(false);
            })
            .catch(() => navigate('/login'));
    };

    const fetchAvailableRooms = () => {
        api.get('/api/rooms/available')
            .then(res => setAvailableRooms(res.data))
            .catch(err => console.log(err));
    };

    const handleSearch = (e) => {
        const val = e.target.value.toLowerCase();
        setSearch(val);
        setFiltered(tenants.filter(t =>
            t.name.toLowerCase().includes(val) ||
            t.phone.includes(val) ||
            t.room?.roomName?.toLowerCase().includes(val)
        ));
    };

    const handleFormChange = (e) => {
        if (e.target.name === 'profilePicture') {
            setForm({ ...form, profilePicture: e.target.files[0] });
        } else {
            setForm({ ...form, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = async () => {
        if (!form.name || !form.phone || !form.roomId || !form.joiningDate) {
            alert('Please fill name, phone, room and joining date!');
            return;
        }
        setSubmitting(true);
        const formData = new FormData();
        formData.append('name', form.name);
        formData.append('phone', form.phone);
        formData.append('email', form.email);
        formData.append('address', form.address);
        formData.append('emergencyContact', form.emergencyContact);
        formData.append('joiningDate', form.joiningDate);
        formData.append('roomId', form.roomId);
        if (form.profilePicture) {
            formData.append('profilePicture', form.profilePicture);
        }
        try {
            await api.post('/api/tenants', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setShowForm(false);
            setForm({
                name: '', phone: '', email: '', address: '',
                emergencyContact: '', joiningDate: '', roomId: '', profilePicture: null
            });
            fetchTenants();
            fetchAvailableRooms();
        } catch (err) {
            alert('Error adding tenant: ' + err.response?.data || err.message);
        }
        setSubmitting(false);
    };

    if (loading) return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

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
                            <p className="text-slate-400 text-xs mt-0.5">{localStorage.getItem('branchName')}</p>
                        </div>
                    </div>
                </div>
                <nav className="flex-1 px-4 py-6 space-y-1">
                    <button
                        onClick={() => navigate('/warden/dashboard')}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-slate-50 font-medium text-sm transition"
                    >
                        Dashboard
                    </button>
                    <button
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-50 text-blue-600 font-semibold text-sm"
                    >
                        Tenants
                    </button>
                </nav>
                <div className="px-4 py-4 border-t border-slate-100">
                    <div className="flex items-center gap-3 px-2 py-2">
                        <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-blue-600 font-bold text-sm">{localStorage.getItem('name')?.charAt(0)}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-slate-700 text-sm font-semibold truncate">{localStorage.getItem('name')}</p>
                            <p className="text-slate-400 text-xs">Warden</p>
                        </div>
                        <button
                            onClick={() => { localStorage.clear(); navigate('/login'); }}
                            className="text-slate-400 hover:text-red-500 text-xs transition"
                        >
                            Exit
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 ml-64">
                <div className="bg-white border-b border-slate-200 px-8 h-16 flex justify-between items-center shadow-sm">
                    <div>
                        <h2 className="text-lg font-black text-slate-800">Tenants</h2>
                        <p className="text-slate-400 text-xs">{filtered.length} tenants found</p>
                    </div>
                    <button
                        onClick={() => setShowForm(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
                    >
                        + Add Tenant
                    </button>
                </div>

                <div className="p-8">
                    {/* Search */}
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

            {/* Add Tenant Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-slate-800 font-black text-lg">Add New Tenant</h3>
                            <button
                                onClick={() => setShowForm(false)}
                                className="text-slate-400 hover:text-slate-600 text-xl font-bold"
                            >
                                ×
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1 block">Name *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={form.name}
                                        onChange={handleFormChange}
                                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Full name"
                                    />
                                </div>
                                <div>
                                    <label className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1 block">Phone *</label>
                                    <input
                                        type="text"
                                        name="phone"
                                        value={form.phone}
                                        onChange={handleFormChange}
                                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="10 digit number"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1 block">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={form.email}
                                        onChange={handleFormChange}
                                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Gmail address"
                                    />
                                </div>
                                <div>
                                    <label className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1 block">Emergency Contact</label>
                                    <input
                                        type="text"
                                        name="emergencyContact"
                                        value={form.emergencyContact}
                                        onChange={handleFormChange}
                                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Emergency number"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1 block">Address</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={form.address}
                                    onChange={handleFormChange}
                                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Permanent address"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1 block">Joining Date *</label>
                                    <input
                                        type="date"
                                        name="joiningDate"
                                        value={form.joiningDate}
                                        onChange={handleFormChange}
                                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1 block">Room *</label>
                                    <select
                                        name="roomId"
                                        value={form.roomId}
                                        onChange={handleFormChange}
                                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Select room</option>
                                        {availableRooms.map(room => (
                                            <option key={room.id} value={room.id}>
                                                {room.roomName} — ₹{room.rent} ({room.capacity} sharing)
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1 block">Profile Picture (Optional)</label>
                                <input
                                    type="file"
                                    name="profilePicture"
                                    onChange={handleFormChange}
                                    accept="image/*"
                                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setShowForm(false)}
                                className="flex-1 border border-slate-200 text-slate-600 text-sm font-semibold py-2.5 rounded-lg hover:bg-slate-50 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={submitting}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2.5 rounded-lg transition disabled:opacity-50"
                            >
                                {submitting ? 'Adding...' : 'Add Tenant'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}