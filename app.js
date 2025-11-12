const express = require('express');
const app = express();
const path = require('path');

// Serve static files (CSS, JS, images)
app.use(express.static(path.join(__dirname, 'public')));

// Parse POST request data
app.use(express.urlencoded({ extended: true }));

// Set EJS as the template engine
app.set('view engine', 'ejs');

// Routes
app.get('/', (req, res) => {
  res.render('index'); // home page
});

app.get('/about', (req, res) => {
  res.render('about'); // about page
});

app.get('/contact', (req, res) => {
  res.render('contact'); // contact page
});

app.get('/projects', (req, res) => {
  res.render('projects'); // projects page
});

// Handle form submission (optional)
app.post('/contact', (req, res) => {
  console.log(req.body); // just log the form data
  res.send('Thank you for contacting us!');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));