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
    if (!req.session.userId || req.session.role !== 'admin') {
        return res.redirect('/dashboard');
    }
    next();
};

const requireVolunteer = (req, res, next) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }
    if (req.session.role !== 'volunteer' && req.session.role !== 'admin') {
        return res.redirect('/dashboard');
    }
    next();
};

const requireUser = (req, res, next) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }
    if (req.session.role === 'admin') {
        return res.redirect('/admin/dashboard');
    }
    if (req.session.role === 'volunteer') {
        return res.redirect('/volunteer/dashboard');
    }
    next();
};

module.exports = {
    requireAuth,
    requireAdmin,
    requireVolunteer,
    requireUser
};
