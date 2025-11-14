const express = require('express');
const path = require('path');
const app = express();

// -------------------------------
// Middleware
// -------------------------------

// Serve static files (CSS, JS, images) from "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// Parse URL-encoded POST data (contact form)
app.use(express.urlencoded({ extended: true }));

// Set EJS as template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


// -------------------------------
// ROUTES
// -------------------------------

// Home Page
app.get('/', (req, res) => {
  res.render('index', { activePage: 'home' });
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
  const projects = [
    {
      title: "Education for All",
      category: "Education",
      image: "/images/education.jpg",
      description: "Building schools, training teachers, and providing educational materials for children in underserved rural areas.",
      impact: "Over 2,000 students enrolled in new rural schools.",
      link: "#"
    },
    {
      title: "Rural Health Outreach",
      category: "Healthcare",
      image: "/images/health.jpg",
      description: "Providing access to essential healthcare services through rural clinics and mobile health programs.",
      impact: "15,000+ people received free checkups and vaccinations.",
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
  ];

  res.render('projects', { projects, activePage: 'projects' });
});


// -------------------------------
// NEWS PAGE
// -------------------------------
app.get('/news', (req, res) => {
  const news = [
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
      title: "Mobile Health Outreach Reaches 3,000+ Residents",
      date: "2025-01-05",
      image: "/images/news3.jpg",
      summary: "Free checkups, vaccinations, and health education were provided in remote communities.",
      link: "#"
    }
  ];

  res.render('news', { news, activePage: 'news' });
});


// -------------------------------
// Contact Form Submission
// -------------------------------
app.post('/contact', (req, res) => {
  console.log("📩 Contact form submitted:", req.body);
  res.send("Thank you for contacting us!");
});


// -------------------------------
// Server Start
// -------------------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`⚡ Server running on http://localhost:${PORT}`);
});
