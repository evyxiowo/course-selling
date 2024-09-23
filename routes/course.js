const { Router } = require("express");
const { z } = require("zod"); // Zod for validation
const { authenticateUser } = require("../middleware/user");
const { Purchase, Course } = require("../database");

const courseRouter = Router();


// Purchase a Course (User Only)


// courseRouter.post("/purchase", authenticateUser, async function(req, res) {
//     console.log("Purchase Course Route hit");
    
//     try {
        
//         console.log("Validating purchase request");
//         const userId = req.userId;
//         console.log("User authenticated",userId);
//         const courseId = req.body.courseId;
//         console.log("Course id", courseId);
        
//         // TODO: Add payment verification logic here (e.g., check if the user has paid)
//         const course = await Course.findById(courseId);
//         console.log("Course found");
        
//         if (!course) {
//             return res.status(404).json({ message: "Course not found" });
//         }
//         console.log("Course purchase route completed");

//         await Purchase.create({ user: userId, course: courseId });
//         console.log("Purchase created");

//         res.status(201).json({
//             message: "You have successfully purchased the course"
//         });
        
        
//     } catch (error) {
//         res.status(400).json({
//             message: "Error purchasing the course",
//             error: error.message
//         });
//     }
// });

courseRouter.post("/purchase", authenticateUser, async function(req, res) {
    const { userId } = req;
    const { courseId, paymentDetails } = req.body;

    try {
        // Check if the user has already purchased the course
        const existingPurchase = await Purchase.findOne({
            where: { userId, courseId }
        });

        if (existingPurchase) {
            return res.status(400).json({
                message: "You have already purchased this course."
            });
        }

        // Mock function to verify the payment details
        const isPaymentValid = await validatePayment(paymentDetails);
        if (!isPaymentValid) {
            return res.status(400).json({
                message: "Payment verification failed. Please try again."
            });
        }

        // Create the purchase record
        await Purchase.create({ userId, courseId });

        return res.json({
            message: "You have successfully purchased the course."
        });
    } catch (error) {
        console.error("Error during course purchase:", error);
        return res.status(500).json({
            message: "An error occurred while processing your purchase."
        });
    }
});

// Mock payment validation function
async function validatePayment(paymentDetails) {
    // Here you would call the payment gateway API or logic
    // For now, we assume the payment is valid
    return true;
}

// Get Course Previews (Public)
courseRouter.get("/preview", async function(req, res) {
    try {
        const courses = await Course.find({});

        res.status(200).json({ courses });
    } catch (error) {
        res.status(500).json({
            message: "Error fetching courses",
            error: error.message
        });
    }
});

module.exports = { courseRouter };
