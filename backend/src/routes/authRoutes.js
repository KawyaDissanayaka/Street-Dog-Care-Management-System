const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');
const { getDashboard } = require('../controllers/dashboardController');
const { requireAuth } = require('../middleware/authMiddleware');

// Render Registration Page
// GET /register
router.get("/register", (req, res) => {
    res.render("register");
});

// User Registration Route
// POST /register
router.post("/register", registerUser);

// Render Login Page
// GET /login
router.get("/login", (req, res) => {
    res.render("login");
});

// User Login Route
// POST /login
router.post("/login", loginUser);

// Dashboard Route (Protected)
// GET /dashboard
router.get("/dashboard", requireAuth, getDashboard);

// Logout Route
// GET /logout
router.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        res.redirect("/login");
    });
});

module.exports = router;
