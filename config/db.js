const mongoose = require('mongoose');
const { MONGO_URI_READ, MONGO_URI_WRITE } = require('./env');

// Hai ket noi doc lap toi hai tai khoan Atlas khac nhau (Least Privilege):
// readConnection  -> tai khoan chi co quyen "read"
// writeConnection -> tai khoan co quyen "readWrite" (dung cho ghi sach va luu session)
const readConnection = mongoose.createConnection(MONGO_URI_READ);
const writeConnection = mongoose.createConnection(MONGO_URI_WRITE);

readConnection.on('connected', () => console.log('[DB] Read connection (read-only user) connected'));
readConnection.on('error', (err) => console.error('[DB] Read connection error:', err.message));

writeConnection.on('connected', () => console.log('[DB] Write connection (read-write user) connected'));
writeConnection.on('error', (err) => console.error('[DB] Write connection error:', err.message));

module.exports = { readConnection, writeConnection };
