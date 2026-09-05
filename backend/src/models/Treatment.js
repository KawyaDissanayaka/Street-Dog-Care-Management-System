const mongoose = require('mongoose');

const treatmentSchema = new mongoose.Schema({
    report: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "DogReport",
        required: true
    },
    volunteer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    treatmentType: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    description: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 1000
    },
    treatmentDate: {
        type: Date,
        required: true
    },
    vetName: {
        type: String,
        trim: true,
        maxlength: 150,
        default: ""
    },
    clinicName: {
        type: String,
        trim: true,
        maxlength: 200,
        default: ""
    },
    notes: {
        type: String,
        trim: true,
        maxlength: 1000,
        default: ""
    }
}, { timestamps: true });

const Treatment = mongoose.model('Treatment', treatmentSchema);

module.exports = Treatment;
