const {Router} = require('express');

const userRouter = Router();

userRouter.post('/signup', (req, res) => {
    res.json({message: 'User signed up successfully'});
});

userRouter.post('/signin', (req, res) => {
    res.json({message: 'User signed in successfully'});
});

userRouter.post('/purchases', (req, res) => {
    res.json({message: 'User made a purchase'});
});

    module.exports= {
        userRouter: userRouter
    }