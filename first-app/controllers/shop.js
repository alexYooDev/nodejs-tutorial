const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then((products) => {
      res.render('shop/product-list', {
        prods: products,
        docTitle: 'Shop',
        path: '/products-list',
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

exports.getProductById = (req, res, next) => {
  const productId = req.params.id;
  Product.fetchById(productId)
    .then((product) => {
      res.render('shop/product-detail', {
        product: product,
        docTitle: 'detail page' + product.title,
        path: '/products',
      });
    })
    .catch((error) => {
      console.log(error);
    });
  // Product.findByPk(productId)
  //   .then((product) => {
  //     res.render('shop/product-detail', {
  //       product,
  //       docTitle: 'detail page',
  //       path: '/products',
  //     });
  //   })
  //   .catch((error) => console.log(error));
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll()
    .then((products) => {
      res.render('shop/index', {
        prods: products,
        docTitle: 'Shop',
        path: '/',
      });
    })
    .catch((error) => console.log(error));
};

exports.getCart = (req, res, next) => {
  req.user.getCart().then((products) => {
    res.render('shop/cart', {
      path: '/cart',
      docTitle: 'Your Cart!',
      products: products,
    });
  });
};

exports.postCart = (req, res, next) => {
  const productId = req.body.productId;
  Product.fetchById(productId)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then((result) => {
      res.redirect('/cart');
    });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const productId = req.body.productId;
  req.user.deleteFromCart(productId).then(() => {
    res.redirect('/cart');
  });
};

exports.getOrders = (req, res, next) => {
  req.user
    .getOrders()
    .then((orders) => {
      res.render('shop/orders', {
        path: '/orders',
        docTitle: 'Your Orders!',
        orders,
      });
    })
    .catch((error) => console.log(err));
};

exports.postOrder = (req, res, next) => {
  req.user
    .addOrder()
    .then(() => {
      res.redirect('/orders');
    })
    .catch((error) => console.log(error));
};

// exports.getCheckout = (req, res, next) => {
//   res.render('shop/checkout', {
//     path: '/checkout',
//     docTitle: 'Checkout',
//   });
// };
