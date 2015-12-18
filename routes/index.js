var express = require('express');
var passport = require('passport');
//Require our account.js file which resides in models one dir up
var Account = require('../models/account');
var router = express.Router();
var nodemailer = require('nodemailer');
// var vars = require('../config/vars.json');
var stripe = require("stripe")(
  "sk_test_kRmqYSFSriTO5n2dj7CrLBRI"
);

/* GET home page. */
router.get('/', function (req, res, next) {
    //res.send(req.session);
    res.render('index', { username : req.session.username, menuItem: 'welcome' });
});

////////////////////////////////////////
////////////////REGISTER////////////////
////////////////////////////////////////

// Get the register page
router.get('/register', function(req, res) {
    res.render('register', { });
});

//Post to the register page
router.post('/register', function(req, res) {
    //The mongo statement to insert the new vars into the db
    Account.register(new Account(
    		{ username : req.body.username }
    	), 
    	req.body.password, 
    	function(err, account) {
	        if (err) {
	            return res.render('register', { err : err });
	        }
        passport.authenticate('local')(req, res, function () {
        	console.log('=========user object========')
        	console.log(req.user);
        	console.log('===================')
            req.session.username = req.body.username;
            res.render('choices', { username : req.session.username });
        });
    });
});

/* ---------------------------- */
/* ----------Login----------- */
/* ---------------------------- */
//Get the login page
router.get('/login', function(req, res) {

    //the user is already logged in
    if(req.session.username){
        res.redirect('/choices');
    }
    //req.query.login pulls the query parameters right out of the http headers!
    //They are here and failed a login
    if (req.query.failedlogin){
        res.render('login', { failed : "Your username or password is incorrect." });    
    }
    //They are here and aren't logged in
    res.render('login', { });
})

router.post('/login', function(req, res, next) {

      passport.authenticate('local', function(err, user, info) {
        if (err) {
          return next(err); // will generate a 500 error
        }
        // Generate a JSON response reflecting authentication status
        if (! user) {
          return res.redirect('/login?failedlogin=1');
        }
        if (user){
        	if(user.accessLevel == 5) { //level 5 = Admin
        		req.session.accessLevel = "Admin";
        	}
            req.session.username = user.username;
        }

        return res.redirect('/choices');
      })(req, res, next);

});

/* ---------------------------- */
/* ----------Logout----------- */
/* ---------------------------- */
router.get('/logout', function(req, res) {
    req.session.destroy();
    res.redirect('/');
});

/* ---------------------------- */
/* ----------CHOICES GET----------- */
/* ---------------------------- */
router.get('/choices', function (req, res, next){
	//Make sure the user is logged in!!
	if(req.session.username){
		//They do belong here. Proceed with page
		//Check and see if they have any set preferences already.
		Account.findOne(
			{ username: req.session.username },
			function (err, doc){
				var currPounds = doc.pounds;
				var curFreq = doc.frequency;
				var currGrind = doc.grind
				//Render the choices view
				res.render('choices', {username: req.session.username, accessLevel: req.session.accessLevel, menuItem: 'options', pounds: currPounds, grind: currGrind, frequency: curFreq});
			});
	}else{
		res.redirect('/');
	}
});

router.post('/choices', function (req, res, next){
	//Is the dude at the keyboard logged in
	if(req.session.username){
		//Yes
		var query = {username: req.session.username};
		var update = {grind: req.body.grind, pounds: req.body.quarterPounds, frequency: req.body.frequency};
		var options = {upsert: true};
		Account.findOneAndUpdate(query, update, options, function(err, account) {
		  if (err) {
		    console.log('There was an error saving your preferences. Please re-enter or send this error to our help team: ' + err );
		  }else{
		  	account.save;
		  }
		});
		res.redirect('/delivery');
	}else{
		//req.session.username is not set. Goodbye.
		res.redirect('/')
	}
});

router.get('/delivery', function (req, res, next){
    //If the user is logged in...
    if(req.session.username){
        Account.findOne({ "username": req.session.username}, function (err, doc, next){
            var fullName = doc.fullName ? doc.fullName : undefined;
            var address1 = doc.address1 ? doc.address1 : undefined;
            var address2 = doc.address2 ? doc.address2 : undefined;
            var city = doc.city ? doc.city : undefined;
            var state = doc.city ? doc.state : undefined;
            var zip = doc.zip ? doc.zip : undefined;
            var nextDelivery = doc.nextOrderDate ? doc.nextOrderDate : undefined
            res.render( 'delivery', {
                username: req.session.username,
                fullName: fullName,
                address1: address1,
                address2: address2,
                city: city,
                state: state,
                zip: zip,
                nextDelivery: nextDelivery, 
                menuItem: 'delivery'
            });
        });
    }    
    if(!req.session.username){
        //The user is not logged in. Send them to the login page.
        res.redirect('/login');
    }

});

router.get('/payment', function (req, res, next){
    //If the user is logged in...
    if(req.session.username){
        Account.findOne({ "username": req.session.username}, function (err, doc, next){
            var fullName = doc.fullName ? doc.fullName : undefined;
            var address1 = doc.address1 ? doc.address1 : undefined;
            var address2 = doc.address2 ? doc.address2 : undefined;
            var city = doc.city ? doc.city : undefined;
            var state = doc.city ? doc.state : undefined;
            var zip = doc.zip ? doc.zip : undefined;
            var nextDelivery = doc.nextOrderDate ? doc.nextOrderDate : undefined
            res.render( 'payment', {
                username: req.session.username,
                fullName: fullName,
                address1: address1,
                address2: address2,
                city: city,
                state: state,
                zip: zip,
                nextDelivery: nextDelivery,
                menuItem: 'payment'
            });
        });
    }else{
        //The user is not logged in. Send them to the login page.
        res.redirect('/login');
    }    
});

router.post('/delivery', function (req, res, next){
	if(req.session.username){
            var fullName = req.body.fullName;
            var address1 = req.body.address1;
            var address2 = req.body.address2;
            var city = req.body.city;
            var state = req.body.state;
            var zip = req.body.zip;
            var nextDelivery = req.body.mdate;

			var query = {username: req.session.username};
			var update = {
				fullName: req.body.fullName,
				address1: req.body.address1,
				address2: req.body.address2,
				city: req.body.city,
				state: req.body.state,
				zip: req.body.zip,
				nextDelivery: req.body.nextDelivery
			};
			var options = {upsert: true};
			Account.findOneAndUpdate(query, update, options, function(err, account) {
			  if (err) {
			    console.log('There was an error saving your preferences. Please re-enter or send this error to our help team: ' + err );
			  }else{
			  	account.save;
			  }
			});

            //Update name, if it's set
            if(fullName){
                Account.findOneAndUpdate({"username": req.session.username}, {fullName:fullName}, {upsert: true}, function(err, account) { /*Error Handling */ });
            }
            //Update address1, if it's set
            if(address1){
                Account.findOneAndUpdate({"username": req.session.username}, {address1:address1}, {upsert: true}, function(err, account) { /*Error Handling */ });
            }
            //Update address2, if it's set        
            if(address2){
                Account.findOneAndUpdate({"username": req.session.username}, {address2:address2}, {upsert: true}, function(err, account) { /*Error Handling */ });
            }
            //Update city, if it's set        
            if(city){
                Account.findOneAndUpdate({"username": req.session.username}, {city:city}, {upsert: true}, function(err, account) { /*Error Handling */ });
            } 
            //Update state, if it's set        
            if(state){
                Account.findOneAndUpdate({"username": req.session.username}, {state:state}, {upsert: true}, function(err, account) { /*Error Handling */ });
            }        
            //Update zip, if it's set        
            if(zip){
                Account.findOneAndUpdate({"username": req.session.username}, {zip:zip}, {upsert: true}, function(err, account) { /*Error Handling */ });
            }
            //Update nextOrderDate, if it's set        
            if(nextDelivery){
                // Order.findOneAndUpdate({"username": req.session.username}, {nextOrderDate:nextDelivery}, {upsert: true}, function(err, account) { /*Error Handling */ });
                Account.findOneAndUpdate({"username": req.session.username}, {nextOrderDate:nextDelivery}, {upsert: true}, function(err, account) { /*Error Handling */ });
            }               
            //Finished updating the DB. Now render the page.loc
        //Get their account record so we can display it
            Account.findOne({ "username": req.session.username}, function (err, doc, next){
                res.render( 'payment', {
                    username : req.session.username,
                    grind: doc.grind,
                    frequency: doc.frequency,
                    pounds: doc.pounds,
                    fullName: doc.fullName,
                    address1: doc.address1,
                    address2: doc.address2,
                    city: doc.city,
                    state: doc.state,
                    zip: doc.zip,
                    nextDelivery: doc.nextOrderDate
                });
            });
    }else{
        //The user is not logged in. Send them to the login page.
        res.redirect('/login');
    }
});

router.get('/email', function (req, res, next){
	var transporter = nodemailer.createTransport({
		service: 'Gmail',
		auth: {
			user: vars.email,
			pass: vars.password
		}
	});
	var text = "This is a test email sent from my node server";
	var mailOptions = {
		from: body.req.name + '<' + body.req.email + '>',
		to: 'Robert Bunch <rdbunch@gmail.com>',
		subject: 'This is a test subject',
		text: req.body.message + ' this email is from: '
	}

	transporter.sendMail(mailOptions, function(error, info){
		if(error){
			console.log(error);
			res.json({response: error});
		}else{
			console.log("Message was successfully sent. Response was " + info.response);
			res.json({response: "success"});
		}
	})

});

router.post('/payment', function(req, res, next){
	stripe.charges.create({
	  amount: 400,
	  currency: "usd",
	  source: req.body.stripeToken, // obtained with Stripe.js
	  description: "Charge for " + req.body.stripeEmail
	}, function(err, charge) {
	  // asynchronously called
	  console.log(charge)
	  if(err){
	  	res.send('you got an error.' + err)
	  }else{
	  	res.redirect('/thankyou')
	  }
	});
});


router.get('/contact', function(req, res, next){
	res.render('contact');
});

router.get('/thankyou', function(req, res, next){
	res.render('thankyou');
});

router.get('/admin', function (req, res, next){
	if(req.session.accessLevel == "Admin"){

		Account.find({}, function (err, doc, next){
			
			res.render('admin', {accounts: doc});
		});
	}else{
		//Goodbye.
		res.redirect('/');

	}
});

module.exports = router;















