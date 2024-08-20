// routes/users.js

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const passport = require('passport');
const { User } = require('../../models');

// GET all users
router.get('/', async (req, res) => {
  try {
    const users = await User.findAll({
    //   include: [],
    });
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to retrieve users', error: err });
  }
});


// Register Page
router.get('/signup', (req, res) => res.render('login'));

// Register Handle
router.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;
  let errors = [];

  if (password.length < 6) {
    errors.push({ msg: 'Password should be at least 6 characters' });
  }

  if (errors.length > 0) {
    res.render('login', { errors, username, email, password });
  } else {
    try {
      const existingUser = await User.findOne({ where: { username } });
      if (existingUser) {
        errors.push({ msg: 'Username already exists' });
        res.render('signup', { errors, username, email, password });
      } else {
        const newUser = await User.create({ username, email, password });

        // Automatically log the user in after signup
        req.login(newUser, (err) => {
          if (err) {
            console.error(err);
            errors.push({ msg: 'Error logging in after signup' });
            return res.render('signup', { errors, username, email, password });
          }

          // Redirect to the dashboard or any other authenticated page
          res.redirect('/dashboard');
        });
      }
    } catch (err) {
      console.error(err);
      res.render('signup', { errors, username, email, password });
    }
  }
});

// Login Page
router.get('/login', (req, res) => res.render('home'));

// Login Handle
router.post('/login', (req, res, next) => {
  const { username, password } = req.body;
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/api/users/login',
    failureFlash: true
  })(req, res, next);
  // return res.status(200);
});

// Logout Handle
router.post('/logout', (req, res) => {
  req.logout(() => {
    req.flash('success_msg', 'You are logged out');
    res.redirect('/api/users/login');
  });
});




module.exports = router;
