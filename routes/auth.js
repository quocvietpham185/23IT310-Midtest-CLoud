const express = require('express');
const router = express.Router();
const { ADMIN_USERNAME, ADMIN_PASSWORD } = require('../config/env');

router.get('/login', (req, res) => {
  res.render('auth/login', { error: null });
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    req.session.isLoggedIn = true;
    req.session.username = username;
    return res.redirect('/books/add');
  }
  res.render('auth/login', { error: 'Sai tai khoan hoac mat khau' });
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/login'));
});

module.exports = router;
