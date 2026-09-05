const express = require('express');
const router = express.Router();
const { requireAdmin } = require('../middleware/authMiddleware');
const {
    getAdminDashboard,
    getAllDogReports,
    updateDogReportStatus,
    getDogReportDetails,
    assignVolunteerToReport,
    getVolunteers,
    updateAdoptionAvailability,
    getAllAdoptionRequests,
    updateAdoptionStatus
} = require('../controllers/adminController');

// Admin Dashboard
router.get("/admin/dashboard", requireAdmin, getAdminDashboard);

// All Dog Reports
router.get("/admin/reports", requireAdmin, getAllDogReports);

// Dog Report Details
router.get("/admin/reports/:id", requireAdmin, getDogReportDetails);

// Update Dog Report Status
router.post("/admin/reports/:id/status", requireAdmin, updateDogReportStatus);

// Assign Volunteer
router.post("/admin/reports/:id/assign", requireAdmin, assignVolunteerToReport);

// Update Adoption Availability
router.post("/admin/reports/:id/adoption-availability", requireAdmin, updateAdoptionAvailability);

// Get Volunteers
router.get("/admin/volunteers", requireAdmin, getVolunteers);

// Admin Adoption Requests
router.get("/admin/adoptions", requireAdmin, getAllAdoptionRequests);

// Update Adoption Status
router.post("/admin/adoptions/:id/status", requireAdmin, updateAdoptionStatus);

module.exports = router;
