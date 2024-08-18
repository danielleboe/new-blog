// const router = require('express').Router();
// const { User } = require('../../models');

// // Create a new user (sign up)
// router.post('/signup', async (req, res) => {
//   try {
//     const newUser = await User.create({
//       username: req.body.username,
//       email: req.body.email,
//       password: req.body.password,
//     });

//     req.session.save(() => {
//       req.session.user_id = newUser.id;
//       req.session.logged_in = true;
//       res.status(200).json(newUser);
//     });
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

// // Login
// router.post('/login', async (req, res) => {
//   try {
//     const userData = await User.findOne({ where: { email: req.body.email } });
//     console.log(`11111111userdatafindone`)

//     if (!userData) {
//       res.status(400).json({ message: 'Incorrect email or password, please try again' });
//       return;
//     }
    

//     const validPassword = userData.checkPassword(req.body.password);

//     if (!validPassword) {
//       res.status(400).json({ message: 'Incorrect email or password, please try again' });
//       return;
//     }
//     console.log(`valid password check`)

//     req.session.save(() => {
//       req.session.user_id = userData.id;
//       req.session.logged_in = true;

//       res.json({ user: userData, message: 'You are now logged in!' });
//     });
//     console.log(`you are now logged in console log`)

//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

// // Logout
// router.post('/logout', (req, res) => {
//   if (req.session.logged_in) {
//     req.session.destroy(() => {
//       res.status(204).end();
//     });
//   } else {
//     res.status(404).end();
//   }
// });

// module.exports = router;






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
  console.log(`!!!!!!!!`, username, email, password);
  let errors = [];

  if (password.length < 6) {
    errors.push({ msg: 'Password should be at least 6 characters' });
  }

  if (errors.length > 0) {
    res.render('login', { errors, username, email, password });
    console.log(`$$$$$$$$!`, username, password);
  } else {
    try {
      const user = await User.findOne({ where: { username } });
      console.log(`!^^^^^^^^!`, username, email, password);
      if (user) {
        console.log(`!^%%%%%%%%%%%%%^!`, username, email, password);
        errors.push({ msg: 'Username already exists' });
        res.render('signup', { errors, username, email, password });
      } else {
        console.log(`!^&&&&&&&&&&&&&&!`, username, email, password);
        await User.create({ username, email, password });
        req.flash('success_msg', 'You are now signuped and can log in');
        res.redirect('/api/users/login');
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
  console.log(`!++++++++!`, username, password);
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
