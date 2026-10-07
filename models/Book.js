const mongoose = require('mongoose');
const { readConnection, writeConnection } = require('../config/db');

const bookSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  price: { type: Number, required: true },
  vatRate: { type: Number, required: true },
  priceAfterTax: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Cung mot schema nhung dang ky tren hai connection khac nhau,
// de dam bao luong Read va luong Write luon di dung tai khoan Atlas tuong ung.
const BookRead = readConnection.model('Book', bookSchema, 'books');
const BookWrite = writeConnection.model('Book', bookSchema, 'books');

module.exports = { BookRead, BookWrite };
