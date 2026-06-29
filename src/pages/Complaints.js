import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const CATEGORIES = ['Maintenance', 'Electrical', 'Plumbing', 'Theft', 'Cleanliness', 'Food', 'Other'];
const STATUSES = ['OPEN', 'IN_PROGRESS', 'RESOLVED'];

export default function Complaints() {
    const [complaints, setComplaints] = useState([]);
    const [tenants, setTenants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [showStatusModal, setShowStatusModal] = useState(null);
    const [statusForm, setStatusForm] = useState({ status: '', remarks: '' });
    const [form, setForm] = useState({ tenantId: '', category: '', description: '' });
    const [submitting, setSubmitting] = useState(false);
    const [filter, setFilter] = useState('ALL');
    const navigate = useNavigate();

    const fetchComplaints = () => {
        setLoading(true);
        api.get('/api/complaints/my')
            .then(res => {
                setComplaints(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.log('Error fetching complaints:', err);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchComplaints();
        api.get('/api/tenants').then(res => setTenants(res.data));
    }, []);

    const handleSubmit = async () => {
        if (!form.category || !form.description) {
            alert('Please fill category and description!');
            return;
        }
        setSubmitting(true);
        try {
            await api.post('/api/complaints', {
                tenantId: form.tenantId || '',
                category: form.category,
                description: form.description
            });
            setShowForm(false);
            setForm({ tenantId: '', category: '', description: '' });
            fetchComplaints();
        } catch (err) {
            alert('Error raising complaint: ' + err.message);
        }
        setSubmitting(false);
    };

    const handleUpdateStatus = async () => {
        if (!statusForm.status) return;
        try {
            await api.put(`/api/complaints/${showStatusModal}/status`, statusForm);
            setShowStatusModal(null);
            setStatusForm({ status: '', remarks: '' });
            fetchComplaints();
        } catch (err) {
            alert('Error updating status!');
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'OPEN': return 'bg-red-50 text-red-600 border border-red-200';
            case 'IN_PROGRESS': return 'bg-amber-50 text-amber-600 border border-amber-200';
            case 'RESOLVED': return 'bg-emerald-50 text-emerald-600 border border-emerald-200';
            default: return 'bg-slate-50 text-slate-600';
        }
    };

    const filtered = filter === 'ALL' ? complaints : complaints.filter(c => c.status === filter);

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
                            <p className="text-slate-400 text-xs mt-0.5">{localStorage.getItem('branchName')}</p>
                        </div>
                    </div>
                </div>
                <nav className="flex-1 px-4 py-6 space-y-1">
                    <button onClick={() => navigate('/warden/dashboard')} className="w-full text-left px-4 py-2.5 rounded-lg text-slate-500 hover:bg-slate-50 text-sm font-medium transition">
                        Dashboard
                    </button>
                    <button onClick={() => navigate('/warden/tenants')} className="w-full text-left px-4 py-2.5 rounded-lg text-slate-500 hover:bg-slate-50 text-sm font-medium transition">
                        Tenants
                    </button>
                    <button className="w-full text-left px-4 py-2.5 rounded-lg bg-blue-50 text-blue-600 text-sm font-semibold">
                        Complaints
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

            {/* Main */}
            <div className="flex-1 ml-64">
                <div className="bg-white border-b border-slate-200 px-8 h-14 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <h2 className="text-sm font-semibold text-slate-800">Complaints</h2>
                        <div className="flex gap-1">
                            {['ALL', 'OPEN', 'IN_PROGRESS', 'RESOLVED'].map(s => (
                                <button
                                    key={s}
                                    onClick={() => setFilter(s)}
                                    className={`text-xs px-3 py-1 rounded font-medium transition ${filter === s ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                                >
                                    {s === 'IN_PROGRESS' ? 'In Progress' : s.charAt(0) + s.slice(1).toLowerCase()}
                                </button>
                            ))}
                        </div>
                    </div>
                    <button
                        onClick={() => setShowForm(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition"
                    >
                        + New Complaint
                    </button>
                </div>

                <div className="p-8">
                    <div className="bg-white rounded-lg border border-slate-200">
                        <div className="px-6 py-3 bg-slate-50 grid grid-cols-5 gap-4 border-b border-slate-100">
                            <p className="text-xs text-slate-400 font-semibold uppercase">Tenant</p>
                            <p className="text-xs text-slate-400 font-semibold uppercase">Category</p>
                            <p className="text-xs text-slate-400 font-semibold uppercase">Description</p>
                            <p className="text-xs text-slate-400 font-semibold uppercase">Status</p>
                            <p className="text-xs text-slate-400 font-semibold uppercase">Action</p>
                        </div>
                        {filtered.length === 0 ? (
                            <div className="px-6 py-10 text-center">
                                <p className="text-slate-400 text-sm">No complaints found</p>
                            </div>
                        ) : (
                            filtered.map(c => (
                                <div key={c.id} className="px-6 py-4 grid grid-cols-5 gap-4 items-start border-b border-slate-50 hover:bg-slate-50 transition">
                                    <p className="text-sm text-slate-700">{c.tenantName || 'General'}</p>
                                    <span className="text-xs font-medium bg-slate-100 text-slate-600 px-2 py-1 rounded w-fit">{c.category}</span>
                                    <p className="text-sm text-slate-600">{c.description}</p>
                                    <span className={`text-xs font-semibold px-2.5 py-1 rounded w-fit ${getStatusStyle(c.status)}`}>
                                        {c.status === 'IN_PROGRESS' ? 'In Progress' : c.status.charAt(0) + c.status.slice(1).toLowerCase()}
                                    </span>
                                    {c.status !== 'RESOLVED' ? (
                                        <button
                                            onClick={() => { setShowStatusModal(c.id); setStatusForm({ status: c.status, remarks: c.remarks || '' }); }}
                                            className="text-xs text-blue-600 border border-blue-200 px-3 py-1.5 rounded hover:bg-blue-50 transition w-fit"
                                        >
                                            Update Status
                                        </button>
                                    ) : (
                                        <span className="text-xs text-slate-400">Resolved</span>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* New Complaint Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
                        <div className="flex justify-between items-center mb-5">
                            <h3 className="text-base font-bold text-slate-800">New Complaint</h3>
                            <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600 text-lg">×</button>
                        </div>
                        <div className="space-y-3">
                            <div>
                                <label className="text-xs text-slate-500 font-semibold uppercase mb-1 block">Tenant (Optional)</label>
                                <select
                                    value={form.tenantId}
                                    onChange={e => setForm({ ...form, tenantId: e.target.value })}
                                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">General complaint (no tenant)</option>
                                    {tenants.map(t => (
                                        <option key={t.id} value={t.id}>{t.name} — Room {t.room?.roomName}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="text-xs text-slate-500 font-semibold uppercase mb-1 block">Category</label>
                                <select
                                    value={form.category}
                                    onChange={e => setForm({ ...form, category: e.target.value })}
                                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select category</option>
                                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="text-xs text-slate-500 font-semibold uppercase mb-1 block">Description</label>
                                <textarea
                                    value={form.description}
                                    onChange={e => setForm({ ...form, description: e.target.value })}
                                    rows={3}
                                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                    placeholder="Describe the complaint..."
                                />
                            </div>
                        </div>
                        <div className="flex gap-3 mt-5">
                            <button onClick={() => setShowForm(false)} className="flex-1 border border-slate-200 text-slate-600 text-sm font-medium py-2 rounded-lg hover:bg-slate-50 transition">
                                Cancel
                            </button>
                            <button onClick={handleSubmit} disabled={submitting} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 rounded-lg transition disabled:opacity-50">
                                {submitting ? 'Submitting...' : 'Submit'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Update Status Modal */}
            {showStatusModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl">
                        <div className="flex justify-between items-center mb-5">
                            <h3 className="text-base font-bold text-slate-800">Update Status</h3>
                            <button onClick={() => setShowStatusModal(null)} className="text-slate-400 hover:text-slate-600 text-lg">×</button>
                        </div>
                        <div className="space-y-3">
                            <div>
                                <label className="text-xs text-slate-500 font-semibold uppercase mb-1 block">Status</label>
                                <select
                                    value={statusForm.status}
                                    onChange={e => setStatusForm({ ...statusForm, status: e.target.value })}
                                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select status</option>
                                    {STATUSES.map(s => <option key={s} value={s}>{s === 'IN_PROGRESS' ? 'In Progress' : s.charAt(0) + s.slice(1).toLowerCase()}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="text-xs text-slate-500 font-semibold uppercase mb-1 block">Remarks (optional)</label>
                                <textarea
                                    value={statusForm.remarks}
                                    onChange={e => setStatusForm({ ...statusForm, remarks: e.target.value })}
                                    rows={2}
                                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                    placeholder="Add any remarks..."
                                />
                            </div>
                        </div>
                        <div className="flex gap-3 mt-5">
                            <button onClick={() => setShowStatusModal(null)} className="flex-1 border border-slate-200 text-slate-600 text-sm font-medium py-2 rounded-lg hover:bg-slate-50 transition">
                                Cancel
                            </button>
                            <button onClick={handleUpdateStatus} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 rounded-lg transition">
                                Update
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}