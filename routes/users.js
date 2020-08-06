const express = require('express');
const {check, validationResult} = require('express-validator');
const router = express.Router();

const User = require('../models/user');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/register', (req, res) => {
  res.render("register", {title: 'Register', user: req.user})
})

router.get('/login', (req, res) => {
  res.render("login", {title: "Login", user: req.user})
})


// ==============register post===========
router.post('/register',async (req, res, next) => {
  let name = req.body.name;
  let email = req.body.email;
  let username = req.body.username;
  let password = req.body.password;
  let password2 = req.body.password2;
  // console.log(name)
  // console.log(email)
  // console.log(username)
  // console.log(password)


  // about image
  //work with image later

  // validation
  await check('name', 'Name field is empty').notEmpty().run(req);
  await check('email', "Email field is empty").notEmpty().run(req);
  await check('email', "Email is not valid").isEmail().run(req);
  await check('username', "Username field is empty").notEmpty().run(req);
  await check('password', "Password field is empty").notEmpty().run(req);
  await check('password', "Password should have at least 5 characters").isLength({min: 5}).run(req);
  await check('password2', "Password doesn't match").equals(req.body.password).run(req);

  const errors = validationResult(req)

  if(!errors.isEmpty()){
    console.log(errors.mapped())

    res.render('register', {
      tittle: "Register",
      user: req.user,
      errors: errors.mapped(),
      name: "name",
      email: "email",
      username: "username",
      password: "password",
      password2: "password2"
    })
  }else{
    let newUser = new User({
      name: name,
      email: email,
      username: username,
      password: password
    })

    User.createUser(newUser, (err, user) =>{
      if(err) throw err
      console.log(user)
    })

    //success message
    req.flash("success", "You are now registered. Please Login")
    console.log('successful')

    //redirect
    res.redirect('/users/login')
  }
})

//======================login post=========================

//for the user session, we need to configure serialized and deserialized
passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser((id, done) => {
  User.findUserById(id, (err, user) => {
    done(err, user)
  })
})


//pasport strategy
passport.use(new localStrategy({
  passReqToCallback: true
}, (req, username, password, done) => {
    User.findUserByUsername(username, (err, user) => {
      if (err) return done(err)
      if(!user){
        console.log('User not registered')
        return done(null, false, {message: 'User not registered'})
      }
      
      User.comparePassword(password, user.password, (err, isMatch) => {
        if(err) return done(err)
        if(isMatch){
          return done(null, user)
        }else{
          console.log('Incorrect Password')
          return done(null, false, {message: 'Incorrect Password'})
        }
      })
    })
  }
))

router.post('/login',
passport.authenticate('local', {failureFlash: 'Invalid username and password', failureRedirect: '/users/login'}),
(req, res, next) => {
  req.flash('success', 'You have logged in successfully')
  console.log('successfully logged in')
  res.redirect('/members')
})

router.get('/logout', (req, res, next) => {
  req.logout()
  req.flash('success', 'You have logged out successfully')
  console.log("logged out")
  res.redirect('/')
})

module.exports = router;
