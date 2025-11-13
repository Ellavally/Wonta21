const express = require('express');
const path = require('path');
const app = express();

// Serve static files (CSS, JS, images)
app.use(express.static(path.join(__dirname, 'public')));

// Parse POST request data
app.use(express.static('public')); // CSS, JS, images folder
// Set EJS as the template engine
app.set('view engine', 'ejs');

// -------------------------------
// ROUTES
// -------------------------------

// Home
app.get('/', (req, res) => {
  res.render('index', { page: 'home' });
});

// About
app.get('/about', (req, res) => {
  res.render('about', { page: 'about' });
});

// Contact
app.get('/contact', (req, res) => {
  res.render('contact', { page: 'contact' });
});

// Projects
app.get('/projects', (req, res) => {
  const projects = [
    {
      title: "Education for All",
      category: "Education",
      image: "https://via.placeholder.com/400x250?text=Education",
      description: "Building schools, training teachers, and providing educational materials for children in underserved rural areas.",
      impact: "Over 2,000 students enrolled in new rural schools.",
      link: "#"
    },
    {
      title: "Rural Health Outreach",
      category: "Healthcare",
      image: "https://via.placeholder.com/400x250?text=Healthcare",
      description: "Providing access to essential healthcare services through rural clinics and mobile health programs.",
      impact: "15,000+ people received free checkups and vaccinations.",
      link: "#"
    },
    {
      title: "Sustainable Agriculture Program",
      category: "Agriculture",
      image: "https://via.placeholder.com/400x250?text=Agriculture",
      description: "Training local farmers in sustainable practices, irrigation systems, and modern farming techniques.",
      impact: "4,500+ farmers trained in eco-friendly agriculture.",
      link: "#"
    },
    {
      title: "Women Empowerment Initiative",
      category: "Women Empowerment",
      image: "https://via.placeholder.com/400x250?text=Women+Empowerment",
      description: "Empowering women with skills training, microfinance programs, and leadership workshops.",
      impact: "600+ women supported through business and literacy programs.",
      link: "#"
    }
  ];

  // Pass data to EJS
  res.render('projects', { projects, page: 'projects' });
});

// -------------------------------
// Contact Form Submission
// -------------------------------
app.post('/contact', (req, res) => {
  console.log('Contact form submission:', req.body);
  res.send('Thank you for contacting us!');
});

// -------------------------------
// Server Startup
// -------------------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
