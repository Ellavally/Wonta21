const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const { loadJson, saveJson } = require('../helpers/dataStore');
const { ensureAdmin, ensureEditorOrAdmin } = require('../middleware/auth');
const ejs = require('ejs');

/* -----------------------------------------------------------
   FILE UPLOAD (Multer)
----------------------------------------------------------- */
const uploadDir = path.join(__dirname, '..', 'public', 'uploads');
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) =>
    cb(null, `${Date.now()}-${uuidv4()}${path.extname(file.originalname)}`)
});
const upload = multer({ storage });

function loadUsers() {
  return loadJson('users', []);
}

/* -----------------------------------------------------------
   LOGIN PAGE
----------------------------------------------------------- */
router.get('/login', (req, res) => {
  const html = ejs.render(
    fs.readFileSync('./views/admin/login.ejs', 'utf8'),
    { message: null }
  );

  res.render('admin/layout', {
    title: 'Login',
    user: null,
    body: html
  });
});

/* -----------------------------------------------------------
   LOGIN SUBMIT
----------------------------------------------------------- */
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const users = loadUsers();

  const user = users.find(u => u.username === username);

  if (!user) {
    const html = ejs.render(
      fs.readFileSync('./views/admin/login.ejs', 'utf8'),
      { message: "Invalid credentials" }
    );
    return res.render('admin/layout', {
      title: "Login",
      user: null,
      body: html
    });
  }

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) {
    const html = ejs.render(
      fs.readFileSync('./views/admin/login.ejs', 'utf8'),
      { message: "Invalid credentials" }
    );
    return res.render('admin/layout', {
      title: "Login",
      user: null,
      body: html
    });
  }

  // STORE session
  req.session.user = {
    id: user.id,
    username: user.username,
    role: user.role
  };

  res.redirect('/admin');
});

/* -----------------------------------------------------------
   LOGOUT
----------------------------------------------------------- */
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/admin/login');
  });
});

/* -----------------------------------------------------------
   DASHBOARD
----------------------------------------------------------- */
router.get('/', ensureEditorOrAdmin, (req, res) => {
  const html = ejs.render(
    fs.readFileSync('./views/admin/dashboard.ejs', 'utf8'),
    {
      newsCount: loadJson('news', []).length,
      projectsCount: loadJson('projects', []).length,
      messagesCount: loadJson('messages', []).length,
      user: req.session.user
    }
  );

  res.render('admin/layout', {
    title: 'Dashboard',
    user: req.session.user,
    body: html
  });
});

/* -----------------------------------------------------------
   NEWS LIST
----------------------------------------------------------- */
router.get('/news', ensureEditorOrAdmin, (req, res) => {
  const html = ejs.render(
    fs.readFileSync('./views/admin/news/list.ejs', 'utf8'),
    { news: loadJson('news', []), user: req.session.user }
  );

  res.render('admin/layout', {
    title: 'News',
    user: req.session.user,
    body: html
  });
});

/* -----------------------------------------------------------
   NEWS CREATE FORM
----------------------------------------------------------- */
router.get('/news/new', ensureEditorOrAdmin, (req, res) => {
  const html = ejs.render(
    fs.readFileSync('./views/admin/news/form.ejs', 'utf8'),
    { newsItem: null, user: req.session.user }
  );

  res.render('admin/layout', {
    title: 'Create News',
    user: req.session.user,
    body: html
  });
});

/* -----------------------------------------------------------
   NEWS CREATE SUBMIT
----------------------------------------------------------- */
router.post('/news/new', ensureEditorOrAdmin, upload.single('image'), (req, res) => {
  const news = loadJson('news', []);
  const { title, date, summary, link } = req.body;

  news.unshift({
    id: uuidv4(),
    title,
    date,
    summary,
    link,
    image: req.file ? '/uploads/' + req.file.filename : ''
  });

  saveJson('news', news);
  res.redirect('/admin/news');
});

/* -----------------------------------------------------------
   NEWS EDIT FORM
----------------------------------------------------------- */
router.get('/news/edit/:id', ensureEditorOrAdmin, (req, res) => {
  const news = loadJson('news', []);
  const item = news.find(n => n.id === req.params.id);

  const html = ejs.render(
    fs.readFileSync('./views/admin/news/form.ejs', 'utf8'),
    { newsItem: item, user: req.session.user }
  );

  res.render('admin/layout', {
    title: 'Edit News',
    user: req.session.user,
    body: html
  });
});

/* -----------------------------------------------------------
   NEWS EDIT SUBMIT
----------------------------------------------------------- */
router.post('/news/edit/:id', ensureEditorOrAdmin, upload.single('image'), (req, res) => {
  const news = loadJson('news', []);
  const index = news.findIndex(n => n.id === req.params.id);
  if (index === -1) return res.redirect('/admin/news');

  const { title, date, summary, link } = req.body;

  if (req.file) {
    news[index].image = '/uploads/' + req.file.filename;
  }

  news[index] = { ...news[index], title, date, summary, link };
  saveJson('news', news);

  res.redirect('/admin/news');
});

/* -----------------------------------------------------------
   NEWS DELETE
----------------------------------------------------------- */
router.post('/news/delete/:id', ensureAdmin, (req, res) => {
  let news = loadJson('news', []);
  news = news.filter(n => n.id !== req.params.id);
  saveJson('news', news);

  res.redirect('/admin/news');
});

module.exports = router;
