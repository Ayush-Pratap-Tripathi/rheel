const Vehicle = require('../models/Vehicle');

const getVehicles = async (req, res) => {
    try {
        const { type, ownerId } = req.query;
        let query = {};
        if (type) {
            query.vehicleType = type;
        }
        if (ownerId) {
            query.owner = ownerId;
        }
        const vehicles = await Vehicle.find(query).populate('owner', 'name phoneNumber');
        res.json(vehicles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const addVehicle = async (req, res) => {
    try {
        const { registeredNumber, name, details, vehicleType, topSpeed, compatiblePassengers, owner } = req.body;
        const vehicleExists = await Vehicle.findOne({ registeredNumber });
        if (vehicleExists) {
            return res.status(400).json({ message: 'Vehicle already registered' });
        }

        let assignedOwner = req.user._id;
        if (req.user.role === 'admin' && owner) {
            assignedOwner = owner;
        }

        const vehicle = await Vehicle.create({
            registeredNumber, name, details, vehicleType, topSpeed, compatiblePassengers, owner: assignedOwner
        });
        res.status(201).json(vehicle);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getVehicles, addVehicle };
