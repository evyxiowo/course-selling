
const {Router} = require('express');
const bcrypt = require('bcrypt');
const { Admin, Course } = require('../database');
const authenticateAdmin = require('../middleware/admin');
const adminRouter = Router();

// POST /course - Create a new course (Admin only)
adminRouter.post('/course', authenticateAdmin, async function(req, res) {
    const { name, description, price, instructor, duration, courseCategory, courseImage, courseVideo, courseMaterial } = req.body;

    try {
        // Create a new course
        const newCourse = new Course({
            name,
            description,
            price,
            instructor,
            duration,
            courseCategory,
            courseImage,
            courseVideo,
            courseMaterial
        });

        await newCourse.save();
        res.json({ message: `Course '${name}' created successfully`, course: newCourse });
    } catch (error) {
        res.status(500).json({ message: 'Error creating course', error });
    }
});

module.exports = { adminRouter };  // Exporting as an object
