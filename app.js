const express = require('express');
const path = require('path');
const session = require('express-session');
const { loadJson, saveJson } = require('./helpers/dataStore');

const app = express();

// -------------------------------
// Middleware
// -------------------------------

// static files
app.use(express.static(path.join(__dirname, 'public')));

// form parser
app.use(express.urlencoded({ extended: true }));

// session for admin panel
app.use(session({
  secret: process.env.SESSION_SECRET || 'super-secret-key',
  resave: false,
  saveUninitialized: false,
}));

// EJS engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


// -------------------------------
// GLOBAL NEWS DATA (from JSON instead of hardcoded)
// -------------------------------

// load instead of hardcoding
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

// Home Page — show 3 most recent news
app.get('/', (req, res) => {

  newsData = loadJson('news'); // auto-refresh when admin updates news

  const recentNews = [...newsData]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3);

  res.render('index', { 
    activePage: 'home',
    recentNews
  });
});

// About Page
app.get('/about', (req, res) => {
  res.render('about', { activePage: 'about' });
});

// Contact Page
app.get('/contact', (req, res) => {
  res.render('contact', { activePage: 'contact' });
});

// Projects Page
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
// NEWS PAGE WITH PAGINATION
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
// Contact Form Submission (save to admin messages)
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
// ADMIN PANEL ROUTES
// -------------------------------

const adminRoutes = require('./routes/admin');
app.use('/admin', adminRoutes);


// -------------------------------
// Server Start
// -------------------------------

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`⚡ Server running on http://localhost:${PORT}`);
});
