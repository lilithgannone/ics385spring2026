module.exports = function isAuthenticated(req, res, next) {
  if (req.isAuthenticated() && req.user && req.user.role === "admin") {
    return next();
  }

  res.redirect("/admin/login");
};
