const express = require('express');

const path = require('path');

const app = express();

const userRouter = require('./routes/userRouter');
const homeRouter = require('./routes/homeRouter');

app.use(express.static(path.join(__dirname, 'public')));

app.use(userRouter);

app.use(homeRouter);

app.listen(4000);
