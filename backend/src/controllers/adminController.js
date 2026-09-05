const mongoose = require('mongoose');
const DogReport = require('../models/DogReport');

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
        const { status } = req.body;

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
        res.redirect('/admin/reports?success=status-updated');

    } catch (error) {
        console.error("Error updating dog report status:", error);
        res.status(500).send("Internal Server Error: Unable to update report status.");
    }
};

module.exports = {
    getAdminDashboard,
    getAllDogReports,
    updateDogReportStatus
};
