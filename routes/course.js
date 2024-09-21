const {Router} = require('express');
const courseRouter = Router();
courseRouter.post('/purchase', (req, res) => {
    res.json({
        courseId: req.body.courseId,
        purchaseDate: new Date()
    });
});

courseRouter.get('/preview', (req, res) => {
    res.json({
        courseId: req.query.courseId,
        title: 'Sample Course',
        description: 'This is a sample course for demonstration purposes.',
        price: 19.99,
        image: 'https://example.com/course-image.jpg'
    });
});


module.exports = {
    courseRouter: courseRouter
}