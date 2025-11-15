const express = require('express');
const path = require('path');
const session = require('express-session');
const { loadJson, saveJson } = require('./helpers/dataStore');
const crypto = require('crypto');

const app = express();

// -------------------------------
// Middleware
// -------------------------------

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET || 'super-secret-key',
  resave: false,
  saveUninitialized: false,
}));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


// -------------------------------
// GLOBAL NEWS DATA
// -------------------------------

let newsData = loadJson('news', []);


// -------------------------------
// ROUTES
// -------------------------------

// Home Page
app.get('/', (req, res) => {

  newsData = loadJson('news');

  const recentNews = [...newsData]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3);

  res.render('index', { 
    activePage: 'home',
    recentNews
  });
});

// About
app.get('/about', (req, res) => {
  res.render('about', { activePage: 'about' });
});

// Contact
app.get('/contact', (req, res) => {
  res.render('contact', { activePage: 'contact' });
});

// Projects Page
app.get('/projects', (req, res) => {

  const projects = loadJson('projects', []);

  res.render('projects', { 
    activePage: 'projects',
    projects 
  });
});

// Get Involved
app.get('/get-involved', (req, res) => {
  res.render('get-involved', { activePage: 'get-involved' });
});


// -------------------------------
// NEWS PAGE (Paginated)
// -------------------------------

app.get('/news', (req, res) => {

  newsData = loadJson('news');

  const currentPage = parseInt(req.query.page) || 1;
  const itemsPerPage = 6;

  const start = (currentPage - 1) * itemsPerPage;
  const paginatedNews = newsData.slice(start, start + itemsPerPage);
  const totalPages = Math.ceil(newsData.length / itemsPerPage);

  res.render('news', {
    activePage: 'news',
    newsItems: paginatedNews,
    currentPage,
    totalPages
  });
});


// -------------------------------
// GALLERY PAGE
// -------------------------------

app.get('/gallery', (req, res) => {
  
  // Load images stored by admin (gallery.json)
  const galleryImages = loadJson('gallery', [
    { src: "/images/nebir.jpg" },
    { src: "/images/tota.jpg" },
    { src: "/images/education.jpg" },
    { src: "/images/agriculture.jpg" },
    { src: "/images/food-security.jpg" },
    { src: "/images/women.jpg" }
  ]);

  res.render('gallery', { 
    activePage: 'gallery',
    galleryImages 
  });
});


// -------------------------------
// CONTACT FORM SUBMIT
// -------------------------------

app.post('/contact', (req, res) => {
  const messages = loadJson('messages', []);
  const id = crypto.randomUUID();

  messages.unshift({
    id,
    ...req.body,
    date: new Date().toISOString()
  });

  saveJson('messages', messages);

  res.send("Thank you for contacting us!");
});


// -------------------------------
// ADMIN PANEL
// -------------------------------

const adminRoutes = require('./routes/admin');
app.use('/admin', adminRoutes);


// -------------------------------
// SERVER START
// -------------------------------

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`⚡ Server running on http://localhost:${PORT}`);
});
