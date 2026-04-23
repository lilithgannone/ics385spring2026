const express = require("express");
const passport = require("passport");

const router = express.Router();

router.get("/login", (req, res) => {
  if (req.isAuthenticated()) return res.redirect("/admin/dashboard");

  res.render("admin/login", {
    error: req.query.error === "invalid"
  });
});

router.post("/login",
  passport.authenticate("local", {
    successRedirect: "/admin/dashboard",
    failureRedirect: "/admin/login?error=invalid",
    failureFlash: false
  })
);

router.get("/logout", (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);

    req.session.destroy(sessionErr => {
      if (sessionErr) return next(sessionErr);
      res.clearCookie("connect.sid");
      res.redirect("/admin/login");
    });
  });
});

module.exports = router;
