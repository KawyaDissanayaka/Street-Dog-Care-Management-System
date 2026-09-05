const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');

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

module.exports = router;
