const express = require('express');

const app = express();
const port = 3000;

app.use(express.json());

app.post('/user/signup', (req, res) => {});

app.post('user/signin', (req, res) => {});

app.post('/user/purchases', (req, res) => {});

app.post('/user/:userId', (req, res) => {});

app.post('/user/:userId/posts', (req, res) => {});

app.listen(port, () => {
   console.log( `Server is running on port ${port}`);
   })