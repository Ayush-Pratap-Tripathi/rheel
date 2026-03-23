const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
    registeredNumber: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    details: { type: String },
    vehicleType: { type: String, enum: ['bike', 'car', 'bus'], required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    topSpeed: { type: Number, required: true },
    compatiblePassengers: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Vehicle', vehicleSchema);
