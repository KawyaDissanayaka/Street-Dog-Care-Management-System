const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/authMiddleware');
const { uploadDogPhoto } = require('../middleware/uploadMiddleware');
const { createDogReport, getMyReports } = require('../controllers/dogReportController');

// Render Report Dog Page
// GET /report-dog
router.get("/report-dog", requireAuth, (req, res) => {
    res.render("report-dog");
});

// Handle Dog Report Submission
// POST /report-dog
router.post("/report-dog", requireAuth, uploadDogPhoto, createDogReport);

// Render My Reports Page
// GET /my-reports
router.get("/my-reports", requireAuth, getMyReports);

module.exports = router;
