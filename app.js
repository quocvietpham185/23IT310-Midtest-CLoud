const express = require('express');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const { engine } = require('express-handlebars');

const { PORT, SESSION_SECRET, MONGO_URI_WRITE, MSSV, FULL_NAME, VAT_RATE } = require('./config/env');
const authRoutes = require('./routes/auth');

const app = express();

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Stateless session: trang thai nam o MongoDB Atlas, khong o RAM may chu,
// nen co the chay nhieu instance (auto-scaling) ma khong mat phien dang nhap.
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: MONGO_URI_WRITE,
      collectionName: 'sessions',
      ttl: 60 * 60 * 24,
    }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
  })
);

app.use((req, res, next) => {
  res.locals.footer = { fullName: FULL_NAME, mssv: MSSV, vatRate: VAT_RATE };
  res.locals.isLoggedIn = Boolean(req.session.isLoggedIn);
  next();
});

app.use('/', authRoutes);

app.get('/', (req, res) => {
  res.render('home', { title: 'Quan ly Sach' });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
