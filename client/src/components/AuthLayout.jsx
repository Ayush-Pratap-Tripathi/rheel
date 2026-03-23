import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Navbar from './Navbar';

const AuthLayout = () => {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#0d0d0d', color: '#fff' }}>Loading session...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="auth-layout" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#0d0d0d' }}>
            <Navbar />
            <main style={{ flex: 1, position: 'relative' }}>
                <Outlet />
            </main>
        </div>
    );
};

export default AuthLayout;
