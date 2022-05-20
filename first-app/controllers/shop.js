const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
  Product.fetchAll((products) =>
    res.render('shop/product-list', {
      prods: products,
      docTitle: 'All Products',
      path: '/products',
    })
  );
};

exports.getProductById = (req, res, next) => {
  const productId = req.params.id;
  Product.findById(productId, (product) => {
    res.render('shop/product-detail', {
      product,
      docTitle: `detail page`,
      path: '/products',
    });
  });
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll((products) =>
    res.render('shop/index', {
      prods: products,
      docTitle: 'Shop',
      path: '/',
    })
  );
};

exports.getCart = (req, res, next) => {
  res.render('shop/cart', {
    path: '/cart',
    docTitle: 'Your Cart!',
  });
};

exports.postCart = (req, res, next) => {
  const productId = req.body.productId;
  Product.findById(productId, (product) => {
    Cart.addProduct(productId, product.price);
  });
  res.redirect('/cart');
};

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    path: '/orders',
    docTitle: 'Your Orders!',
  });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    docTitle: 'Checkout',
  });
};
