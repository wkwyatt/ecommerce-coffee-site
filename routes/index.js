var express = require('express');
var passport = require('passport')
var router = express.Router();

// Import models & Schema
var Account = require('../models/account')


/* GET home page. */
router.get('/', function(req, res, next) {
	console.log(req.user);
	res.render('index', { user: req.user });
});

router.get('/register', function(req, res){
	res.render('register');
});


router.post('/register', function(req, res, next){
	Account.register(new Account({
		username: req.body.username
		}),
		req.body.password,
		function(err, account) {
			if(err) {
				console.log(err)
				return res.render('register');
			} else {
				passport.authenticate('local')(req, res, function(){
					res.redirect('/');
				});
			}
		}
)});

router.get('/login', function(req, res, next){
	res.render('login');
});

router.post('/login', passport.authenticate('local'), function(req, res){
	res.redirect('/');
});

module.exports = router;

// var renderPage = function(req, res, next) {}

// var registerUser = function(req, res, next) {
// 	Account.register(new Account({
// 		username: req.body.username
// 		}),
// 		req.body.password,
// 		function(err, account) {
// 			if(err) {
// 				console.log(err)
// 				return res.render('index');
// 			} else {
// 				passport.authenticate('local')(req, res, function(){
// 					res.redirect('/');
// 				});
// 			}
// 		}
// 	);
// }