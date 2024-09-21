const {Router} = require('express');

const userRouter = Router();

userRouter.post('/user/signup', (req, res) => {});

userRouter.post('user/signin', (req, res) => {});

userRouter.post('/user/purchases', (req, res) => {});

    module.exports= {
        userRouter: userRouter
    }