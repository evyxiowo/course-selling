
const {Router} = require('express');
const bcrypt = require('bcrypt');
const { User, Purchase, Course } = require('../database');
const authenticateUser = require('../middleware/user');
const userRouter = Router();



// POST /purchases - Make a purchase for a course (requires authentication)
userRouter.post('/purchases', authenticateUser, async function(req, res) {
    const { courseId } = req.body;
    const userId = req.user.id; // userId comes from the authenticated JWT token

    try {
        // Check if the user and course exist
        const user = await User.findById(userId);
        const course = await Course.findById(courseId);

        if (!user || !course) {
            return res.status(404).json({ message: 'User or course not found' });
        }

        // Create and save the purchase
        const newPurchase = new Purchase({
            user: userId,
            course: courseId,
            purchaseDate: new Date(),
            purchaseStatus: 'completed'
        });

        await newPurchase.save();
        res.json({ message: 'Purchase made successfully', purchase: newPurchase });
    } catch (error) {
        res.status(500).json({ message: 'Error making purchase', error });
    }
});


module.exports = { userRouter };  // Exporting as an object
