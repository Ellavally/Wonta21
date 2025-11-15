// middleware/auth.js
module.exports = {
  ensureAdmin: (req, res, next) => {
    if (req.session && req.session.user && req.session.user.role === 'admin') return next();
    return res.redirect('/admin/login');
  },
  ensureEditorOrAdmin: (req, res, next) => {
    if (req.session && req.session.user && (req.session.user.role === 'admin' || req.session.user.role === 'editor')) return next();
    return res.redirect('/admin/login');
  }
};
