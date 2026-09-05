const User = require('../models/User');
const bcrypt = require('bcryptjs');

const registerUser = async (req, res) => {
    try {
        let { name, email, password, phone, address } = req.body;

        // 1. Validate required fields
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email, and password are required"
            });
        }

        // 2. Validate password length
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must contain at least 6 characters"
            });
        }

        // 3. Clean email formatting
        email = email.toLowerCase().trim();

        // 4. Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "A user with this email already exists"
            });
        }

        // 5. Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 6. Create new User instance
        const newUser = new User({
            name: name.trim(),
            email: email,
            password: hashedPassword,
            phone: phone ? phone.trim() : undefined,
            address: address ? address.trim() : undefined,
            role: "user"
        });

        // 7. Save to MongoDB
        await newUser.save();

        // 8. Return success response
        res.status(201).json({
            success: true,
            message: "User registered successfully"
        });

    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred during registration. Please try again."
        });
    }
};

const loginUser = async (req, res) => {
    try {
        let { email, password } = req.body;

        // 1. Validate required fields
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        // 2. Clean email formatting
        email = email.toLowerCase().trim();

        // 3. Find the user by email
        const user = await User.findOne({ email });
        
        // 4. Check if user exists
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // 5. Check if account is active
        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message: "Your account has been deactivated"
            });
        }

        // 6. Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // 7. Store values in session
        req.session.userId = user._id;
        req.session.role = user.role;
        req.session.userName = user.name;

        // 8. Redirect to correct dashboard based on role
        if (user.role === 'admin') {
            res.redirect('/admin/dashboard');
        } else if (user.role === 'volunteer') {
            res.redirect('/volunteer/dashboard');
        } else {
            res.redirect('/dashboard');
        }

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred during login. Please try again."
        });
    }
};

module.exports = {
    registerUser,
    loginUser
};
