import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const UserDashboard = () => {
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const { data } = await axios.get('/api/rents/my-requests', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setRequests(data);
        } catch (error) {
            toast.error('Failed to load rent history');
        }
    };

    return (
        <div className="dashboard-content">
            <h2>My Rent History</h2>
            {requests.length === 0 ? <p className="text-gray mt-4">No rent history found.</p> : (
                <div className="requests-list">
                    {requests.map(req => (
                        <div key={req._id} className={`request-card ${req.status}`}>
                            <h4>{req.vehicle?.name} ({req.vehicle?.registeredNumber})</h4>
                            <p>Status: <strong className={`status-${req.status}`}>{req.status.toUpperCase()}</strong></p>
                            {req.status === 'accepted' && (
                                <div className="contact-box">
                                    <p>Owner: {req.owner?.name}</p>
                                    <p>Contact: {req.owner?.phoneNumber}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
export default UserDashboard;
