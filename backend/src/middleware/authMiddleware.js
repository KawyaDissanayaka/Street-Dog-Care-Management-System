const requireAuth = (req, res, next) => {
    // Check if the user is authenticated (session exists)
    if (req.session && req.session.userId) {
        next(); // User is authenticated, proceed to the next function
    } else {
        // User is not authenticated, redirect to login page
        res.redirect('/login');
    }
};

const requireAdmin = (req, res, next) => {
    // Check if user is authenticated AND has the "admin" role
    if (req.session && req.session.userId && req.session.role === "admin") {
        next(); // User is an admin, proceed
    } else {
        // User is not an admin, redirect to dashboard
        res.redirect('/dashboard');
    }
};

module.exports = {
    requireAuth,
    requireAdmin
};
