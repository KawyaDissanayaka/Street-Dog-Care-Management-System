const DogReport = require('../models/DogReport');

const createDogReport = async (req, res) => {
    try {
        // 1. Ensure user is authenticated
        const userId = req.session.userId;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: You must be logged in to report a dog."
            });
        }

        // 2. Extract values from the request body
        const { dogName, location, condition, description } = req.body;

        // 3. Validate required fields
        if (!location || !condition || !description) {
            return res.status(400).json({
                success: false,
                message: "Location, condition, and description are required fields."
            });
        }

        // 4. Handle uploaded photo (if it exists)
        let photoPath = "";
        if (req.file) {
            // Save just the filename or the relative path
            photoPath = req.file.filename;
        }

        // 5. Create a new DogReport document
        const newReport = new DogReport({
            dogName: dogName ? dogName.trim() : "",
            photo: photoPath,
            location: location.trim(),
            condition: condition,
            description: description.trim(),
            reportedBy: userId,
            status: "reported"
        });

        // 6. Save the report to MongoDB
        await newReport.save();

        // 7. Redirect the user to their reports page upon success
        res.redirect('/my-reports');

    } catch (error) {
        console.error("Error creating dog report:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while creating the report. Please try again."
        });
    }
};

const getMyReports = async (req, res) => {
    try {
        const reports = await DogReport.find({
            reportedBy: req.session.userId
        }).sort({ createdAt: -1 });

        res.render("my-reports", { reports });
    } catch (error) {
        console.error("Error fetching my reports:", error);
        res.status(500).send("Unable to load your reports.");
    }
};

module.exports = {
    createDogReport,
    getMyReports
};
