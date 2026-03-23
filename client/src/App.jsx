import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { useContext } from 'react';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Vehicles from './pages/Vehicles';
// new role-based dashboards
import UserDashboard from './pages/dashboards/UserDashboard';
import OwnerDashboard from './pages/dashboards/OwnerDashboard';
import AdminDashboard from './pages/dashboards/AdminDashboard';
import AuthLayout from './components/AuthLayout';
import { Toaster } from 'react-hot-toast';
import './index.css';

const RootRedirect = () => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#0d0d0d', color: '#fff' }}>Loading configuration...</div>;
  if (!user) return <Home />;
  
  if (user.role === 'admin') return <Navigate to="/admin" replace />;
  if (user.role === 'owner') return <Navigate to="/owner" replace />;
  return <Navigate to="/vehicles" replace />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <div className="app">
          <Routes>
            <Route path="/" element={<RootRedirect />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route path="/dashboard" element={<Navigate to="/" replace />} />
            
            {/* Protected Routes utilizing the Navbar wrapper */}
            <Route element={<AuthLayout />}>
              <Route path="/vehicles" element={<Vehicles />} />
              
              {/* User Routes */}
              <Route path="/user" element={<UserDashboard />} />
              
              {/* Owner Routes */}
              <Route path="/owner" element={<OwnerDashboard />} />
              <Route path="/owner/renters" element={<OwnerDashboard />} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/rents" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<AdminDashboard />} />
              <Route path="/admin/owners" element={<AdminDashboard />} />
              <Route path="/admin/vehicles" element={<AdminDashboard />} />
              <Route path="/admin/add-user" element={<AdminDashboard />} />
              <Route path="/admin/add-owner" element={<AdminDashboard />} />
              <Route path="/admin/add-vehicle" element={<AdminDashboard />} />
            </Route>
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
export default App;
