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

  const product = new Product(null, title, imageUrl, description, price);
  product.save();
  res.redirect('/');
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;

  if (!editMode) {
    return res.redirect('/');
  }

  const productId = req.params.id;

  Product.findById(productId, (product) => {
    if (!product) {
      return res.redirect('/');
    }
    res.render('admin/edit-product', {
      product,
      docTitle: 'Edit Product',
      path: '/admin/edit-product',
      editting: editMode,
    });
  });
};

exports.postEditProduct = (req, res, next) => {
  const {
    body: { id, title, imageUrl, description, price },
  } = req;

  const updatedProduct = new Product(id, title, imageUrl, description, price);

  updatedProduct.save();
  res.redirect('/admin/products');
};

exports.postDeleteProduct = (req, res, next) => {
  const {
    body: { id },
  } = req;

  Product.delete(id);
  res.redirect('/admin/products');
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll((products) =>
    res.render('admin/products', {
      prods: products,
      docTitle: 'Admin Products',
      path: '/admin/products',
    })
  );
};
