const mongoose = require('mongoose');

const dogReportSchema = new mongoose.Schema({
    dogName: {
        type: String,
        trim: true
    },
    photo: {
        type: String
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    condition: {
        type: String,
        required: true,
        enum: ["healthy", "injured", "sick", "critical", "unknown"]
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    reportedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ["reported", "rescued", "under_treatment", "adopted", "closed"],
        default: "reported"
    },
    assignedVolunteer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },
    isAvailableForAdoption: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true // Automatically manages createdAt and updatedAt
});

module.exports = mongoose.model('DogReport', dogReportSchema);
