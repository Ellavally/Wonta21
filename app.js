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

let newsData = loadJson('news', [
  {
    title: "Wonta RDA Launches Women Empowerment Program",
    date: "2025-02-10",
    image: "/images/news1.jpg",
    summary: "A major initiative supporting rural women with skills training and microfinance opportunities.",
    link: "#"
  },
  {
    title: "Rural Schools Receive New Learning Materials",
    date: "2025-01-22",
    image: "/images/news2.jpg",
    summary: "Over 1,500 students benefited from new books, uniforms, and classroom supplies.",
    link: "#"
  },
  {
    title: "Food Security Support Reaches 12,000+ Households",
    date: "2025-01-05",
    image: "/images/food-security-news.jpg",
    summary: "Essential food supplies and nutrition training delivered to vulnerable rural families.",
    link: "#"
  }
]);


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

// Projects
app.get('/projects', (req, res) => {

  const projects = loadJson('projects', [
    {
      title: "Education for All",
      category: "Education",
      image: "/images/education.jpg",
      description: "Building schools, training teachers, and providing educational materials for children in underserved rural areas.",
      impact: "Over 2,000 students enrolled in new rural schools.",
      link: "#"
    },
    {
      title: "Food Security Program",
      category: "Food Security",
      image: "/images/food-security.jpg",
      description: "Supporting vulnerable households through food distribution, nutrition education, and sustainable food system development.",
      impact: "12,000+ households supported with essential food supplies.",
      link: "#"
    },
    {
      title: "Sustainable Agriculture Program",
      category: "Agriculture",
      image: "/images/agriculture.jpg",
      description: "Training local farmers in sustainable practices, irrigation systems, and modern farming techniques.",
      impact: "4,500+ farmers trained in eco-friendly agriculture.",
      link: "#"
    },
    {
      title: "Women Empowerment Initiative",
      category: "Women Empowerment",
      image: "/images/women.jpg",
      description: "Empowering women with skills training, microfinance programs, and leadership workshops.",
      impact: "600+ women supported through business and literacy programs.",
      link: "#"
    }
  ]);

  res.render('projects', { projects, activePage: 'projects' });
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
// NEW: GALLERY PAGE
// -------------------------------

app.get('/gallery', (req, res) => {
  
  // Load images from JSON OR fallback sample images
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
// Contact Form Submission
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
// Start Server
// -------------------------------

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`⚡ Server running on http://localhost:${PORT}`);
});
