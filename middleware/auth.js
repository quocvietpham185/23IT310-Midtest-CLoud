module.exports = function requireLogin(req, res, next) {
  if (req.session && req.session.isLoggedIn) return next();
  return res.redirect('/login');
};
