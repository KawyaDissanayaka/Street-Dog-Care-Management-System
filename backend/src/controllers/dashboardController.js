const User = require('../models/User');
const DogReport = require('../models/DogReport');

const getDashboard = async (req, res) => {
    try {
        const userId = req.session.userId;
        const user = await User.findById(userId).select('-password');

        if (!user) {
            return req.session.destroy((err) => {
                res.redirect('/login');
            });
        }

        // Calculate statistics
        const totalReports = await DogReport.countDocuments({ reportedBy: userId });
        const rescuedDogs = await DogReport.countDocuments({ reportedBy: userId, status: "rescued" });
        const underTreatment = await DogReport.countDocuments({ reportedBy: userId, status: "under_treatment" });
        const adoptedDogs = await DogReport.countDocuments({ reportedBy: userId, status: "adopted" });
        const urgentReports = await DogReport.countDocuments({ 
            reportedBy: userId, 
            condition: { $in: ["injured", "critical"] } 
        });

        const stats = {
            totalReports,
            rescuedDogs,
            underTreatment,
            adoptedDogs,
            urgentReports
        };

        // Get latest 3 reports
        const recentReports = await DogReport.find({ reportedBy: userId })
            .sort({ createdAt: -1 })
            .limit(3);

        res.render('dashboard', { user, stats, recentReports });

    } catch (error) {
        console.error("Dashboard error:", error);
        res.status(500).send("An error occurred while loading the dashboard.");
    }
};

module.exports = {
    getDashboard
};
