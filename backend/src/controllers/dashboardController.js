const User = require('../models/User');

const getDashboard = async (req, res) => {
    try {
        // 1. Get the logged-in user's ID from the session
        const userId = req.session.userId;

        // 2. Find the user in MongoDB, excluding the password field
        const user = await User.findById(userId).select('-password');

        // 3. If user doesn't exist in the database (e.g. deleted recently)
        if (!user) {
            // Destroy the invalid session and redirect to login
            return req.session.destroy((err) => {
                res.redirect('/login');
            });
        }

        // 4. Render the dashboard page and pass the user data
        res.render('dashboard', { user: user });

    } catch (error) {
        console.error("Dashboard error:", error);
        res.status(500).send("An error occurred while loading the dashboard.");
    }
};

module.exports = {
    getDashboard
};
