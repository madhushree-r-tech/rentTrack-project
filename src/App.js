import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/login';
import Register from './pages/Register';
import WardenDashboard from './pages/WardenDashboard';
import Tenants from './pages/Tenants';
import TenantProfile from './pages/TenantProfile';
import OwnerDashboard from './pages/OwnerDashboard';
import Complaints from './pages/Complaints';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/warden/dashboard" element={<WardenDashboard />} />
                <Route path="/warden/tenants" element={<Tenants />} />
                <Route path="/warden/tenant/:id" element={<TenantProfile />} />
                <Route path="/warden/complaints" element={<Complaints />} />
                <Route path="/owner/dashboard" element={<OwnerDashboard />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;