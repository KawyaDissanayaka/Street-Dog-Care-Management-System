const mongoose = require('mongoose');
const User = require('../models/User');
const DogReport = require('../models/DogReport');
const CareNote = require('../models/CareNote');
const Treatment = require('../models/Treatment');

const getVolunteerDashboard = async (req, res) => {
    try {
        const userId = req.session.userId;
        
        const user = await User.findById(userId);
        
        if (!user) {
            return req.session.destroy(() => {
                res.redirect('/login');
            });
        }
        
        const totalReports = await DogReport.countDocuments();
        const reported = await DogReport.countDocuments({ status: "reported" });
        const rescued = await DogReport.countDocuments({ status: "rescued" });
        const underTreatment = await DogReport.countDocuments({ status: "under_treatment" });
        const critical = await DogReport.countDocuments({ condition: "critical" });
        const assignedReports = await DogReport.countDocuments({ assignedVolunteer: userId });
        
        const stats = {
            totalReports,
            reported,
            rescued,
            underTreatment,
            critical,
            assignedReports
        };
        
        const recentReports = await DogReport.find()
            .populate("reportedBy", "name")
            .sort({ createdAt: -1 })
            .limit(5);
            
        res.render('volunteer-dashboard', {
            user,
            stats,
            recentReports
        });
        
    } catch (error) {
        console.error("Volunteer dashboard error:", error);
        res.status(500).send("Unable to load the volunteer dashboard.");
    }
};

const getVolunteerReports = async (req, res) => {
    try {
        const reports = await DogReport.find()
            .populate("reportedBy", "name email")
            .sort({ createdAt: -1 });

        res.render("volunteer-reports", {
            reports
        });
    } catch (error) {
        console.error("Volunteer reports error:", error);
        res.status(500).send("Unable to load all dog reports.");
    }
};

const getAssignedReports = async (req, res) => {
    try {
        const reports = await DogReport.find({ assignedVolunteer: req.session.userId })
            .populate("reportedBy", "name email")
            .sort({ createdAt: -1 });

        res.render("volunteer-assigned-reports", {
            reports
        });
    } catch (error) {
        console.error("Assigned reports error:", error);
        res.status(500).send("Unable to load assigned dog reports.");
    }
};

const getVolunteerReportDetails = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send(`
                <html>
                <head><title>Bad Request</title></head>
                <body style="font-family: sans-serif; text-align: center; padding: 50px;">
                    <h2>Invalid Report ID.</h2>
                    <a href="/volunteer/reports" style="display: inline-block; margin-top: 20px; padding: 10px 20px; background: #1abc9c; color: white; text-decoration: none; border-radius: 5px;">Back to Dog Reports</a>
                </body>
                </html>
            `);
        }

        const report = await DogReport.findById(id)
            .populate("reportedBy", "name email phone address")
            .populate("assignedVolunteer", "name email phone");

        if (!report) {
            return res.status(404).send(`
                <html>
                <head><title>Not Found</title></head>
                <body style="font-family: sans-serif; text-align: center; padding: 50px;">
                    <h2>Dog report not found.</h2>
                    <a href="/volunteer/reports" style="display: inline-block; margin-top: 20px; padding: 10px 20px; background: #1abc9c; color: white; text-decoration: none; border-radius: 5px;">Back to Dog Reports</a>
                </body>
                </html>
            `);
        }

        const careNotes = await CareNote.find({ report: report._id })
            .populate("volunteer", "name email")
            .sort({ createdAt: -1 });

        const treatments = await Treatment.find({ report: report._id })
            .populate("volunteer", "name email")
            .sort({ treatmentDate: -1 });

        res.render("volunteer-report-details", {
            report,
            careNotes,
            treatments,
            success: req.query.success,
            error: req.query.error,
            userId: req.session.userId
        });

    } catch (error) {
        console.error("Error loading volunteer report details:", error);
        res.status(500).send("Internal Server Error: Unable to load report details.");
    }
};

const updateVolunteerReportStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send(`
                <html>
                <head><title>Bad Request</title></head>
                <body style="font-family: sans-serif; text-align: center; padding: 50px;">
                    <h2>Invalid Report ID.</h2>
                    <a href="/volunteer/reports" style="display: inline-block; margin-top: 20px; padding: 10px 20px; background: #1abc9c; color: white; text-decoration: none; border-radius: 5px;">Back to Dog Reports</a>
                </body>
                </html>
            `);
        }

        const allowedStatuses = ["reported", "rescued", "under_treatment", "adopted", "closed"];
        if (!allowedStatuses.includes(status)) {
            return res.redirect(`/volunteer/reports/${id}?error=invalid-status`);
        }

        const report = await DogReport.findById(id);
        if (!report) {
            return res.status(404).send(`
                <html>
                <head><title>Not Found</title></head>
                <body style="font-family: sans-serif; text-align: center; padding: 50px;">
                    <h2>Dog report not found.</h2>
                    <a href="/volunteer/reports" style="display: inline-block; margin-top: 20px; padding: 10px 20px; background: #1abc9c; color: white; text-decoration: none; border-radius: 5px;">Back to Dog Reports</a>
                </body>
                </html>
            `);
        }

        report.status = status;
        await report.save();

        res.redirect(`/volunteer/reports/${id}?success=status-updated`);
    } catch (error) {
        console.error("Error updating volunteer report status:", error);
        res.redirect(`/volunteer/reports/${req.params.id}?error=update-failed`);
    }
};

const createCareNote = async (req, res) => {
    try {
        const { id } = req.params;
        const volunteerId = req.session.userId;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send("Invalid Report ID");
        }

        const report = await DogReport.findById(id);
        if (!report) {
            return res.status(404).send("Report Not Found");
        }

        if (!report.assignedVolunteer || report.assignedVolunteer.toString() !== volunteerId.toString()) {
            return res.status(403).send("You are not assigned to this report.");
        }

        const { note } = req.body;
        if (!note || note.trim().length < 5 || note.trim().length > 1000) {
            return res.status(400).send("Care note must contain between 5 and 1000 characters.");
        }

        const careNote = new CareNote({
            report: report._id,
            volunteer: volunteerId,
            note: note.trim()
        });

        await careNote.save();
        res.redirect(`/volunteer/reports/${id}?success=note-added`);

    } catch (error) {
        console.error("Error creating care note:", error);
        res.status(500).send("An error occurred while adding the care note.");
    }
};

const createTreatment = async (req, res) => {
    try {
        const { id } = req.params;
        const volunteerId = req.session.userId;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send("Invalid Report ID");
        }

        const report = await DogReport.findById(id);
        if (!report) {
            return res.status(404).send("Report Not Found");
        }

        if (!report.assignedVolunteer || report.assignedVolunteer.toString() !== volunteerId.toString()) {
            return res.status(403).send("You are not assigned to this report.");
        }

        const { treatmentType, description, treatmentDate, vetName, clinicName, notes } = req.body;

        if (!treatmentType || !description || !treatmentDate) {
            return res.status(400).send("Treatment type, description, and treatment date are required.");
        }

        if (description.trim().length < 5 || description.trim().length > 1000) {
            return res.status(400).send("Description must be between 5 and 1000 characters.");
        }

        const treatment = new Treatment({
            report: report._id,
            volunteer: volunteerId,
            treatmentType: treatmentType.trim(),
            description: description.trim(),
            treatmentDate: new Date(treatmentDate),
            vetName: vetName ? vetName.trim() : "",
            clinicName: clinicName ? clinicName.trim() : "",
            notes: notes ? notes.trim() : ""
        });

        await treatment.save();
        res.redirect(`/volunteer/reports/${id}?success=treatment-added`);

    } catch (error) {
        console.error("Error creating treatment:", error);
        res.status(500).send("An error occurred while adding the treatment record.");
    }
};

module.exports = {
    getVolunteerDashboard,
    getVolunteerReports,
    getAssignedReports,
    getVolunteerReportDetails,
    updateVolunteerReportStatus,
    createCareNote,
    createTreatment
};
