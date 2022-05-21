const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    docTitle: 'Add Product',
    path: '/admin/add-product',
    editting: false,
  });
};

exports.postAddProduct = (req, res, next) => {
  const {
    body: { title, imageUrl, description, price },
  } = req;
  req.user
    .createProduct({
      title,
      imageUrl,
      description,
      price,
    })
    .then((result) => res.redirect('/admin/products'))
    .catch((error) => console.log(error));
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;

  if (!editMode) {
    return res.redirect('/');
  }

  const productId = req.params.id;

  req.user
    .getProducts({ where: { id: productId } })
    // Product.findByPk(productId)
    .then((products) => {
      const product = products[0];
      if (!product) {
        return res.redirect('/');
      }
      res.render('admin/edit-product', {
        product,
        docTitle: 'Edit Product',
        path: '/admin/edit-product',
        editting: editMode,
      });
    })
    .catch((error) => console.log(error));
};

exports.postEditProduct = (req, res, next) => {
  const {
    body: { id, title, imageUrl, description, price },
  } = req;

  Product.findByPk(id)
    .then((product) => {
      product.title = title;
      product.imageUrl = imageUrl;
      product.description = description;
      product.price = price;
      return product.save();
    })
    .then((result) => {
      console.log('Updated Product!');
      res.redirect('/admin/products');
    })
    .catch((error) => console.log(error));
};

exports.postDeleteProduct = (req, res, next) => {
  const {
    body: { id },
  } = req;

  Product.findByPk(id)
    .then((product) => product.destroy())
    .then((result) => {
      console.log('Deleted Product!');
      res.redirect('/admin/products');
    })
    .catch((error) => console.log(error));
};

exports.getProducts = (req, res, next) => {
  req.user
    .getProducts()
    // Product.findAll()
    .then((products) => {
      res.render('admin/products', {
        prods: products,
        docTitle: 'Admin Products',
        path: '/admin/products',
      });
    })
    .catch((error) => console.log(error));
};
