const Dog = require('../models/Dog');

const getDogs = async (req, res) => {
    try {
        const dogs = await Dog.find().sort({ createdAt: -1 });
        res.render('dog-list', { dogs, user: req.session.user || { role: 'admin' } }); // Adjust user role based on session
    } catch (error) {
        console.error("Error fetching dogs:", error);
        res.status(500).send("Unable to load dogs.");
    }
};

const getAddDogForm = (req, res) => {
    res.render('dog-add', { user: req.session.user || { role: 'admin' }, error: null });
};

const addDog = async (req, res) => {
    try {
        const { name, age, gender, location, healthStatus, description } = req.body;

        if (!name || !age || !location) {
            return res.render('dog-add', { error: "Name, Age, and Location are required.", user: req.session.user || { role: 'admin' } });
        }

        const newDog = new Dog({
            name: name.trim(),
            age: age.trim(),
            gender: gender || 'Unknown',
            location: location.trim(),
            healthStatus: healthStatus || 'Healthy',
            description: description ? description.trim() : ''
        });

        await newDog.save();
        res.redirect('/dogs');
    } catch (error) {
        console.error("Error adding dog:", error);
        res.render('dog-add', { error: "Failed to add dog. Please try again.", user: req.session.user || { role: 'admin' } });
    }
};

const deleteDog = async (req, res) => {
    try {
        const { id } = req.params;
        await Dog.findByIdAndDelete(id);
        res.redirect('/dogs');
    } catch (error) {
        console.error("Error deleting dog:", error);
        res.status(500).send("Failed to delete dog.");
    }
};

module.exports = {
    getDogs,
    getAddDogForm,
    addDog,
    deleteDog
};
