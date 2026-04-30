const express = require("express");
const passport = require("passport");
// express validator used on user input in POST routes
const {body, validationResult} = require("express-validator");

const router = express.Router();

const loginValidation = [
  body("email").isEmail().normalizeEmail(),
  body("password").isLength({ min: 1 }).trim()
];

router.get("/login", (req, res) => {
  if (req.isAuthenticated() && req.user && req.user.role === "admin") {
    return res.redirect("/admin/dashboard");
  }

  let errorMessage = "";
  let noticeMessage = "";

  if (req.query.notice === "user-created") {
    noticeMessage = "User account created. User site is pending development.";
  }

  if (req.query.notice === "pending") {
    noticeMessage = "Your user account exists, but the user site is pending development.";
  }


  if (req.query.error === "invalid") {
    errorMessage = "Invalid credentials. Please try again.";
  }

  if (req.query.error === "validation") {
    errorMessage = "Please enter a valid email and password.";
  }

  res.render("admin/login", {
    errorMessage,
    noticeMessage
  });

});

router.post("/login",
  loginValidation,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.redirect("/admin/login?error=validation");
    }
    next();
  },
  passport.authenticate("local", {
    successRedirect: "/admin/dashboard",
    failureRedirect: "/admin/login?error=invalid",
    failureFlash: false
  })
);

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get("/auth/google/callback", (req, res, next) => {
  passport.authenticate("google", (err, user) => {
    if (err) return next(err);

    if (!user) {
      return res.redirect("/admin/login?error=invalid");
    }

    req.logIn(user, loginErr => {
      if (loginErr) return next(loginErr);

      if (user.role !== "admin") {
        if (user.wasCreated) {
          return res.redirect("/admin/login?notice=user-created");
        }

        return res.redirect("/admin/login?notice=pending");
      }

      res.redirect("/admin/dashboard");
    });
  })(req, res, next);
});


router.post("/logout", (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);

    req.session.destroy(sessionErr => {
      if (sessionErr) return next(sessionErr);
      res.clearCookie("connect.sid");
      res.redirect("/admin/login");
    });
  });
});

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
