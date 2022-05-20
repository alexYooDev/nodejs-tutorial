const express = require('express');

const path = require('path');

const router = express.Router();

const rootDir = require('../util/path');

const adminData = require('./admin');

router.get('/', (req, res, next) => {
  const { products } = adminData;
  res.render('shop', { prods: products, docTitle: 'Shop', path: '/' });
});

module.exports = router;
