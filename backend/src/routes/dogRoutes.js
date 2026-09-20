const express = require('express');
const router = express.Router();
const { getDogs, getAddDogForm, addDog, deleteDog } = require('../controllers/dogController');

// Basic auth check for admin routes
const requireAdmin = (req, res, next) => {
    if (req.session.userId) {
        next();
    } else {
        res.redirect('/login');
    }
};

router.get('/dogs', requireAdmin, getDogs);
router.get('/dogs/add', requireAdmin, getAddDogForm);
router.post('/dogs/add', requireAdmin, addDog);
router.post('/dogs/delete/:id', requireAdmin, deleteDog);

module.exports = router;
