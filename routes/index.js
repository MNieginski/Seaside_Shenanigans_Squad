var express = require('express');
var router = express.Router();
const passport = require('passport')
const ensureLoggedIn = require('../config/ensureLoggedIn')




/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { });
});



router.get('/auth/google', passport.authenticate(
  // Which passport strategy is being used?
  'google',
  {
    // Requesting the user's profile and email
    scope: ['profile', 'email'],
    // Optionally force pick account every time
    // prompt: "select_account"
  }
));

router.get('/oauth2callback', passport.authenticate(
  'google',
  {
    successRedirect: '/vacations',
    failureRedirect: '/'
  }
  
));

router.get('/logout', function(req, res){
  req.logout(function() {
    res.redirect('/');
  });
});

router.get('/api/test', function(req, res){
  // req.logout(function() {
  //   res.redirect('/');
  // });
  res.json({message: 'success!!'})
});


module.exports = router;
