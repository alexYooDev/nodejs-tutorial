const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.render('shop/product-list', {
        prods: products,
        docTitle: 'Shop',
        path: '/products-list',
      });
    })
    .catch((error) => console.log(error));
};

exports.getProductById = (req, res, next) => {
  const productId = req.params.id;
  // Product.findAll({ where: { id: productId } })
  //   .then((product) => {
  //     res.render('shop/product-detail', {
  //       product: product[0],
  //       docTitle: 'detail page' + product[0].title,
  //       path: '/products',
  //     });
  //   })
  //   .catch((error) => console.log(error));
  Product.findByPk(productId)
    .then((product) => {
      res.render('shop/product-detail', {
        product,
        docTitle: 'detail page',
        path: '/products',
      });
    })
    .catch((error) => console.log(error));
};

exports.getIndex = (req, res, next) => {
  Product.findAll()
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
  req.user
    .getCart()
    .then((cart) => {
      return cart
        .getProducts()
        .then((products) => {
          res.render('shop/cart', {
            path: '/cart',
            docTitle: 'Your Cart!',
            products: products,
          });
        })
        .catch((error) => console.log(error));
    })
    .catch((error) => console.log(error));
};

exports.postCart = (req, res, next) => {
  const productId = req.body.productId;
  let fetchedCart;
  let newQuantity = 1;
  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart
        .getProducts({ where: { id: productId } })
        .then((products) => {
          let product;
          if (products.length > 0) {
            product = products[0];
          }
          if (product) {
            const prevQuantity = product.cartItem.quantity;
            newQuantity = prevQuantity + 1;
            return product;
          }
          return Product.findByPk(productId);
        })
        .then((product) => {
          return fetchedCart.addProduct(product, {
            through: { quantity: newQuantity },
          });
        })
        .catch((error) => console.log(error));
    })
    .then(() => {
      res.redirect('/cart');
    })
    .catch((error) => console.log(error));
};

exports.postCartDeleteProduct = (req, res, next) => {
  const productId = req.body.productId;
  req.user
    .getCart()
    .then((cart) => {
      return cart
        .getProducts({ where: { id: productId } })
        .then((product) => {
          return product[0].cartItem.destroy();
        })
        .then((result) => {
          res.redirect('/cart');
        });
    })
    .catch((error) => console.log(error));
  // Product.findById(productId, (product) => {
  //   Cart.deleteProduct(productId, product.price);
  // });
};

exports.getOrders = (req, res, next) => {
  req.user
    .getOrders({ include: ['products'] })
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
  let fetchedCart;
  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts();
    })
    .then((products) => {
      return req.user
        .createOrder()
        .then((order) => {
          return order.addProducts(
            products.map((product) => {
              product.orderItem = { quantity: product.cartItem.quantity };
              return product;
            })
          );
        })
        .then((result) => {
          return fetchedCart.setProducts(null);
        })
        .then((result) => {
          res.redirect('/orders');
        })
        .catch((error) => console.log(error));
    })
    .catch((error) => console.log(error));
};

// exports.getCheckout = (req, res, next) => {
//   res.render('shop/checkout', {
//     path: '/checkout',
//     docTitle: 'Checkout',
//   });
// };
