const express = require('express');
const router = express.Router();
const { BookRead, BookWrite } = require('../models/Book');
const { CODE_PREFIX, VAT_RATE } = require('../config/env');
const requireLogin = require('../middleware/auth');

// Luong DOC: chi dung BookRead (tai khoan read-only)
router.get('/', async (req, res) => {
  try {
    const books = await BookRead.find().sort({ createdAt: -1 }).lean();
    res.render('books/index', { books });
  } catch (err) {
    res.status(500).render('books/index', { books: [], error: err.message });
  }
});

router.get('/add', requireLogin, (req, res) => {
  res.render('books/add', { codePrefix: CODE_PREFIX, vatRate: VAT_RATE, error: null });
});

// Luong GHI: chi dung BookWrite (tai khoan readWrite), yeu cau da dang nhap
router.post('/add', requireLogin, async (req, res) => {
  const { code, title, author, price } = req.body;

  if (!code || !code.startsWith(CODE_PREFIX)) {
    return res.status(400).render('books/add', {
      codePrefix: CODE_PREFIX,
      vatRate: VAT_RATE,
      error: `Mã sản phẩm phải bắt đầu bằng "${CODE_PREFIX}"`,
    });
  }

  const priceNumber = Number(price);
  const priceAfterTax = Math.round(priceNumber * (1 + VAT_RATE / 100));

  try {
    await BookWrite.create({
      code,
      title,
      author,
      price: priceNumber,
      vatRate: VAT_RATE,
      priceAfterTax,
    });
    res.redirect('/books');
  } catch (err) {
    res.status(400).render('books/add', {
      codePrefix: CODE_PREFIX,
      vatRate: VAT_RATE,
      error: err.code === 11000 ? 'Mã sản phẩm đã tồn tại' : err.message,
    });
  }
});

module.exports = router;
