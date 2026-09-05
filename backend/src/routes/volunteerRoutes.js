const express = require('express');
const router = express.Router();
const { requireVolunteer } = require('../middleware/authMiddleware');
const { getVolunteerDashboard, getVolunteerReports, getVolunteerReportDetails, updateVolunteerReportStatus, getAssignedReports, createCareNote, createTreatment } = require('../controllers/volunteerController');

router.get("/volunteer/dashboard", requireVolunteer, getVolunteerDashboard);
router.get("/volunteer/assigned-reports", requireVolunteer, getAssignedReports);
router.get("/volunteer/reports", requireVolunteer, getVolunteerReports);
router.get("/volunteer/reports/:id", requireVolunteer, getVolunteerReportDetails);
router.post("/volunteer/reports/:id/status", requireVolunteer, updateVolunteerReportStatus);
router.post("/volunteer/reports/:id/care-notes", requireVolunteer, createCareNote);
router.post("/volunteer/reports/:id/treatments", requireVolunteer, createTreatment);

module.exports = router;
