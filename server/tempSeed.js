const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

dotenv.config();

const seedAdmin = async () => {
    try {
        console.log('Connecting to database...');
        await mongoose.connect(process.env.MONGO_URI);

        const existingAdmin = await User.findOne({ phoneNumber: '9852649181' });
        if (existingAdmin) {
            console.log('Admin already exists under this number. Upgrading credentials...');
            const salt = await bcrypt.genSalt(10);
            existingAdmin.password = await bcrypt.hash('Ayush@110', salt);
            existingAdmin.role = 'admin';
            existingAdmin.name = 'The Admin';
            await existingAdmin.save();
            console.log('Admin successfully updated.');
        } else {
            console.log('Creating new Admin...');
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('Ayush@110', salt);

            const adminUser = new User({
                name: 'The Admin',
                phoneNumber: '8888888888',
                password: hashedPassword,
                role: 'admin'
            });

            await adminUser.save();
            console.log('Admin successfully created.');
        }
        process.exit(0);
    } catch (error) {
        console.error('Error seeding admin:', error);
        process.exit(1);
    }
};

seedAdmin();
