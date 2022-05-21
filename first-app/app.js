const express = require('express');
const bodyParser = require('body-parser');
// const expressHbs = require('express-handlebars');

const path = require('path');

const sequelize = require('./util/database');

const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');

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

// 유저 로그인 대체
app.use((req, res, next) => {
  User.findByPk(1)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((error) => console.log(error));
});

app.use('/admin', adminRouter.router);
app.use(shopRouter);

app.use(errorController.get404);

// 데이터 베이스 내 테이블의 관계를 정의한다.
Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });

// run when npm starts!
sequelize
  .sync()
  .then((result) => {
    return User.findByPk(1);
  })
  .then((user) => {
    if (!user) {
      User.create({
        name: 'Alex',
        email: 'test@test.com',
      });
    }
    return user;
  })
  .then((user) => {
    return user.createCart();
  })
  .then((cart) => {
    app.listen(5002);
  })
  .catch((error) => console.log(error));
