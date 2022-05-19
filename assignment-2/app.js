const express = require('express');

const app = express();

app.use('/users', (req, res, next) => {
  console.log('this is users route!');
  res.send('<p>users route!</p>');
});

app.use('/', (req, res, next) => {
  console.log('this is a home route');
  res.send('<p>Home Route!</p>');
});

app.listen(3000);
