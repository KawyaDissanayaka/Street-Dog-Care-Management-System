const mongoose = require('mongoose');
const User = require('./src/models/User');
const DogReport = require('./src/models/DogReport');

const MONGO_URI = 'mongodb://localhost:27017/streetdogcare';

async function seedReports() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        // Get the volunteer we created earlier
        const volunteer = await User.findOne({ email: 'volunteer@example.com' });
        
        // Get the regular user we created earlier (or use volunteer as reporter if none exists)
        let reporter = await User.findOne({ role: 'user' });
        if (!reporter) reporter = volunteer;

        if (!volunteer) {
            console.log("Volunteer not found! Run createVolunteer.js first.");
            process.exit(1);
        }

        // Create Report 1 (Assigned to our volunteer)
        const report1 = new DogReport({
            dogName: 'Tommy',
            location: 'Colombo 7, Viharamahadevi Park Gate',
            condition: 'injured',
            description: 'Dog with a broken leg near the main gate. Needs immediate medical attention.',
            reportedBy: reporter._id,
            status: 'under_treatment',
            assignedVolunteer: volunteer._id
        });

        // Create Report 2 (New report, unassigned)
        const report2 = new DogReport({
            dogName: 'Brownie',
            location: 'Galle Road, Mount Lavinia',
            condition: 'sick',
            description: 'Very weak street dog, not eating anything for 2 days.',
            reportedBy: reporter._id,
            status: 'reported',
            assignedVolunteer: null
        });

        await report1.save();
        await report2.save();

        console.log('Successfully created test dog reports!');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

seedReports();
