const mongoose = require('mongoose');

const dogSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    age: {
        type: String, // String used because age might be "6 months", "2 years"
        required: true
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Unknown'],
        default: 'Unknown'
    },
    location: {
        type: String,
        required: true
    },
    healthStatus: {
        type: String,
        enum: ['Healthy', 'Sick', 'Injured', 'Recovering'],
        default: 'Healthy'
    },
    description: {
        type: String
    },
    imageUrl: {
        type: String,
        default: 'default-dog.png' // You can change this later when we add image upload
    }
}, {
    timestamps: true // Automatically adds createdAt and updatedAt fields
});

module.exports = mongoose.model('Dog', dogSchema);
