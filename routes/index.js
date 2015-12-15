var express = require('express');
var passport = require('passport');
var Account = require('../models/account');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	console.log(req.user);
	res.render('index', { user : req.user });
});

/////////////	REGISTER GET ///////////////////
router.get('/register', function(req, res) {
    res.render('register', { });
});

/////////////	REGISTER POST ///////////////////
router.post('/register', function(req, res, next){
	Account.register(new Account(
		{username: req.body.username,}), 
		req.body.password,
		function(error, account){
			if(error){
				console.log(error);
				return res.render('register');
			}else{
				passport.authenticate('local')(req, res, function(){
					req.session.username = req.body.username;
					res.redirect('/')
				});
			}
		});
});

/////////////	LOGIN GET ///////////////////
router.get('/login', function(req, res, next){
	res.render('login')
})

/////////////	LOGIN POST ///////////////////
router.post('/login', passport.authenticate('local'), function(req, res) {
	req.session.username = req.body.username;
    res.redirect('/');
});


function isLoggedIn(req, res, next) {
	if(req.user.authenticated) {
		console.log('the user is logged in!!!!!!!!')
	}
	console.log('user is not logged in==========')
}

module.exports = router;
