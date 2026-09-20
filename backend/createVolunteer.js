const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User');

const MONGO_URI = 'mongodb://localhost:27017/streetdogcare';

async function createVolunteer() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        // Check if volunteer exists
        const existing = await User.findOne({ email: 'volunteer@example.com' });
        if (existing) {
            console.log('Volunteer account already exists!');
            process.exit(0);
        }

        const hashedPassword = await bcrypt.hash('password123', 10);
        
        const volunteerUser = new User({
            name: 'Test Volunteer',
            email: 'volunteer@example.com',
            password: hashedPassword,
            role: 'volunteer'
        });

        await volunteerUser.save();
        console.log('Volunteer account created successfully!');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

createVolunteer();
