'use strict';

function ensure(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
    // res.redirect('/posts');
  }
  res.redirect('/login');
}

module.exports = ensure;