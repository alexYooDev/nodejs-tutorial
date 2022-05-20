const express = require('express');

const router = express.Router();

const homeData = require('./homeRouter');


router.get('/users', (req, res, next) => {
  res.render('users', {pageTitle: 'Users', users: homeData.users});
})

router.post('/add-users', (req, res, next) => {
  homeData.users.push({name: req.body.username});
  res.redirect('/users');
})

module.exports = router;