const mongoose = require('mongoose');
const { MONGO_URI_READ, MONGO_URI_WRITE } = require('./env');

// Hai ket noi doc lap toi hai tai khoan Atlas khac nhau (Least Privilege):
// readConnection  -> tai khoan chi co quyen "read"
// writeConnection -> tai khoan co quyen "readWrite" (dung cho ghi sach va luu session)
const readConnection = mongoose.createConnection(MONGO_URI_READ);
const writeConnection = mongoose.createConnection(MONGO_URI_WRITE);

readConnection.on('connected', () => console.log('[DB] Read connection (read-only user) connected'));
readConnection.on('error', (err) => console.error('[DB] Read connection error:', err.message));
readConnection.asPromise().catch((err) => console.error('[DB] Read connection initial error:', err.message));

writeConnection.on('connected', () => console.log('[DB] Write connection (read-write user) connected'));
writeConnection.on('error', (err) => console.error('[DB] Write connection error:', err.message));
writeConnection.asPromise().catch((err) => console.error('[DB] Write connection initial error:', err.message));

// mongodb+srv:// lam mot truy van DNS SRV truoc khi mo ket noi; neu DNS/mang
// gian doan tuc thoi luc boot, loi nay co the thoat ra ngoai 2 listener tren
// duoi dang unhandled rejection va lam crash toan bo server. Chan lai de
// server van song, cac route se tu bao loi khi query that bai (xem routes/books.js).
process.on('unhandledRejection', (reason) => {
  console.error('[DB] Unhandled rejection (bo qua de server khong crash):', reason?.message || reason);
});

module.exports = { readConnection, writeConnection };
