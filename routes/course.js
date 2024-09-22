const { Router } = require('express');
const { Course, Purchase, User } = require('../database.js');  // Import models
const courseRouter = Router();

// POST /purchase - Make a course purchase
courseRouter.post('/purchase', async (req, res) => {
    const { userId, courseId } = req.body;

    try {
        // Check if the user and course exist
        const user = await User.findById(userId);
        const course = await Course.findById(courseId);
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        // Create a new purchase record
        const newPurchase = new Purchase({
            user: userId,
            course: courseId,
            purchaseDate: new Date(),
            purchaseStatus: 'completed' // Default to completed for now
        });

        // Save the purchase to the database
        await newPurchase.save();

        // Optionally, add the course to the user's enrolled courses
        user.coursesEnrolled.push(courseId);
        await user.save();

        res.json({
            message: 'Purchase successful',
            courseId,
            userId,
            purchaseDate: newPurchase.purchaseDate,
            status: newPurchase.purchaseStatus
        });
    } catch (error) {
        res.status(500).json({ message: "Error making purchase", error });
    }
});

// GET /preview - Preview a course
courseRouter.get('/preview', async (req, res) => {
    const { courseId } = req.query;

    try {
        // Fetch course details from the database
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        res.json({
            courseId: course._id,
            title: course.name,
            description: course.description,
            price: course.price,
            image: course.courseImage
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching course preview", error });
    }
});

module.exports = {
    courseRouter
};
