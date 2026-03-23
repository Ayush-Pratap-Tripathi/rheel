import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
    const location = useLocation();
    const [stats, setStats] = useState(null);
    const [rentals, setRentals] = useState([]);
    const [usersList, setUsersList] = useState([]);
    const [ownersList, setOwnersList] = useState([]);
    const [vehiclesList, setVehiclesList] = useState([]);
    const [newUserForm, setNewUserForm] = useState({ name: '', phoneNumber: '', password: '' });
    const [newOwnerForm, setNewOwnerForm] = useState({ name: '', phoneNumber: '', password: '' });
    const [newAdminVehicleForm, setNewAdminVehicleForm] = useState({ registeredNumber: '', name: '', details: '', vehicleType: 'bike', topSpeed: '', compatiblePassengers: '', owner: '' });

    const path = location.pathname;

    useEffect(() => {
        if (path === '/admin' || path === '/admin/rents') {
            fetchStatsAndRentals();
        } else if (path.includes('/users')) {
            fetchUsersList();
        } else if (path.includes('/owners') || path.includes('/add-vehicle')) {
            fetchOwnersList();
        } else if (path.includes('/vehicles')) {
            fetchVehiclesList();
        }
    }, [path]);

    const fetchVehiclesList = async () => {
        try {
            const { data } = await axios.get('/api/vehicles');
            setVehiclesList(data);
        } catch (error) { toast.error('Failed to load vehicles list'); }
    };

    const fetchOwnersList = async () => {
        try {
            const { data } = await axios.get('/api/admin/all-owners', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setOwnersList(data);
        } catch (error) { toast.error('Failed to load owners list'); }
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/admin/users', { ...newUserForm, role: 'user' }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            toast.success('User created successfully. They can now log in.');
            setNewUserForm({ name: '', phoneNumber: '', password: '' });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create user');
        }
    };

    const handleAddOwner = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/admin/users', { ...newOwnerForm, role: 'owner' }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            toast.success('Owner created successfully. They can now log in.');
            setNewOwnerForm({ name: '', phoneNumber: '', password: '' });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create owner');
        }
    };

    const handleAddAdminVehicle = async (e) => {
        e.preventDefault();
        if (!newAdminVehicleForm.owner) return toast.error('Please select an owner for this vehicle');
        try {
            await axios.post('/api/vehicles', newAdminVehicleForm, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            toast.success('Vehicle formally enlisted successfully.');
            setNewAdminVehicleForm({ registeredNumber: '', name: '', details: '', vehicleType: 'bike', topSpeed: '', compatiblePassengers: '', owner: '' });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add vehicle');
        }
    };

    const fetchUsersList = async () => {
        try {
            const { data } = await axios.get('/api/admin/all-users', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setUsersList(data);
        } catch (error) { toast.error('Failed to load users list'); }
    };

    const fetchStatsAndRentals = async () => {
        try {
            const token = localStorage.getItem('token');
            const [statsRes, rentalsRes] = await Promise.all([
                axios.get('/api/admin/stats', { headers: { Authorization: `Bearer ${token}` } }),
                axios.get('/api/admin/rentals', { headers: { Authorization: `Bearer ${token}` } })
            ]);
            setStats(statsRes.data);
            setRentals(rentalsRes.data);
        } catch (error) { toast.error('Failed to load admin data'); }
    };

    const renderContent = () => {
        if (path.includes('/users')) {
            return (
                <>
                    <h2>Platform Users</h2>
                    {usersList.length === 0 ? <p className="text-gray mt-4">No users found.</p> : (
                        <div className="requests-list mt-4">
                            {usersList.map((u) => (
                                <div key={u._id} className="request-card">
                                    <h4>{u.name}</h4>
                                    <p className="text-gray mt-2">Phone: {u.phoneNumber}</p>
                                    <p className="text-sm mt-1" style={{color: '#888'}}>Joined: {new Date(u.createdAt).toLocaleDateString()}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            );
        }
        if (path.includes('/owners')) {
            return (
                <>
                    <h2>Platform Owners</h2>
                    {ownersList.length === 0 ? <p className="text-gray mt-4">No owners found.</p> : (
                        <div className="requests-list mt-4">
                            {ownersList.map((o) => (
                                <div key={o._id} className="request-card">
                                    <h4>{o.name}</h4>
                                    <p className="text-gray mt-2">Phone: {o.phoneNumber}</p>
                                    <p className="text-sm mt-1" style={{color: '#888'}}>Partner since: {new Date(o.createdAt).toLocaleDateString()}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            );
        }
        if (path.includes('/vehicles')) {
            return (
                <>
                    <h2>Platform Vehicles</h2>
                    {vehiclesList.length === 0 ? <p className="text-gray mt-4">No vehicles found.</p> : (
                        <div className="requests-list mt-4">
                            {vehiclesList.map((v) => (
                                <div key={v._id} className="request-card">
                                    <h4>{v.name} ({v.registeredNumber})</h4>
                                    <p className="text-gray mt-2">Type: {v.vehicleType.toUpperCase()} | Speed: {v.topSpeed} km/h | Passengers: {v.compatiblePassengers}</p>
                                    <p className="text-sm mt-1" style={{color: '#888'}}>Owner: {v.owner?.name} ({v.owner?.phoneNumber})</p>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            );
        }
        if (path.includes('/add-user')) {
            return (
                <div className="form-card mt-5" style={{maxWidth: '500px', margin: '40px auto'}}>
                    <h3>Add New Platform User</h3>
                    <form onSubmit={handleAddUser} style={{display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px'}}>
                        <input type="text" placeholder="Full Name" value={newUserForm.name} onChange={e=>setNewUserForm({...newUserForm, name: e.target.value})} required style={{padding: '12px', background: '#222', border: '1px solid #333', borderRadius: '8px', color: 'white', fontFamily: 'Inter, sans-serif'}}/>
                        <input type="tel" placeholder="Phone Number" value={newUserForm.phoneNumber} onChange={e=>setNewUserForm({...newUserForm, phoneNumber: e.target.value})} required style={{padding: '12px', background: '#222', border: '1px solid #333', borderRadius: '8px', color: 'white', fontFamily: 'Inter, sans-serif'}}/>
                        <input type="password" placeholder="Password" value={newUserForm.password} onChange={e=>setNewUserForm({...newUserForm, password: e.target.value})} required style={{padding: '12px', background: '#222', border: '1px solid #333', borderRadius: '8px', color: 'white', fontFamily: 'Inter, sans-serif'}}/>
                        <button type="submit" className="btn-primary" style={{padding: '15px', background: 'linear-gradient(90deg, #ff8a00, #e52e71)', border: 'none', color: 'white', fontWeight: 'bold', borderRadius: '8px', cursor: 'pointer', marginTop: '10px', transition: 'transform 0.2s'}}>Create User</button>
                    </form>
                </div>
            );
        }
        if (path.includes('/add-owner')) {
            return (
                <div className="form-card mt-5" style={{maxWidth: '500px', margin: '40px auto'}}>
                    <h3>Add New Platform Owner</h3>
                    <form onSubmit={handleAddOwner} style={{display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px'}}>
                        <input type="text" placeholder="Owner Full Name" value={newOwnerForm.name} onChange={e=>setNewOwnerForm({...newOwnerForm, name: e.target.value})} required style={{padding: '12px', background: '#222', border: '1px solid #333', borderRadius: '8px', color: 'white', fontFamily: 'Inter, sans-serif'}}/>
                        <input type="tel" placeholder="Phone Number" value={newOwnerForm.phoneNumber} onChange={e=>setNewOwnerForm({...newOwnerForm, phoneNumber: e.target.value})} required style={{padding: '12px', background: '#222', border: '1px solid #333', borderRadius: '8px', color: 'white', fontFamily: 'Inter, sans-serif'}}/>
                        <input type="password" placeholder="Password" value={newOwnerForm.password} onChange={e=>setNewOwnerForm({...newOwnerForm, password: e.target.value})} required style={{padding: '12px', background: '#222', border: '1px solid #333', borderRadius: '8px', color: 'white', fontFamily: 'Inter, sans-serif'}}/>
                        <button type="submit" className="btn-primary" style={{padding: '15px', background: 'linear-gradient(90deg, #ff8a00, #e52e71)', border: 'none', color: 'white', fontWeight: 'bold', borderRadius: '8px', cursor: 'pointer', marginTop: '10px', transition: 'transform 0.2s'}}>Create Owner</button>
                    </form>
                </div>
            );
        }
        if (path.includes('/add-vehicle')) {
            return (
                <div className="form-card mt-5" style={{maxWidth: '600px', margin: '40px auto'}}>
                    <h3>Add New Platform Vehicle</h3>
                    <form onSubmit={handleAddAdminVehicle} style={{display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px'}}>
                        
                        <label className="text-gray" style={{marginBottom: '-5px', fontSize: '14px'}}>Assign to Owner:</label>
                        <select value={newAdminVehicleForm.owner} onChange={e=>setNewAdminVehicleForm({...newAdminVehicleForm, owner: e.target.value})} required style={{padding: '12px', background: '#222', border: '1px solid #333', borderRadius: '8px', color: 'white', fontFamily: 'Inter, sans-serif'}}>
                            <option value="" disabled>Select an Owner</option>
                            {ownersList.map(o => <option key={o._id} value={o._id}>{o.name} ({o.phoneNumber})</option>)}
                        </select>

                        <input type="text" placeholder="Reg. Number (e.g. AB12CD3456)" value={newAdminVehicleForm.registeredNumber} onChange={e=>setNewAdminVehicleForm({...newAdminVehicleForm, registeredNumber: e.target.value})} required style={{padding: '12px', background: '#222', border: '1px solid #333', borderRadius: '8px', color: 'white', fontFamily: 'Inter, sans-serif'}}/>
                        <input type="text" placeholder="Vehicle Name" value={newAdminVehicleForm.name} onChange={e=>setNewAdminVehicleForm({...newAdminVehicleForm, name: e.target.value})} required style={{padding: '12px', background: '#222', border: '1px solid #333', borderRadius: '8px', color: 'white', fontFamily: 'Inter, sans-serif'}}/>
                        <input type="text" placeholder="Short Details" value={newAdminVehicleForm.details} onChange={e=>setNewAdminVehicleForm({...newAdminVehicleForm, details: e.target.value})} style={{padding: '12px', background: '#222', border: '1px solid #333', borderRadius: '8px', color: 'white', fontFamily: 'Inter, sans-serif'}}/>
                        
                        <label className="text-gray" style={{marginBottom: '-5px', fontSize: '14px'}}>Vehicle Type:</label>
                        <select value={newAdminVehicleForm.vehicleType} onChange={e=>setNewAdminVehicleForm({...newAdminVehicleForm, vehicleType: e.target.value})} style={{padding: '12px', background: '#222', border: '1px solid #333', borderRadius: '8px', color: 'white', fontFamily: 'Inter, sans-serif'}}>
                            <option value="bike">Bike</option><option value="car">Car</option><option value="bus">Bus</option>
                        </select>

                        <div style={{display: 'flex', gap: '15px'}}>
                            <input type="number" placeholder="Top Speed (km/h)" value={newAdminVehicleForm.topSpeed} onChange={e=>setNewAdminVehicleForm({...newAdminVehicleForm, topSpeed: e.target.value})} required style={{flex: 1, padding: '12px', background: '#222', border: '1px solid #333', borderRadius: '8px', color: 'white', fontFamily: 'Inter, sans-serif'}}/>
                            <input type="number" placeholder="Max Passengers" value={newAdminVehicleForm.compatiblePassengers} onChange={e=>setNewAdminVehicleForm({...newAdminVehicleForm, compatiblePassengers: e.target.value})} required style={{flex: 1, padding: '12px', background: '#222', border: '1px solid #333', borderRadius: '8px', color: 'white', fontFamily: 'Inter, sans-serif'}}/>
                        </div>

                        <button type="submit" className="btn-primary" style={{padding: '15px', background: 'linear-gradient(90deg, #ff8a00, #e52e71)', border: 'none', color: 'white', fontWeight: 'bold', borderRadius: '8px', cursor: 'pointer', marginTop: '10px', transition: 'transform 0.2s'}}>Enlist Vehicle</button>
                    </form>
                </div>
            );
        }

        return (
            <>
                <h2>System Overview</h2>
                {stats && (
                    <div className="stats-grid mt-4">
                        <div className="stat-card"><h3>Users</h3><p>{stats.users}</p></div>
                        <div className="stat-card"><h3>Owners</h3><p>{stats.owners}</p></div>
                        <div className="stat-card"><h3>Vehicles</h3><p>{stats.totalVehicles}</p></div>
                        <div className="stat-card"><h3>Active Rentals</h3><p>{stats.activeRentals}</p></div>
                    </div>
                )}
                <h3 className="mt-5">Active Rentals</h3>
                {rentals.length === 0 ? <p className="text-gray mt-2">No active rentals.</p> : (
                    <div className="requests-list mt-4">
                        {rentals.map(req => (
                            <div key={req._id} className="request-card accepted">
                                <h4>{req.vehicle?.name} ({req.vehicle?.registeredNumber})</h4>
                                <p>Rented By: {req.user?.name} | Owner: {req.owner?.name}</p>
                            </div>
                        ))}
                    </div>
                )}
            </>
        );
    };

    return <div className="dashboard-content">{renderContent()}</div>;
};
export default AdminDashboard;
