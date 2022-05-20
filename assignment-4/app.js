const express = require('express')

const bodyParser = require('body-parser');

const app = express();

const homeData = require('./routes/homeRouter');
const userRouter = require('./routes/userRouter');

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));

app.use(homeData.router);
app.use(userRouter)

app.listen(3001);
