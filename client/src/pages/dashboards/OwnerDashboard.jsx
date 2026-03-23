import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const OwnerDashboard = () => {
    const { user } = useContext(AuthContext);
    const [requests, setRequests] = useState([]);
    const [myVehicles, setMyVehicles] = useState([]);
    const [newVehicle, setNewVehicle] = useState({ registeredNumber: '', name: '', details: '', vehicleType: 'bike', topSpeed: '', compatiblePassengers: '' });
    const location = useLocation();
    const isRentersTab = location.pathname.includes('/renters');

    useEffect(() => {
        if (isRentersTab) fetchRequests();
        else fetchMyVehicles();
    }, [isRentersTab]);

    const fetchRequests = async () => {
        try {
            const { data } = await axios.get('/api/rents/my-requests', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setRequests(data);
        } catch (error) { toast.error('Failed to load requests'); }
    };

    const fetchMyVehicles = async () => {
        if (!user) return;
        try {
            const { data } = await axios.get(`/api/vehicles?ownerId=${user._id}`);
            setMyVehicles(data);
        } catch (error) { toast.error('Failed to load your vehicles'); }
    };

    const handleAddVehicle = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/vehicles', newVehicle, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            toast.success('Vehicle added successfully');
            setNewVehicle({ registeredNumber: '', name: '', details: '', vehicleType: 'bike', topSpeed: '', compatiblePassengers: '' });
            fetchMyVehicles(); // refresh list
        } catch (error) { toast.error(error.response?.data?.message || 'Failed to add vehicle'); }
    };

    const handleRespond = async (id, status) => {
        try {
            await axios.put(`/api/rents/${id}/status`, { status }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            toast.success(`Request ${status}`);
            fetchRequests();
        } catch (error) { toast.error('Failed to respond to request'); }
    };

    if (isRentersTab) {
        return (
            <div className="dashboard-content">
                <h2>My Renters (Incoming Requests)</h2>
                {requests.length === 0 ? <p className="text-gray mt-4">No requests found.</p> : (
                    <div className="requests-list">
                        {requests.map(req => (
                            <div key={req._id} className={`request-card ${req.status}`}>
                                <h4>{req.vehicle?.name}</h4>
                                <p>Requested by: {req.user?.name}</p>
                                <p>Status: <strong className={`status-${req.status}`}>{req.status.toUpperCase()}</strong></p>
                                {req.status === 'accepted' && (
                                    <>
                                        <p className="contact-box">Contact: {req.user?.phoneNumber}</p>
                                        <div className="action-buttons mt-4">
                                            <button onClick={() => handleRespond(req._id, 'cancelled')} className="btn-reject w-full" style={{width: '100%'}}>Cancel Deal</button>
                                        </div>
                                    </>
                                )}
                                {req.status === 'pending' && (
                                    <div className="action-buttons mt-4">
                                        <button onClick={() => handleRespond(req._id, 'accepted')} className="btn-accept">Accept</button>
                                        <button onClick={() => handleRespond(req._id, 'rejected')} className="btn-reject">Reject</button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="dashboard-content">
            <h2>My Vehicles</h2>
            <div className="form-card mt-4">
                <h3>Add New Vehicle</h3>
                <form onSubmit={handleAddVehicle} className="add-vehicle-form mt-4">
                    <input type="text" placeholder="Reg. Number (e.g. AB12CD3456)" value={newVehicle.registeredNumber} onChange={e=>setNewVehicle({...newVehicle, registeredNumber: e.target.value})} required/>
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
            
            <h3 className="mt-5">Enlisted Vehicles</h3>
            {myVehicles.length === 0 ? <p className="text-gray mt-2">You haven't added any vehicles yet.</p> : (
                <div className="requests-list mt-4">
                    {myVehicles.map(v => (
                        <div key={v._id} className="request-card">
                            <h4>{v.name} ({v.registeredNumber})</h4>
                            <p className="text-gray">Type: {v.vehicleType.toUpperCase()} | Speed: {v.topSpeed} km/h | Passengers: {v.compatiblePassengers}</p>
                            {v.details && <p className="mt-2 text-sm" style={{fontSize: '14px', color: '#ccc'}}>{v.details}</p>}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
export default OwnerDashboard;
