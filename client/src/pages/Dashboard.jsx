import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const Dashboard = () => {
    const { user, logout, loading } = useContext(AuthContext);
    const navigate = useNavigate();
    
    // States for different roles
    const [requests, setRequests] = useState([]);
    const [stats, setStats] = useState(null);
    const [newVehicle, setNewVehicle] = useState({ registeredNumber: '', name: '', details: '', vehicleType: 'bike', topSpeed: '', compatiblePassengers: '' });

    useEffect(() => {
        if (!loading && !user) navigate('/login');
        if (user) {
            if (user.role === 'admin') fetchStats();
            if (user.role === 'user' || user.role === 'owner') fetchRequests();
        }
    }, [user, loading, navigate]);

    const fetchRequests = async () => {
        try {
            const { data } = await axios.get('/api/rents/my-requests', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setRequests(data);
        } catch (error) {
            toast.error('Failed to load requests');
        }
    };

    const fetchStats = async () => {
        try {
            const { data } = await axios.get('/api/admin/stats', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setStats(data);
        } catch (error) {
            toast.error('Failed to load stats');
        }
    };

    const handleAddVehicle = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/vehicles', newVehicle, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            toast.success('Vehicle added successfully');
            setNewVehicle({ registeredNumber: '', name: '', details: '', vehicleType: 'bike', topSpeed: '', compatiblePassengers: '' });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add vehicle');
        }
    };

    const handleRespond = async (id, status) => {
        try {
            await axios.put(`/api/rents/${id}/status`, { status }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            toast.success(`Request ${status}`);
            fetchRequests();
        } catch (error) {
            toast.error('Failed to respond to request');
        }
    };
    
    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const backHome = () => { navigate('/'); };

    if (loading) return <div>Loading...</div>;
    if (!user) return null;

    return (
        <div className="dashboard-container">
            <div className="header">
                <div>
                   <h2 className="greeting">Welcome, {user.name} <span className="role-badge">{user.role.toUpperCase()}</span></h2>
                </div>
                <div>
                    <button onClick={backHome} className="btn-secondary mr-2">Home</button>
                    <button onClick={handleLogout} className="btn-logout">Logout</button>
                </div>
            </div>

            {user.role === 'admin' && stats && (
                <div className="stats-grid">
                    <div className="stat-card"><h3>Users</h3><p>{stats.users}</p></div>
                    <div className="stat-card"><h3>Owners</h3><p>{stats.owners}</p></div>
                    <div className="stat-card"><h3>Vehicles</h3><p>{stats.totalVehicles}</p></div>
                    <div className="stat-card"><h3>Active Rentals</h3><p>{stats.activeRentals}</p></div>
                </div>
            )}

            {user.role === 'owner' && (
                <div className="owner-section">
                    <h3>Add New Vehicle</h3>
                    <form onSubmit={handleAddVehicle} className="add-vehicle-form">
                        <input type="text" placeholder="Reg. Number (e.g., AB12CD3456)" value={newVehicle.registeredNumber} onChange={e=>setNewVehicle({...newVehicle, registeredNumber: e.target.value})} required/>
                        <input type="text" placeholder="Name" value={newVehicle.name} onChange={e=>setNewVehicle({...newVehicle, name: e.target.value})} required/>
                        <input type="text" placeholder="Details" value={newVehicle.details} onChange={e=>setNewVehicle({...newVehicle, details: e.target.value})} />
                        <select value={newVehicle.vehicleType} onChange={e=>setNewVehicle({...newVehicle, vehicleType: e.target.value})}>
                            <option value="bike">Bike</option><option value="car">Car</option><option value="bus">Bus</option>
                        </select>
                        <input type="number" placeholder="Top Speed (km/h)" value={newVehicle.topSpeed} onChange={e=>setNewVehicle({...newVehicle, topSpeed: e.target.value})} required/>
                        <input type="number" placeholder="Compatible Passengers" value={newVehicle.compatiblePassengers} onChange={e=>setNewVehicle({...newVehicle, compatiblePassengers: e.target.value})} required/>
                        <button type="submit" className="btn-primary">Add Vehicle</button>
                    </form>
                </div>
            )}

            {(user.role === 'user' || user.role === 'owner') && (
                <div className="requests-section">
                    <h3>{user.role === 'owner' ? 'Received Requests' : 'My Rent Requests'}</h3>
                    {requests.length === 0 ? <p className="text-gray">No requests found.</p> : (
                        <div className="requests-list">
                            {requests.map(req => (
                                <div key={req._id} className={`request-card ${req.status}`}>
                                    <h4>{req.vehicle?.name} ({req.vehicle?.registeredNumber})</h4>
                                    <p>Status: <strong className={`status-${req.status}`}>{req.status.toUpperCase()}</strong></p>
                                    
                                    {user.role === 'user' && req.status === 'accepted' && (
                                        <p className="contact">Contact Owner: {req.owner?.phoneNumber} ({req.owner?.name})</p>
                                    )}
                                    {user.role === 'owner' && (
                                        <>
                                            <p className="contact">Requested by: {req.user?.name} (Ph: {req.status==='accepted' ? req.user?.phoneNumber : 'Hidden till accepted'})</p>
                                            {req.status === 'pending' && (
                                                <div className="action-buttons">
                                                    <button onClick={() => handleRespond(req._id, 'accepted')} className="btn-accept">Accept</button>
                                                    <button onClick={() => handleRespond(req._id, 'rejected')} className="btn-reject">Reject</button>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            <style>{`
                .dashboard-container { padding: 40px 5vw; min-height: 100vh; background: #0d0d0d; color: #fff; font-family: 'Inter', sans-serif; }
                .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; border-bottom: 1px solid #333; padding-bottom: 20px; }
                .greeting { display: flex; align-items: center; gap: 15px; }
                .role-badge { font-size: 12px; background: #e52e71; padding: 4px 10px; border-radius: 12px; font-weight: bold; letter-spacing: 1px; }
                .btn-secondary { background: #333; border: none; color: white; padding: 8px 16px; border-radius: 8px; cursor: pointer; transition: 0.3s; margin-right: 15px; }
                .btn-secondary:hover { background: #555; }
                .btn-logout { background: transparent; border: 1px solid #e52e71; color: #e52e71; padding: 8px 16px; border-radius: 8px; cursor: pointer; transition: 0.3s; }
                .btn-logout:hover { background: #e52e71; color: white; }
                .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 40px; }
                .stat-card { background: #1a1a1a; padding: 30px; border-radius: 12px; text-align: center; border: 1px solid #333; transition: transform 0.3s; }
                .stat-card:hover { transform: translateY(-3px); border-color: #ff8a00; }
                .stat-card h3 { color: #888; font-size: 16px; margin-bottom: 10px; }
                .stat-card p { font-size: 48px; font-weight: bold; background: linear-gradient(90deg, #ff8a00, #e52e71); -webkit-background-clip: text; color: transparent; line-height: 1;}
                .owner-section, .requests-section { background: #1a1a1a; padding: 30px; border-radius: 12px; margin-bottom: 40px; border: 1px solid #222; }
                .add-vehicle-form { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 20px; }
                @media (max-width: 600px) { .add-vehicle-form { grid-template-columns: 1fr; } }
                .add-vehicle-form input, .add-vehicle-form select { padding: 12px; background: #222; border: 1px solid #333; border-radius: 8px; color: white; font-family: 'Inter', sans-serif;}
                .add-vehicle-form .btn-primary { grid-column: 1 / -1; background: linear-gradient(90deg, #ff8a00, #e52e71); border: none; padding: 15px; color: white; font-weight: bold; border-radius: 8px; cursor: pointer; transition: 0.3s;}
                .add-vehicle-form .btn-primary:active { transform: scale(0.98); }
                .requests-list { display: grid; gap: 15px; margin-top: 20px; }
                .request-card { background: #222; padding: 20px; border-radius: 8px; border-left: 5px solid #555; }
                .request-card.accepted { border-left-color: #00ff88; }
                .request-card.rejected { border-left-color: #ff3333; }
                .request-card.pending { border-left-color: #ffcc00; }
                .status-accepted { color: #00ff88; }
                .status-rejected { color: #ff3333; }
                .status-pending { color: #ffcc00; }
                .contact { background: #111; padding: 10px; border-radius: 5px; margin-top: 10px; font-family: monospace; font-size: 14px; border: 1px solid #333; }
                .action-buttons { margin-top: 15px; display: flex; gap: 10px; }
                .action-buttons button { padding: 8px 20px; border: none; border-radius: 5px; cursor: pointer; font-weight: bold; transition: 0.2s;}
                .btn-accept { background: #00cc6a; color: #000; }
                .btn-accept:hover { background: #00e676; }
                .btn-reject { background: #cc2929; color: white; }
                .btn-reject:hover { background: #e53939; }
                .text-gray { color: #888; }
            `}</style>
        </div>
    );
};

export default Dashboard;
