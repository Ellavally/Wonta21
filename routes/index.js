const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

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

// ======== GALLERY PAGE (AUTO LOAD IMAGES) ==========
router.get('/gallery', (req, res) => {
  const galleryPath = path.join(__dirname, '..', 'public', 'images', 'gallery');

  let galleryImages = [];

  try {
    galleryImages = fs.readdirSync(galleryPath)
      .filter(file => file.match(/\.(jpg|jpeg|png|gif)$/i))
      .map(file => ({
        src: `/images/gallery/${file}`
      }));
  } catch (err) {
    console.error('Error loading gallery images:', err);
  }

  res.render('gallery', { galleryImages });
});

// ====================================================

module.exports = router;
