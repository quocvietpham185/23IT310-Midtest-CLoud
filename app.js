const express = require('express');
const path = require('path');
const { engine } = require('express-handlebars');

require('./config/db'); // khoi tao 2 ket noi Atlas (read/write) ngay khi boot
const bookRoutes = require('./routes/books');

const app = express();
const PORT = process.env.PORT || 3000;

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/books', bookRoutes);

app.get('/', (req, res) => res.redirect('/books'));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
