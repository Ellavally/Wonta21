// routes/admin.js
const express = require('express');
const router = express.Router();
const path = require('path');
const bcrypt = require('bcrypt');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const { loadJson, saveJson } = require('../helpers/dataStore');
const { ensureAdmin, ensureEditorOrAdmin } = require('../middleware/auth');

// Multer upload config
const uploadDir = path.join(__dirname, '..', 'public', 'uploads');
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${uuidv4()}${path.extname(file.originalname)}`)
});
const upload = multer({ storage });

// Load users (admins/editors) from data/users.json
function loadUsers() {
  const users = loadJson('users', []);
  return users;
}

// ---- Login / Logout ----
router.get('/login', (req, res) => {
  res.render('admin/login', { message: null });
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const users = loadUsers();
  const user = users.find(u => u.username === username);
  if (!user) return res.render('admin/login', { message: 'Invalid credentials' });

  bcrypt.compare(password, user.passwordHash).then(match => {
    if (!match) return res.render('admin/login', { message: 'Invalid credentials' });
    req.session.user = { username: user.username, role: user.role };
    return res.redirect('/admin');
  });
});

router.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/admin/login'));
});

// ---- Dashboard ----
router.get('/', ensureEditorOrAdmin, (req, res) => {
  const news = loadJson('news');
  const projects = loadJson('projects');
  const messages = loadJson('messages');
  res.render('admin/dashboard', { user: req.session.user, newsCount: news.length, projectsCount: projects.length, messagesCount: messages.length });
});

// ---- News CRUD ----
router.get('/news', ensureEditorOrAdmin, (req, res) => {
  const news = loadJson('news');
  res.render('admin/news/list', { news });
});

router.get('/news/new', ensureEditorOrAdmin, (req, res) => {
  res.render('admin/news/form', { newsItem: null });
});

router.post('/news/new', ensureEditorOrAdmin, upload.single('image'), (req, res) => {
  const news = loadJson('news');
  const { title, date, summary, link } = req.body;
  const image = req.file ? '/uploads/' + req.file.filename : '';
  const id = uuidv4();
  news.unshift({ id, title, date, image, summary, link });
  saveJson('news', news);
  res.redirect('/admin/news');
});

router.get('/news/edit/:id', ensureEditorOrAdmin, (req, res) => {
  const news = loadJson('news');
  const item = news.find(n => n.id === req.params.id);
  res.render('admin/news/form', { newsItem: item || null });
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
  news = news.filter(n => n.id !== req.params.id);
  saveJson('news', news);
  res.redirect('/admin/news');
});

// ---- Projects CRUD (similar) ----
router.get('/projects', ensureEditorOrAdmin, (req, res) => {
  const projects = loadJson('projects');
  res.render('admin/projects/list', { projects });
});

router.get('/projects/new', ensureEditorOrAdmin, (req, res) => res.render('admin/projects/form', { project: null }));

router.post('/projects/new', ensureEditorOrAdmin, upload.single('image'), (req, res) => {
  const projects = loadJson('projects');
  const { title, category, description, impact, link } = req.body;
  const image = req.file ? '/uploads/' + req.file.filename : '';
  projects.unshift({ id: uuidv4(), title, category, description, impact, image, link });
  saveJson('projects', projects);
  res.redirect('/admin/projects');
});

router.get('/projects/edit/:id', ensureEditorOrAdmin, (req, res) => {
  const projects = loadJson('projects');
  const p = projects.find(x => x.id === req.params.id);
  res.render('admin/projects/form', { project: p || null });
});

router.post('/projects/edit/:id', ensureEditorOrAdmin, upload.single('image'), (req, res) => {
  const projects = loadJson('projects');
  const idx = projects.findIndex(x => x.id === req.params.id);
  if (idx === -1) return res.redirect('/admin/projects');
  const { title, category, description, impact, link } = req.body;
  if (req.file) projects[idx].image = '/uploads/' + req.file.filename;
  projects[idx] = { ...projects[idx], title, category, description, impact, link };
  saveJson('projects', projects);
  res.redirect('/admin/projects');
});

router.post('/projects/delete/:id', ensureAdmin, (req, res) => {
  let projects = loadJson('projects');
  projects = projects.filter(p => p.id !== req.params.id);
  saveJson('projects', projects);
  res.redirect('/admin/projects');
});

// ---- Homepage manager (text & images) ----
router.get('/homepage', ensureEditorOrAdmin, (req, res) => {
  const homepage = loadJson('homepage', { heroText: '', heroImage: '' });
  res.render('admin/homepage', { homepage });
});
router.post('/homepage', ensureEditorOrAdmin, upload.single('heroImage'), (req, res) => {
  const homepage = loadJson('homepage', { heroText: '', heroImage: '' });
  const { heroText } = req.body;
  if (req.file) homepage.heroImage = '/uploads/' + req.file.filename;
  homepage.heroText = heroText;
  saveJson('homepage', homepage);
  res.redirect('/admin/homepage');
});

// ---- Contact messages viewer ----
router.get('/messages', ensureEditorOrAdmin, (req, res) => {
  const messages = loadJson('messages', []);
  res.render('admin/messages', { messages });
});
router.post('/messages/delete/:id', ensureAdmin, (req, res) => {
  let messages = loadJson('messages', []);
  messages = messages.filter(m => m.id !== req.params.id);
  saveJson('messages', messages);
  res.redirect('/admin/messages');
});

// ---- File manager (list/delete) ----
router.get('/files', ensureEditorOrAdmin, (req, res) => {
  const fs = require('fs');
  const files = fs.readdirSync(uploadDir).map(f => '/uploads/' + f);
  res.render('admin/files', { files });
});
router.post('/files/delete', ensureAdmin, (req, res) => {
  const { file } = req.body; // expects '/uploads/filename.ext'
  const fs = require('fs');
  const p = path.join(uploadDir, path.basename(file));
  if (fs.existsSync(p)) fs.unlinkSync(p);
  res.redirect('/admin/files');
});

// ---- Users (create basic admin) ----
router.get('/users', ensureAdmin, (req, res) => {
  const users = loadJson('users', []);
  res.render('admin/users', { users });
});

// create new user form/POST (admin only)
router.post('/users/new', ensureAdmin, async (req, res) => {
  const { username, password, role } = req.body;
  const users = loadJson('users', []);
  const hash = await bcrypt.hash(password, 10);
  users.push({ id: uuidv4(), username, passwordHash: hash, role: role || 'editor' });
  saveJson('users', users);
  res.redirect('/admin/users');
});

module.exports = router;
