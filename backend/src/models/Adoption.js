const mongoose = require('mongoose');

const adoptionSchema = new mongoose.Schema(
    {
        report: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "DogReport",
            required: true
        },
        applicant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        fullName: {
            type: String,
            required: true,
            trim: true,
            maxlength: 150
        },
        phone: {
            type: String,
            required: true,
            trim: true,
            maxlength: 30
        },
        address: {
            type: String,
            required: true,
            trim: true,
            maxlength: 300
        },
        reason: {
            type: String,
            required: true,
            trim: true,
            minlength: 10,
            maxlength: 1000
        },
        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending"
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Adoption", adoptionSchema);
