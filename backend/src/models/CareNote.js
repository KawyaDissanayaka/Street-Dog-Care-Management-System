const mongoose = require('mongoose');

const careNoteSchema = new mongoose.Schema({
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
    note: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 1000
    }
}, { timestamps: true });

const CareNote = mongoose.model('CareNote', careNoteSchema);

module.exports = CareNote;
