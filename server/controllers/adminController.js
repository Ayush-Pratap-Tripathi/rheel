const User = require('../models/User');
const Vehicle = require('../models/Vehicle');
const RentRequest = require('../models/RentRequest');
const bcrypt = require('bcryptjs');

const getStats = async (req, res) => {
    try {
        const usersCount = await User.countDocuments({ role: 'user' });
        const ownersCount = await User.countDocuments({ role: 'owner' });
        const adminCount = await User.countDocuments({ role: 'admin' });
        const vehiclesCount = await Vehicle.countDocuments();
        const rentedItemsCount = await RentRequest.countDocuments({ status: 'accepted' });

        res.json({
            users: usersCount,
            owners: ownersCount,
            admins: adminCount,
            totalVehicles: vehiclesCount,
            activeRentals: rentedItemsCount
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createUserOwner = async (req, res) => {
    try {
        const { name, phoneNumber, password, role } = req.body;
        if(!['user', 'owner', 'admin'].includes(role)){
             return res.status(400).json({ message: 'Invalid role' });
        }
        const userExists = await User.findOne({ phoneNumber });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({ name, phoneNumber, password: hashedPassword, role });
        res.status(201).json({ _id: user._id, name: user.name, role: user.role });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getRentedVehicles = async (req, res) => {
    try {
        const rentals = await RentRequest.find({ status: 'accepted' }).populate('vehicle').populate('user', 'name phoneNumber').populate('owner', 'name phoneNumber');
        res.json(rentals);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getUsers = async (req, res) => {
    try {
        const users = await User.find({ role: 'user' }).select('-password -__v');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getOwners = async (req, res) => {
    try {
        const owners = await User.find({ role: 'owner' }).select('-password -__v');
        res.json(owners);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getStats, createUserOwner, getRentedVehicles, getUsers, getOwners };
