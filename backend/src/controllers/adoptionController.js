const mongoose = require('mongoose');
const DogReport = require('../models/DogReport');
const Adoption = require('../models/Adoption');

// GET /adoption — List all dogs available for adoption
const getAvailableDogs = async (req, res) => {
    try {
        const dogs = await DogReport.find({ isAvailableForAdoption: true })
            .sort({ createdAt: -1 });

        res.render('adoption-list', {
            dogs,
            userName: req.session.userName,
            role: req.session.role
        });
    } catch (error) {
        console.error('Error fetching available dogs:', error);
        res.status(500).send('An error occurred while loading available dogs.');
    }
};

// GET /adoption/:id — Adoption details for one dog
const getAdoptionDetails = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send('Invalid Dog Report ID.');
        }

        const report = await DogReport.findById(id);

        if (!report) {
            return res.status(404).send('Dog report not found.');
        }

        if (!report.isAvailableForAdoption) {
            return res.redirect('/adoption');
        }

        res.render('adoption-details', {
            report,
            userName: req.session.userName,
            role: req.session.role
        });
    } catch (error) {
        console.error('Error fetching adoption details:', error);
        res.status(500).send('An error occurred while loading the dog details.');
    }
};

// GET /adoption/:id/apply — Render adoption application form
const renderAdoptionForm = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send('Invalid Dog Report ID.');
        }

        const report = await DogReport.findById(id);

        if (!report) {
            return res.status(404).send('Dog report not found.');
        }

        if (!report.isAvailableForAdoption) {
            return res.redirect('/adoption');
        }

        // Check if user already has a pending application for this dog
        const existingApplication = await Adoption.findOne({
            report: report._id,
            applicant: req.session.userId,
            status: 'pending'
        });

        res.render('adoption-apply', {
            report,
            existingApplication,
            userName: req.session.userName,
            role: req.session.role,
            success: req.query.success,
            error: req.query.error
        });
    } catch (error) {
        console.error('Error rendering adoption form:', error);
        res.status(500).send('An error occurred while loading the application form.');
    }
};

// POST /adoption/:id/apply — Submit adoption application
const submitAdoptionApplication = async (req, res) => {
    try {
        const { id } = req.params;
        const applicantId = req.session.userId;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send('Invalid Dog Report ID.');
        }

        const report = await DogReport.findById(id);

        if (!report) {
            return res.status(404).send('Dog report not found.');
        }

        if (!report.isAvailableForAdoption) {
            return res.status(400).send('This dog is not currently available for adoption.');
        }

        // Prevent duplicate pending applications
        const existingApplication = await Adoption.findOne({
            report: report._id,
            applicant: applicantId,
            status: 'pending'
        });

        if (existingApplication) {
            return res.redirect(`/adoption/${id}/apply?error=duplicate`);
        }

        const { fullName, phone, address, reason } = req.body;

        if (!fullName || !phone || !address || !reason) {
            return res.redirect(`/adoption/${id}/apply?error=missing-fields`);
        }

        if (reason.trim().length < 10 || reason.trim().length > 1000) {
            return res.redirect(`/adoption/${id}/apply?error=invalid-reason`);
        }

        const adoption = new Adoption({
            report: report._id,
            applicant: applicantId,
            fullName: fullName.trim(),
            phone: phone.trim(),
            address: address.trim(),
            reason: reason.trim(),
            status: 'pending'
        });

        await adoption.save();
        res.redirect('/my-adoptions?success=applied');

    } catch (error) {
        console.error('Error submitting adoption application:', error);
        res.status(500).send('An error occurred while submitting your application.');
    }
};

// GET /my-adoptions — View own adoption applications
const getMyAdoptions = async (req, res) => {
    try {
        const adoptions = await Adoption.find({ applicant: req.session.userId })
            .populate('report', 'dogName photo location condition')
            .sort({ createdAt: -1 });

        res.render('my-adoptions', {
            adoptions,
            userName: req.session.userName,
            role: req.session.role,
            success: req.query.success
        });
    } catch (error) {
        console.error('Error fetching my adoptions:', error);
        res.status(500).send('An error occurred while loading your applications.');
    }
};

module.exports = {
    getAvailableDogs,
    getAdoptionDetails,
    renderAdoptionForm,
    submitAdoptionApplication,
    getMyAdoptions
};
