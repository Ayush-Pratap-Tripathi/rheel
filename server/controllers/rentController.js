const RentRequest = require('../models/RentRequest');
const Vehicle = require('../models/Vehicle');

const requestRent = async (req, res) => {
    try {
        const { vehicleId } = req.body;
        const v = await Vehicle.findById(vehicleId);
        if(!v) return res.status(404).json({ message: 'Vehicle not found' });
        
        const rentReq = await RentRequest.create({
            vehicle: vehicleId,
            user: req.user._id,
            owner: v.owner
        });
        res.status(201).json(rentReq);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const respondRent = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; 
        const rentReq = await RentRequest.findById(id).populate('user', 'name phoneNumber').populate('owner', 'name phoneNumber').populate('vehicle');
        
        if (!rentReq) return res.status(404).json({ message: 'Request not found' });

        const isOwner = rentReq.owner._id.toString() === req.user._id.toString();
        const isUser = rentReq.user._id.toString() === req.user._id.toString();
        const isAdmin = req.user.role === 'admin';

        if (!isOwner && !isAdmin) {
            // Allow User to mark an accepted request as completed or cancelled
            if (isUser && (status === 'completed' || status === 'cancelled') && rentReq.status === 'accepted') {
                // allowed
            } else {
                return res.status(401).json({ message: 'Not authorized to respond to this request' });
            }
        }

        rentReq.status = status;
        await rentReq.save();
        
        res.json(rentReq);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getMyRequests = async (req, res) => {
    try {
        if(req.user.role === 'user'){
            const reqs = await RentRequest.find({ user: req.user._id }).populate('vehicle').populate('owner', 'name phoneNumber');
            return res.json(reqs);
        } else if (req.user.role === 'owner') {
            const reqs = await RentRequest.find({ owner: req.user._id }).populate('vehicle').populate('user', 'name phoneNumber');
            return res.json(reqs);
        }
        res.json([]);
    } catch(error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { requestRent, respondRent, getMyRequests };
