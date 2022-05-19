const express = require('express');

const app = express();

//next를 호출해야 다음 미들웨어를 실행. 그렇지 않다면 미들웨어는 실행 종료한다.

app.use('/', (req, res, next) => {
  console.log('this always runs!');
  next();
});
app.use('/add-products', (req, res, next) => {
  console.log('products path');
  res.send('<h1>the add products page</h1>');
});

app.use('/', (req, res, next) => {
  console.log('In Another middleware!');
  res.send('<h1>hello from express!</h1>');
});

app.listen(5002);
