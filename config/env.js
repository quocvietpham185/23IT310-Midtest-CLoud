require('dotenv').config();

const MSSV = process.env.MSSV || '';
const digitsOnly = MSSV.replace(/\D/g, '');
const lastDigit = Number(digitsOnly.slice(-1)) || 0;

module.exports = {
  PORT: process.env.PORT || 3000,
  MSSV,
  FULL_NAME: process.env.FULL_NAME || '',

  // 3 ky tu cuoi cua MSSV - tien to bat buoc cua moi ma san pham
  CODE_PREFIX: MSSV.slice(-3),
  // VAT = chu so cuoi MSSV + 5 (%)
  VAT_RATE: lastDigit + 5,

  SESSION_SECRET: process.env.SESSION_SECRET || 'change-me',

  MONGO_URI_READ: process.env.MONGO_URI_READ,
  MONGO_URI_WRITE: process.env.MONGO_URI_WRITE,

  ADMIN_USERNAME: process.env.ADMIN_USERNAME || 'admin',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'admin123',
};
