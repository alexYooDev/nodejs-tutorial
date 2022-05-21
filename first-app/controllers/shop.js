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
  Cart.getCart((cart) => {
    Product.fetchAll((products) => {
      const cartProducts = [];
      for (const product of products) {
        const cartProductData = cart.products.find(
          (prod) => prod.id === product.id
        );
        if (cartProductData) {
          cartProducts.push({
            productData: product,
            quantity: cartProductData.quantity,
          });
        }
      }
      res.render('shop/cart', {
        path: '/cart',
        docTitle: 'Your Cart!',
        products: cartProducts,
      });
    });
  });
};

exports.postCart = (req, res, next) => {
  const productId = req.body.productId;
  Product.findById(productId, (product) => {
    Cart.addProduct(productId, product.price);
  });
  res.redirect('/cart');
};

exports.postCartDeleteProduct = (req, res, next) => {
  const productId = req.body.productId;
  Product.findById(productId, (product) => {
    Cart.deleteProduct(productId, product.price);
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