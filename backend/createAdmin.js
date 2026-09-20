const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User');

const MONGO_URI = 'mongodb://localhost:27017/streetdogcare';

async function createAdmin() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        // Check if admin exists
        const existing = await User.findOne({ email: 'admin@example.com' });
        if (existing) {
            console.log('Admin account already exists!');
            process.exit(0);
        }

        const hashedPassword = await bcrypt.hash('admin123', 10);
        
        const adminUser = new User({
            name: 'System Admin',
            email: 'admin@example.com',
            password: hashedPassword,
            role: 'admin'
        });

        await adminUser.save();
        console.log('Admin account created successfully!');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

createAdmin();
