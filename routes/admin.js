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

// Multer upload config
const uploadDir = path.join(__dirname, '..', 'public', 'uploads');
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) =>
    cb(null, `${Date.now()}-${uuidv4()}${path.extname(file.originalname)}`)
});
const upload = multer({ storage });

// Load users
function loadUsers() {
  return loadJson('users', []);
}

/* -----------------------------------------------------------
   LOGIN (WRAPS login.ejs INTO layout.ejs)
----------------------------------------------------------- */

router.get('/login', (req, res) => {
  const loginHtml = ejs.render(
    fs.readFileSync('./views/admin/login.ejs', 'utf8'),
    { message: null }
  );
  res.render('admin/layout', {
    title: 'Login',
    user: null,
    body: loginHtml
  });
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const users = loadUsers();
  const user = users.find(u => u.username === username);

  if (!user) {
    const loginHtml = ejs.render(
      fs.readFileSync('./views/admin/login.ejs', 'utf8'),
      { message: 'Invalid credentials' }
    );
    return res.render('admin/layout', {
      title: 'Login',
      user: null,
      body: loginHtml
    });
  }

  bcrypt.compare(password, user.passwordHash).then(match => {
    if (!match) {
      const loginHtml = ejs.render(
        fs.readFileSync('./views/admin/login.ejs', 'utf8'),
        { message: 'Invalid credentials' }
      );
      return res.render('admin/layout', {
        title: 'Login',
        user: null,
        body: loginHtml
      });
    }

    req.session.user = { username: user.username, role: user.role };
    res.redirect('/admin');
  });
});

router.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/admin/login'));
});

/* -----------------------------------------------------------
   DASHBOARD
----------------------------------------------------------- */

router.get('/', ensureEditorOrAdmin, (req, res) => {
  const dashboardHtml = ejs.render(
    fs.readFileSync('./views/admin/dashboard.ejs', 'utf8'),
    {
      user: req.session.user,
      newsCount: loadJson('news').length,
      projectsCount: loadJson('projects').length,
      messagesCount: loadJson('messages').length
    }
  );

  res.render('admin/layout', {
    title: 'Dashboard',
    user: req.session.user,
    body: dashboardHtml
  });
});

/* -----------------------------------------------------------
   NEWS CRUD
----------------------------------------------------------- */

router.get('/news', ensureEditorOrAdmin, (req, res) => {
  const html = ejs.render(
    fs.readFileSync('./views/admin/news/list.ejs', 'utf8'),
    { news: loadJson('news') }
  );

  res.render('admin/layout', {
    title: 'News',
    user: req.session.user,
    body: html
  });
});

router.get('/news/new', ensureEditorOrAdmin, (req, res) => {
  const html = ejs.render(
    fs.readFileSync('./views/admin/news/form.ejs', 'utf8'),
    { newsItem: null }
  );

  res.render('admin/layout', {
    title: 'New News',
    user: req.session.user,
    body: html
  });
});

router.post('/news/new', ensureEditorOrAdmin, upload.single('image'), (req, res) => {
  const news = loadJson('news');
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

router.get('/news/edit/:id', ensureEditorOrAdmin, (req, res) => {
  const news = loadJson('news');
  const item = news.find(n => n.id === req.params.id);

  const html = ejs.render(
    fs.readFileSync('./views/admin/news/form.ejs', 'utf8'),
    { newsItem: item }
  );

  res.render('admin/layout', {
    title: 'Edit News',
    user: req.session.user,
    body: html
  });
});

router.post('/news/edit/:id', ensureEditorOrAdmin, upload.single('image'), (req, res) => {
  const news = loadJson('news');
  const i = news.findIndex(n => n.id === req.params.id);
  if (i === -1) return res.redirect('/admin/news');

  const { title, date, summary, link } = req.body;
  if (req.file) news[i].image = '/uploads/' + req.file.filename;

  news[i] = { ...news[i], title, date, summary, link };
  saveJson('news', news);
  res.redirect('/admin/news');
});

router.post('/news/delete/:id', ensureAdmin, (req, res) => {
  let news = loadJson('news');
  saveJson('news', news.filter(n => n.id !== req.params.id));
  res.redirect('/admin/news');
});

/* -----------------------------------------------------------
   PROJECTS CRUD
----------------------------------------------------------- */

// (same wrapper layout logic applied — omitted for brevity)
// If you want, I can paste the full rewritten Projects CRUD too.

module.exports = router;
