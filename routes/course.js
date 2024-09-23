const { Router } = require("express");
const { z } = require("zod"); // Zod for validation
const { authenticateUser } = require("../middleware/user");
const { purchaseModel, courseModel } = require("../database");

const courseRouter = Router();

// Zod schema for purchase validation
const purchaseSchema = z.object({
    courseId: z.string()
});

// Purchase a Course (User Only)
courseRouter.post("/purchase", authenticateUser, async function(req, res) {
    try {
        const userId = req.userId;
        const { courseId } = purchaseSchema.parse(req.body);

        // TODO: Add payment verification logic here (e.g., check if the user has paid)
        const course = await courseModel.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        await purchaseModel.create({ user: userId, course: courseId });

        res.status(201).json({
            message: "You have successfully purchased the course"
        });
    } catch (error) {
        res.status(400).json({
            message: "Error purchasing the course",
            error: error.message
        });
    }
});

// Get Course Previews (Public)
courseRouter.get("/preview", async function(req, res) {
    try {
        const courses = await courseModel.find({});

        res.status(200).json({ courses });
    } catch (error) {
        res.status(500).json({
            message: "Error fetching courses",
            error: error.message
        });
    }
});

module.exports = { courseRouter };
