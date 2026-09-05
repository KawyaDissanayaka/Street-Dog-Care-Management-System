const mongoose = require('mongoose');
const DogReport = require('../models/DogReport');
const CareNote = require('../models/CareNote');
const Treatment = require('../models/Treatment');
const Adoption = require('../models/Adoption');

const getAdminDashboard = async (req, res) => {
    try {
        // Calculate overall statistics
        const totalReports = await DogReport.countDocuments();
        const reported = await DogReport.countDocuments({ status: "reported" });
        const rescued = await DogReport.countDocuments({ status: "rescued" });
        const underTreatment = await DogReport.countDocuments({ status: "under_treatment" });
        const adopted = await DogReport.countDocuments({ status: "adopted" });
        const critical = await DogReport.countDocuments({ condition: "critical" });

        const stats = {
            totalReports,
            reported,
            rescued,
            underTreatment,
            adopted,
            critical
        };

        // Retrieve latest 5 reports, populate reportedBy to get the user's name and email
        const recentReports = await DogReport.find()
            .populate("reportedBy", "name email")
            .sort({ createdAt: -1 })
            .limit(5);

        res.render("admin-dashboard", {
            stats,
            recentReports
        });

    } catch (error) {
        console.error("Admin dashboard error:", error);
        res.status(500).send("Unable to load the admin dashboard.");
    }
};

const getAllDogReports = async (req, res) => {
    try {
        const reports = await DogReport.find()
            .populate("reportedBy", "name email")
            .sort({ createdAt: -1 });

        res.render("admin-reports", {
            reports,
            success: req.query.success,
            error: req.query.error
        });
    } catch (error) {
        console.error("Admin reports error:", error);
        res.status(500).send("Unable to load all dog reports.");
    }
};

const updateDogReportStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, source } = req.body;

        // 1. Validate MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send("Bad Request: Invalid report ID.");
        }

        // 2. Validate status against whitelist
        const allowedStatuses = ["reported", "rescued", "under_treatment", "adopted", "closed"];
        if (!allowedStatuses.includes(status)) {
            return res.status(400).send("Bad Request: Invalid status value.");
        }

        // 3. Find and update only the status field
        const updatedReport = await DogReport.findByIdAndUpdate(
            id,
            { status },
            { new: true, runValidators: true }
        );

        if (!updatedReport) {
            return res.status(404).send("Not Found: Dog report does not exist.");
        }

        // 4. Redirect with success message
        if (source === 'details') {
            res.redirect(`/admin/reports/${id}?success=status-updated`);
        } else {
            res.redirect('/admin/reports?success=status-updated');
        }

    } catch (error) {
        console.error("Error updating dog report status:", error);
        res.status(500).send("Internal Server Error: Unable to update report status.");
    }
};

const getDogReportDetails = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send("Bad Request: Invalid report ID.");
        }

        const report = await DogReport.findById(id)
            .populate("reportedBy", "name email phone address")
            .populate("assignedVolunteer", "name email phone");

        if (!report) {
            // Render a simple 404 with back button
            return res.status(404).send(`
                <html>
                <head><title>Not Found</title></head>
                <body style="font-family: sans-serif; text-align: center; padding: 50px;">
                    <h2>Dog report not found.</h2>
                    <a href="/admin/reports" style="display: inline-block; margin-top: 20px; padding: 10px 20px; background: #d35400; color: white; text-decoration: none; border-radius: 5px;">Back to Dog Reports</a>
                </body>
                </html>
            `);
        }

        // Fetch active volunteers
        const User = require('../models/User');
        const volunteers = await User.find({
            role: "volunteer",
            isActive: true
        }).select("name email phone");

        // Fetch Care Notes
        const careNotes = await CareNote.find({ report: report._id })
            .populate("volunteer", "name email")
            .sort({ createdAt: -1 });

        // Fetch Treatments
        const treatments = await Treatment.find({ report: report._id })
            .populate("volunteer", "name email")
            .sort({ treatmentDate: -1 });

        res.render("admin-report-details", {
            report,
            volunteers,
            careNotes,
            treatments,
            success: req.query.success,
            error: req.query.error
        });

    } catch (error) {
        console.error("Error loading dog report details:", error);
        res.status(500).send("Internal Server Error: Unable to load report details.");
    }
};

const assignVolunteerToReport = async (req, res) => {
    try {
        const { id } = req.params;
        const { volunteerId } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(volunteerId)) {
            return res.redirect(`/admin/reports/${id}?error=invalid-id`);
        }

        const User = require('../models/User');
        const volunteer = await User.findOne({
            _id: volunteerId,
            role: "volunteer",
            isActive: true
        });

        if (!volunteer) {
            return res.redirect(`/admin/reports/${id}?error=invalid-volunteer`);
        }

        const report = await DogReport.findById(id);
        if (!report) {
            return res.redirect(`/admin/reports?error=not-found`);
        }

        report.assignedVolunteer = volunteer._id;
        await report.save();

        res.redirect(`/admin/reports/${id}?success=volunteer-assigned`);
    } catch (error) {
        console.error("Error assigning volunteer:", error);
        res.redirect(`/admin/reports/${req.params.id}?error=assignment-failed`);
    }
};

const getVolunteers = async (req, res) => {
    try {
        const User = require('../models/User');
        const volunteers = await User.find({
            role: "volunteer",
            isActive: true
        }).select("name email phone");
        res.json({ success: true, volunteers });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error loading volunteers." });
    }
};

// POST /admin/reports/:id/adoption-availability
const updateAdoptionAvailability = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send('Invalid Report ID.');
        }

        const report = await DogReport.findById(id);
        if (!report) {
            return res.status(404).send('Report not found.');
        }

        const { isAvailableForAdoption } = req.body;
        // Checkbox: present = true, absent = false
        report.isAvailableForAdoption = isAvailableForAdoption === 'true' || isAvailableForAdoption === 'on';
        await report.save();

        res.redirect(`/admin/reports/${id}?success=adoption-availability-updated`);
    } catch (error) {
        console.error('Error updating adoption availability:', error);
        res.redirect(`/admin/reports/${req.params.id}?error=update-failed`);
    }
};

// GET /admin/adoptions
const getAllAdoptionRequests = async (req, res) => {
    try {
        const adoptions = await Adoption.find()
            .populate('report', 'dogName photo location condition status')
            .populate('applicant', 'name email phone address')
            .sort({ createdAt: -1 });

        res.render('admin-adoptions', {
            adoptions,
            userName: req.session.userName,
            success: req.query.success,
            error: req.query.error
        });
    } catch (error) {
        console.error('Error fetching adoption requests:', error);
        res.status(500).send('An error occurred while loading adoption requests.');
    }
};

// POST /admin/adoptions/:id/status
const updateAdoptionStatus = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send('Invalid Adoption ID.');
        }

        const { status } = req.body;
        const allowedStatuses = ['pending', 'approved', 'rejected'];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).send('Invalid status value.');
        }

        const adoption = await Adoption.findById(id);
        if (!adoption) {
            return res.status(404).send('Adoption application not found.');
        }

        adoption.status = status;
        await adoption.save();

        res.redirect(`/admin/adoptions?success=status-updated`);
    } catch (error) {
        console.error('Error updating adoption status:', error);
        res.redirect(`/admin/adoptions?error=update-failed`);
    }
};

module.exports = {
    getAdminDashboard,
    getAllDogReports,
    updateDogReportStatus,
    getDogReportDetails,
    assignVolunteerToReport,
    getVolunteers,
    updateAdoptionAvailability,
    getAllAdoptionRequests,
    updateAdoptionStatus
};
