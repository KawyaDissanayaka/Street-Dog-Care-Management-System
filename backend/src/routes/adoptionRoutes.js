const express = require('express');
const router = express.Router();
const { requireAuth, requireUser } = require('../middleware/authMiddleware');
const {
    getAvailableDogs,
    getAdoptionDetails,
    renderAdoptionForm,
    submitAdoptionApplication,
    getMyAdoptions
} = require('../controllers/adoptionController');

// Available dogs list (all authenticated users can view)
router.get("/adoption", requireAuth, getAvailableDogs);

// Dog adoption details (all authenticated users)
router.get("/adoption/:id", requireAuth, getAdoptionDetails);

// Adoption application form — normal users only
router.get("/adoption/:id/apply", requireUser, renderAdoptionForm);

// Submit adoption application — normal users only
router.post("/adoption/:id/apply", requireUser, submitAdoptionApplication);

// My adoption applications — normal users only
router.get("/my-adoptions", requireUser, getMyAdoptions);

module.exports = router;
