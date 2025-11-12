const express = require('express');
const router = express.Router();

// Home page
router.get('/', (req, res) => {
  res.render('index');
});

// About page
router.get('/about', (req, res) => {
  res.render('about');
});

// Contact page
router.get('/contact', (req, res) => {
  res.render('contact');
});

// Programs page
router.get('/programs', (req, res) => {
  res.render('programs');
});

// Get Involved page
router.get('/get-involved', (req, res) => {
  res.render('get-involved');
});

// Get Involved page
router.get('/get-involved', (req, res) => {
  res.render('get-involved');
});

module.exports = router;