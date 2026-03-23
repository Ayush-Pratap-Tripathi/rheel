import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const Vehicles = () => {
    const [vehicles, setVehicles] = useState([]);
    const [myRequests, setMyRequests] = useState([]);
    const [filter, setFilter] = useState('');
    const { user } = useContext(AuthContext);

    useEffect(() => {
        fetchVehicles();
        if (user && user.role === 'user') {
            fetchMyRequests();
        }
    }, [filter, user]);

    const fetchVehicles = async () => {
        try {
            const url = filter ? `/api/vehicles?type=${filter}` : '/api/vehicles';
            const { data } = await axios.get(url);
            setVehicles(data);
        } catch (error) {
            toast.error('Failed to load vehicles');
        }
    };

    const fetchMyRequests = async () => {
        try {
            const { data } = await axios.get('/api/rents/my-requests', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setMyRequests(data);
        } catch (error) {
            console.error('Failed to load user requests', error);
        }
    };

    const requestRent = async (vehicleId) => {
        if (!user) return toast.error('Please login to request a vehicle');
        try {
            await axios.post('/api/rents/request', { vehicleId }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            toast.success('Rent requested successfully!');
            fetchMyRequests(); // Refresh requests to update UI
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to request rent');
        }
    };

    const handleAction = async (id, status) => {
        try {
            await axios.put(`/api/rents/${id}/status`, { status }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            toast.success(`Successfully marked as ${status}`);
            fetchMyRequests();
        } catch (error) {
            toast.error('Failed to update request');
        }
    };

    return (
        <div className="vehicles-container">
            <h2 className="title">Available Vehicles</h2>
            <div className="filters">
                <button className={filter === '' ? 'active' : ''} onClick={() => setFilter('')}>All</button>
                <button className={filter === 'bike' ? 'active' : ''} onClick={() => setFilter('bike')}>Bikes</button>
                <button className={filter === 'car' ? 'active' : ''} onClick={() => setFilter('car')}>Cars</button>
                <button className={filter === 'bus' ? 'active' : ''} onClick={() => setFilter('bus')}>Buses</button>
            </div>
            <div className="grid">
                {vehicles.map((v, i) => {
                    const userReqsForVehicle = myRequests.filter(req => req.vehicle && req.vehicle._id === v._id);
                    const latestReq = userReqsForVehicle.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];

                    return (
                        <motion.div 
                            key={v._id} 
                            className="card"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <h3>{v.name}</h3>
                            <p className="type">{v.vehicleType.toUpperCase()}</p>
                            <p>{v.details}</p>
                            <ul>
                                <li><strong>Top Speed:</strong> {v.topSpeed} km/h</li>
                                <li><strong>Passengers:</strong> {v.compatiblePassengers}</li>
                                <li><strong>Owner:</strong> {v.owner?.name}</li>
                            </ul>
                            
                            {user?.role === 'user' && (
                                <div className="mt-4">
                                    {(!latestReq || ['completed', 'cancelled'].includes(latestReq.status)) && (
                                        <>
                                            {latestReq && latestReq.status === 'cancelled' && <p className="mb-2 text-sm text-center" style={{color: '#ff4d4d'}}>⚠️ Last deal canceled.</p>}
                                            {latestReq && latestReq.status === 'completed' && <p className="mb-2 text-sm text-gray text-center">You rented this previously.</p>}
                                            <button className="btn-primary w-full" onClick={() => requestRent(v._id)}>Request Rent</button>
                                        </>
                                    )}
                                    {latestReq && latestReq.status === 'pending' && (
                                        <div className="status-box status-pending">
                                            Awaiting response...
                                        </div>
                                    )}
                                    {latestReq && latestReq.status === 'accepted' && (
                                        <div className="status-box status-accepted">
                                            <p className="font-bold mb-1">✅ Approved!</p>
                                            <p className="text-sm mb-3">Contact Owner: {latestReq.owner?.phoneNumber}</p>
                                            <div style={{display: 'flex', gap: '10px'}}>
                                                <button className="w-full" style={{background: '#00cc6a', color: 'black', border: 'none', padding: '8px', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer'}} onClick={() => handleAction(latestReq._id, 'completed')}>Rented</button>
                                                <button className="w-full" style={{background: '#cc2929', color: 'white', border: 'none', padding: '8px', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer'}} onClick={() => handleAction(latestReq._id, 'cancelled')}>Cancelled</button>
                                            </div>
                                        </div>
                                    )}
                                    {latestReq && latestReq.status === 'rejected' && (
                                        <>
                                            <div className="mt-2 mb-2 text-sm" style={{color: '#ff4d4d'}}>
                                                ⚠️ Last request declined
                                            </div>
                                            <button className="btn-primary w-full" onClick={() => requestRent(v._id)}>Request Rent Again</button>
                                        </>
                                    )}
                                </div>
                            )}
                            {!user && <p className="text-sm mt-4 text-center text-gray">Login to rent</p>}
                        </motion.div>
                    );
                })}
            </div>
            
            <style>{`
                .vehicles-container { padding: 40px 5vw; min-height: 100vh; background: #0d0d0d; }
                .title { font-size: 36px; margin-bottom: 30px; text-align: center; }
                .filters { display: flex; justify-content: center; gap: 15px; margin-bottom: 40px; }
                .filters button { background: #222; color: #fff; border: none; padding: 10px 20px; border-radius: 20px; cursor: pointer; transition: 0.3s; }
                .filters button.active, .filters button:hover { background: #e52e71; }
                .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 30px; }
                .card { background: #1a1a1a; padding: 25px; border-radius: 15px; border: 1px solid #333; transition: transform 0.3s; color: white; display: flex; flex-direction: column;}
                .card:hover { transform: translateY(-5px); border-color: #e52e71; box-shadow: 0 10px 20px rgba(229, 46, 113, 0.1); }
                .card h3 { font-size: 24px; margin-bottom: 5px; }
                .type { display: inline-block; background: #333; padding: 3px 10px; border-radius: 10px; font-size: 12px; margin-bottom: 15px; color: #ff8a00; font-weight: bold; }
                .card ul { list-style: none; margin-top: 15px; padding: 0; flex-grow: 1; }
                .card ul li { margin-bottom: 5px; color: #ccc; }
                .btn-primary { background: linear-gradient(90deg, #ff8a00, #e52e71); padding: 12px; border-radius: 8px; color: white; border: none; cursor: pointer; font-weight: bold; transition: 0.2s;}
                .btn-primary:active { transform: scale(0.98); }
                .w-full { width: 100%; }
                .mt-4 { margin-top: 20px; }
                .mb-1 { margin-bottom: 5px; }
                .font-bold { font-weight: bold; }
                .text-center { text-align: center; }
                .text-gray { color: #888; }
                .text-sm { font-size: 14px; }
                .status-box { padding: 10px; border-radius: 8px; text-align: center; font-weight: 500; font-size: 15px; border-left: 4px solid transparent; background: #222; }
                .status-pending { border-left-color: #ffcc00; color: #ffcc00; }
                .status-accepted { border-left-color: #00ff88; color: #00ff88; }
            `}</style>
        </div>
    );
};

export default Vehicles;
