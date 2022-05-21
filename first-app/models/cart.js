const fs = require('fs');
const path = require('path');

const targetPath = path.join(
  path.dirname(require.main.filename),
  'data',
  'cart.json'
);

module.exports = class Cart {
  static getCart(callback) {
    fs.readFile(targetPath, (err, data) => {
      const cart = JSON.parse(data);
      if (err) {
        callback(null);
      } else {
        callback(cart);
      }
    });
  }

  static addProduct(id, price) {
    fs.readFile(targetPath, (err, data) => {
      let cart = { products: [], totalPrice: 0 };
      if (!err) {
        cart = JSON.parse(data);
      }
      const existingProductIndex = cart.products.findIndex(
        (product) => product.id === id
      );
      const existingProduct = cart.products[existingProductIndex];
      let updatedProduct;
      if (existingProduct) {
        updatedProduct = { ...existingProduct };
        updatedProduct.quantity += 1;
        cart.products = [...cart.products];
        cart.products[existingProductIndex] = updatedProduct;
      } else {
        updatedProduct = { id, quantity: 1 };
        cart.products = [...cart.products, updatedProduct];
      }
      cart.totalPrice = cart.totalPrice + +price;
      fs.writeFile(targetPath, JSON.stringify(cart), (err) => {
        console.log(err);
      });
    });
  }
  static deleteProduct(id, productPrice) {
    fs.readFile(targetPath, (err, data) => {
      if (err) {
        return;
      }

      let cart = JSON.parse(data);
      const updatedCart = { ...cart };

      const product = updatedCart.products.find((product) => product.id === id);

      if (!product) {
        return;
      }

      const productQuantity = product.quantity;
      updatedCart.products = updatedCart.products.filter(
        (product) => product.id !== id
      );
      updatedCart.totalPrice -= productPrice * productQuantity;

      fs.writeFile(targetPath, JSON.stringify(updatedCart), (err) =>
        console.log(err)
      );
    });
  }
};
