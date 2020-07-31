var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) { //the router shouldn't be changed. cause about is root for about own
  res.render('about', { title: 'About Us' });
});

module.exports = router;
