const express = require('express');
const router = express.Router();
const { requireAdmin } = require('../middleware/authMiddleware');
const { getAdminDashboard, getAllDogReports, updateDogReportStatus } = require('../controllers/adminController');

// Admin Dashboard
// GET /admin/dashboard
router.get("/admin/dashboard", requireAdmin, getAdminDashboard);

// All Dog Reports
// GET /admin/reports
router.get("/admin/reports", requireAdmin, getAllDogReports);

// Update Dog Report Status
// POST /admin/reports/:id/status
router.post("/admin/reports/:id/status", requireAdmin, updateDogReportStatus);

module.exports = router;
