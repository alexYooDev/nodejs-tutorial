const express = require('express');
const bodyParser = require('body-parser');
// const expressHbs = require('express-handlebars');

const path = require('path');

const sequelize = require('./util/database');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRouter = require('./routes/admin');
const shopRouter = require('./routes/shop');

const errorController = require('./controllers/errors');

//next를 호출해야 다음 미들웨어를 실행. 그렇지 않다면 미들웨어는 실행 종료한다.

// 하단에 존재하는 모든 미들웨어에 대해 req 객체의 body 프로퍼티를 parsing 한다. 그 후 next를 실행한다.
app.use(bodyParser.urlencoded({ extended: false }));

// 정적으로 파일 시스템에 접근하여 css 연결
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRouter.router);
app.use(shopRouter);

app.use(errorController.get404);

sequelize
  .sync()
  .then((result) => {
    app.listen(5002);
  })
  .catch((error) => console.log(error));
