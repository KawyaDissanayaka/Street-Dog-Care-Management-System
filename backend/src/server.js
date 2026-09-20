require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const dogReportRoutes = require('./routes/dogReportRoutes');

const adminRoutes = require('./routes/adminRoutes');
const volunteerRoutes = require('./routes/volunteerRoutes');
const adoptionRoutes = require('./routes/adoptionRoutes');
const dogRoutes = require('./routes/dogRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Set View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const session = require('express-session');
const { MongoStore } = require('connect-mongo');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use("/uploads", express.static(path.join(__dirname, '../uploads')));

// Session Configuration
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
        collectionName: 'sessions'
    }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 // 1 day
    }
}));

// Routes
app.use("/", authRoutes);
app.use("/", dogReportRoutes);
app.use("/", adminRoutes);
app.use("/", volunteerRoutes);
app.use("/", adoptionRoutes);
app.use("/", dogRoutes);

app.get('/', (req, res) => {
    res.render('index', { title: 'Street Dog Care System' });
});

// Connect to MongoDB
connectDB();

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
