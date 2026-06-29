import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post('/api/auth/login', { email, password });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('role', res.data.role);
            localStorage.setItem('name', res.data.name);
            localStorage.setItem('branchName', res.data.branchName);
            localStorage.setItem('branchId', res.data.branchId);

            if (res.data.role === 'ROLE_WARDEN') {
                navigate('/warden/dashboard');
            } else {
                navigate('/owner/dashboard');
            }
        } catch (err) {
            setError('Invalid email or password!');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
            <div className="w-full max-w-sm">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-black text-white tracking-tight">RentTrack</h1>
                    <h2 className="text-lg font-semibold text-slate-400 mt-2">Kushi Paying Guest</h2>
                </div>
                <div className="bg-slate-800 rounded-2xl p-8 shadow-2xl border border-slate-700">
                    <h2 className="text-lg font-bold text-white mb-6">Sign in to your account</h2>
                    {error && (
                        <div className="bg-red-500 bg-opacity-10 border border-red-500 border-opacity-30 text-red-400 px-4 py-3 rounded-xl mb-5 text-sm">
                            {error}
                        </div>
                    )}
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                placeholder="Enter your email"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                placeholder="Enter your password"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl transition duration-200 text-sm mt-2 disabled:opacity-50"
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>
                    <p className="text-center text-sm text-slate-500 mt-6">
                        New here?{' '}
                        <Link to="/register" className="text-blue-400 font-semibold hover:underline">
                            Register here
                        </Link>
                    </p>
                </div>
                <p className="text-center text-slate-600 text-xs mt-6">
                    &copy; 2026 RentTrack &middot; All Rights Reserved
                </p>
            </div>
        </div>
    );
}