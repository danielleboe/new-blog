const isLoggedIn = (req) => {
  return req.isAuthenticated();
};

const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error_msg", "Please log in to view this resource");
  res.redirect("/");
};

module.exports = { ensureAuthenticated, isLoggedIn };
