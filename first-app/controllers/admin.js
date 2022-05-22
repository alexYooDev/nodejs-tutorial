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
  const product = new Product(
    title,
    imageUrl,
    description,
    price,
    null,
    req.user._id
  );
  product
    .save()
    .then(() => {
      res.redirect('/admin/products');
    })
    .catch((error) => {
      console.log(error);
    });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;

  if (!editMode) {
    return res.redirect('/');
  }

  const productId = req.params.id;

  Product.fetchById(productId)
    .then((product) => {
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
    .catch((error) => {
      console.log(error);
    });
};

exports.postEditProduct = (req, res, next) => {
  const {
    body: { id, title, imageUrl, description, price },
  } = req;

  const product = new Product(title, imageUrl, description, price, id);
  product
    .save()
    .then((result) => {
      console.log('Updated Product!');
      res.redirect('/admin/products');
    })
    .catch((error) => {
      console.log(error);
    });
};

exports.postDeleteProduct = (req, res, next) => {
  const {
    body: { id },
  } = req;

  Product.deleteById(id)
    .then(() => {
      console.log('Deleted Product!');
      res.redirect('/admin/products');
    })
    .catch((error) => {
      console.log(error);
    });
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then((products) => {
      res.render('admin/products', {
        prods: products,
        docTitle: 'Admin Products',
        path: '/admin/products',
      });
    })
    .catch((error) => console.log(error));
};
