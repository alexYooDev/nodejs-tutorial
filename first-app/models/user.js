const getDb = require('../util/database').getDb;
const mongodb = require('mongodb');

class User {
  constructor(username, email, cart, id) {
    this.username = username;
    this.email = email;
    this.cart = cart; // nested object with items
    this._id = id;
  }

  save() {
    const db = getDb();
    return db.collection('users').insertOne(this);
  }

  getCart() {
    const db = getDb();
    const productIds = this.cart.items.map((item) => item.productId);
    return db
      .collection('products')
      .find({ _id: { $in: productIds } })
      .toArray()
      .then((products) => {
        return products.map((product) => {
          return {
            ...product,
            quantity: this.cart.items.find(
              (item) => item.productId.toString() === product._id.toString()
            ).quantity,
          };
        });
      });
  }

  addToCart(product) {
    const cartProductIndex = this.cart.items.findIndex((cp) => {
      return cp.productId.toString() === product._id.toString();
    });

    let newQuantity = 1;

    const updatedCartItems = [...this.cart.items];

    if (cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
      updatedCartItems.push({
        productId: new mongodb.ObjectId(product._id),
        quantity: newQuantity,
      });
    }
    const updatedCart = {
      items: updatedCartItems,
    };
    // const updatedCart = {
    //   items: [{ productId: new mongodb.ObjectId(product.id), quantity: 1 }],
    // };
    const db = getDb();
    return db
      .collection('users')
      .updateOne({ _id: this._id }, { $set: { cart: updatedCart } });
  }

  deleteFromCart(productId) {
    const db = getDb();

    const cartProductIndex = this.cart.items.findIndex(
      (item) => item.productId.toString() === productId.toString()
    );

    let filteredCartItems;

    if (cartProductIndex >= 0) {
      this.cart.items[cartProductIndex].quantity -= 1;
      filteredCartItems = this.cart.items;
    }

    if (
      cartProductIndex < 0 ||
      this.cart.items[cartProductIndex].quantity <= 0
    ) {
      filteredCartItems = this.cart.items.filter(
        (item) =>
          item.productId.toString() !==
          new mongodb.ObjectId(productId).toString()
      );
    }

    const updatedCart = {
      items: filteredCartItems,
    };
    return db
      .collection('users')
      .updateOne(
        { _id: new mongodb.ObjectId(this._id) },
        { $set: { cart: updatedCart } }
      );
  }

  addOrder() {
    const db = getDb();
    return this.getCart()
      .then((products) => {
        const order = {
          items: products,
          user: {
            _id: new mongodb.ObjectId(this._id),
            name: this.username,
          },
        };
        return db.collection('orders').insertOne(order);
      })
      .then((result) => {
        this.cart = { items: [] };
        return db
          .collection('users')
          .updateOne(
            { _id: new mongodb.ObjectId(this._id) },
            { $set: { cart: { items: [] } } }
          );
      });
  }

  getOrders() {
    const db = getDb();
    return db
      .collection('orders')
      .find({ 'user._id': new mongodb.ObjectId(this._id) })
      .toArray();
  }

  static findById(id) {
    const db = getDb();
    return db
      .collection('users')
      .findOne({ _id: new mongodb.ObjectId(id) })
      .then((user) => {
        return user;
      })
      .catch((error) => {
        console.log(error);
      });
  }
}

module.exports = User;
