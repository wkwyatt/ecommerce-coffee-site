var express = require('express');
var passport = require('passport');
var nodeMailer = require('nodemailer');
var stripe = require('stripe')(vars.stripeTestKey);
//Require our account.js file which resides in models one dir up
var Account = require('../models/account');
var router = express.Router();
<<<<<<< HEAD
var vars = require('../config/vars.json');
||||||| merged common ancestors
=======
var nodemailer = require('nodemailer');
var vars = require('../config/vars.json');
var stripe = require("stripe")(
  "sk_test_kRmqYSFSriTO5n2dj7CrLBRI"
);
>>>>>>> master

/* GET home page. */
router.get('/', function (req, res, next) {
    //res.send(req.session);
<<<<<<< HEAD
    res.render('index', { username : req.session.username, menuItem: "home" });
||||||| merged common ancestors
    res.render('index', { username : req.session.username });
=======
    res.render('index', { username : req.session.username, menuItem: 'welcome' });
>>>>>>> master
});

////////////////////////////////////////
////////////////REGISTER////////////////
////////////////////////////////////////

// Get the register page
router.get('/register', function(req, res) {
     if(req.session.username) {
        Account.findOne({ username: req.session.username },
            function (err, doc){
                // Ternary statement 
                // same as if / else statement evaluating 'doc.grind'
                // if true then set the value of 'currGrind' to doc.grind
                // otherwise set the value of 'currGrind' to undefined
                var currGrind = doc.grind ? doc.grind : undefined;
                var currFrequency = doc.frequency ? doc.frequency : undefined;
                var currPounds = doc.pounds ? doc.pounds : undefined;

                // Render the choices view
                res.render('choices', { 
                    username: req.session.username,
                    menuItem: "choices",
                    accessLevel: req.session.accessLevel,
                    grind: currGrind,
                    frequency: currFrequency,
                    pounds: currPounds,
                    grindSelect: [
                        { val:"extraCourse", text:"Extra Course" },
                        { val:"mediumCourse", text:"Medium Course" },
                        { val:"course", text:"Course" },
                        { val:"fine", text:"Fine" },
                        { val:"veryFine", text:"Very Fine"}
                    ]
                });
            });
     } else {
        res.render('register', { });
     }
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
<<<<<<< HEAD
            res.render('choices', { 
                username : req.session.username,
                menuItem: "choices",
                accessLevel: req.session.accessLevel,
                grindSelect: [
                    { val:"extraCourse", text:"Extra Course" },
                    { val:"mediumCourse", text:"Medium Course" },
                    { val:"course", text:"Course" },
                    { val:"fine", text:"Fine" },
                    { val:"veryFine", text:"Very Fine"}
                ] 
            });
||||||| merged common ancestors
            res.render('index', { username : req.session.username });
=======
            res.render('choices', { username : req.session.username });
>>>>>>> master
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
<<<<<<< HEAD
    res.render('login', { user : req.user });
});
||||||| merged common ancestors
    res.render('login', { user : req.user });
}).post('/login', function(req, res, next) {
=======
    res.render('login', { });
})
>>>>>>> master

<<<<<<< HEAD
router.post('/login', function (req, res, next){
    passport.authenticate('local', function (err, user, info){
        if(err){
            return next(err);
        }
||||||| merged common ancestors
    if(req.body.getStarted){
        Account.register(new Account({ username : req.body.username }), req.body.password, function(err, account) {
            if (err) {
                return res.render('register', { err : err });
            }
            if(!err)
            passport.authenticate('local')(req, res, function () {
                req.session.username = req.body.username;
                res.render('choices', { username : req.session.username });
            });
        });        
    }
=======
router.post('/login', function(req, res, next) {
>>>>>>> master

<<<<<<< HEAD
        if(!user){
            return res.redirect('login?failedlogin=1');
||||||| merged common ancestors
    if (!req.body.getStarted){
      passport.authenticate('local', function(err, user, info) {
        if (err) {
          return next(err); // will generate a 500 error
=======
      passport.authenticate('local', function(err, user, info) {
        if (err) {
          return next(err); // will generate a 500 error
>>>>>>> master
        }
        if(user){
            passport.serializeUser(function (user, done){
                done(null, user);
            });
            passport.deserializeUser(function (obj, done){
                done(null, obj);
            });
            req.session.username = user.username;
        }
        if (user){
<<<<<<< HEAD
            if(user.accessLevel == 5) { //level 5 = Admin
                req.session.accessLevel = "admin";
            }
||||||| merged common ancestors
            // Passport session setup.
            passport.serializeUser(function(user, done) {
              console.log("serializing " + user.username);
              done(null, user);
            });

            passport.deserializeUser(function(obj, done) {
              console.log("deserializing " + obj);
              done(null, obj);
            });        
=======
        	if(user.accessLevel == 5) { //level 5 = Admin
        		req.session.accessLevel = "Admin";
        	}
>>>>>>> master
            req.session.username = user.username;
        }

<<<<<<< HEAD
        return res.redirect(req.session.route ? req.session.route : '/')

    })(req, res, next);
||||||| merged common ancestors
        return res.redirect('/choices');
      })(req, res, next);
    }
=======
        return res.redirect('/choices');
      })(req, res, next);

>>>>>>> master
});

/* ---------------------------- */
/* ----------Logout----------- */
/* ---------------------------- */
router.get('/logout', function(req, res) {
    req.session.destroy();
    res.redirect('/');
});

<<<<<<< HEAD
router.get('/choices', function (req, res, next){
    //Make sure the use is logged in
    if(req.session.username) {
        // They belong here proceed with the page
        // Check and see if they have set preferences
        Account.findOne({ username: req.session.username },
            function (err, doc){
                // Ternary statement 
                // same as if / else statement evaluating 'doc.grind'
                // if true then set the value of 'currGrind' to doc.grind
                // otherwise set the value of 'currGrind' to undefined
                var currGrind = doc.grind ? doc.grind : undefined;
                var currFrequency = doc.frequency ? doc.frequency : undefined;
                var currPounds = doc.pounds ? doc.pounds : undefined;

                // Render the choices view
                res.render('choices', { 
                    username: req.session.username,
                    menuItem: "choices",
                    accessLevel: req.session.accessLevel,
                    grind: currGrind,
                    frequency: currFrequency,
                    pounds: currPounds,
                    grindSelect: [
                        { val:"extraCourse", text:"Extra Course" },
                        { val:"mediumCourse", text:"Medium Course" },
                        { val:"course", text:"Course" },
                        { val:"fine", text:"Fine" },
                        { val:"veryFine", text:"Very Fine"}
                    ]
                });
            });

    } else {
        // They shouldnt be here redirect them
        res.redirect('/');
    }

})

router.post('/choices', function (req, res, next){
    // is the person logged in
    if(req.session.username){

        var newGrind = req.body.grind;
        var newFrequency = req.body.frequency;
        var newPounds = req.body.quarterPounds;

        console.log(newGrind);
        Account.findOneAndUpdate(
            { username: req.session.username },
            { 
                grind: newGrind,
                frequency: newFrequency,
                pounds: newPounds
            }, 
            { upsert: true },
            function (err, acct){

                console.log(acct);
                console.log("======acct=====");
                console.log(newGrind);
                console.log("======grind=====");
                console.log(err);
                console.log("======err=====");
                if(err){
                    res.send("There was an error saving your preferences.  Please re-enter or send this error to your help team!");
                } else {
                    acct.save;
                    res.redirect('delivery');
                }
            });
    }
});

router.get('/delivery', function(req, res, next){
    if (req.session.username) {
        Account.findOne({ username: req.session.username },
            function (err, doc){
                var currFullName = doc.fullName ? doc.fullName : undefined;
                var currAddressOne = doc.addressOne ? doc.addressOne : undefined;
                var currAddressTwo = doc.addressTwo ? doc.addressTwo : undefined;
                var currNewCity = doc.newCity ? doc.newCity : undefined;
                var currState = doc.state ? doc.state : undefined;
                var currZipcode = doc.zipcode ? doc.zipcode : undefined;
                var currDeliveryDate = doc.deliveryDate ? doc.deliveryDate : undefined; 

                console.log(currNewCity);
                console.log("==index==");
                res.render('delivery', {
                    username: req.session.username,
                    menuItem: "delivery",
                    fullName : currFullName,
                    addressOne : currAddressOne,
                    addressTwo : currAddressTwo,
                    city : currNewCity,
                    state : currState,
                    zipcode : currZipcode,
                    deliveryDate : currDeliveryDate
    
                });
            });
    } else {
        res.redirect("/");
    }

}); 

router.post('/delivery', function (req, res, next){
    if (req.session.username) {
        var fullName = req.body.name;
        var addressOne = req.body.address1;
        var addressTwo = req.body.address2;
        var newCity = req.body.city;
        var state = req.body.state;
        var zipcode = req.body.zip;
        var deliveryDate = req.body.deliveryDate 

        console.log(fullName);
        console.log("===fullname===");
        Account.findOneAndUpdate(
            { username: req.session.username },
            { 
                fullName : fullName,
                addressOne : addressOne,
                addressTwo : addressTwo,
                newCity : newCity,
                state : state,
                zipcode : zipcode,
                deliveryDate : deliveryDate
            }, 
            { upsert: true },
            function (err, acct){
                if(err){
                    res.send("There was an error saving your preferences.  Please re-enter or send this error to your help team!");
                } else {
                    acct.save;
                    res.redirect('/payment');
                }
        });
    } else {
        res.redirect('/');
    }
});

router.get('/myaccount', function (req, res, next){
    if (req.session.username) {
        Account.findOne({ username: req.session.username },
            function (err, doc){
                var currFullName = doc.fullName ? doc.fullName : undefined;
                var currAddressOne = doc.addressOne ? doc.addressOne : undefined;
                var currAddressTwo = doc.addressTwo ? doc.addressTwo : undefined;
                var currNewCity = doc.newCity ? doc.newCity : undefined;
                var currState = doc.state ? doc.state : undefined;
                var currZipcode = doc.zipcode ? doc.zipcode : undefined;
                var currDeliveryDate = doc.deliveryDate ? doc.deliveryDate : undefined; 
                var currGrind = doc.grind ? doc.grind : undefined;
                var currFrequency = doc.frequency ? doc.frequency : undefined;
                var currPounds = doc.pounds ? doc.pounds : undefined;

                res.render('account', {
                    username: req.session.username,
                    fullName : currFullName,
                    addressOne : currAddressOne,
                    addressTwo : currAddressTwo,
                    city : currNewCity,
                    state : currState,
                    zipcode : currZipcode,
                    deliveryDate : currDeliveryDate,
                    grind: currGrind,
                    frequency: currFrequency,
                    pounds: currPounds
                });
            });
    } else {
        res.redirect("/");
    }
})

router.get('/payment', function (req, res, next){
    if (req.session.username) {
        Account.findOne({ username: req.session.username },
            function (err, doc){
                var currFullName = doc.fullName ? doc.fullName : undefined;
                var currAddressOne = doc.addressOne ? doc.addressOne : undefined;
                var currAddressTwo = doc.addressTwo ? doc.addressTwo : undefined;
                var currNewCity = doc.newCity ? doc.newCity : undefined;
                var currState = doc.state ? doc.state : undefined;
                var currZipcode = doc.zipcode ? doc.zipcode : undefined;
                var currDeliveryDate = doc.deliveryDate ? doc.deliveryDate : undefined; 
                var currGrind = doc.grind ? doc.grind : undefined;
                var currFrequency = doc.frequency ? doc.frequency : undefined;
                var currPounds = doc.pounds ? doc.pounds : undefined;

                if (currFullName && currAddressOne && currAddressTwo && currNewCity && currState && currZipcode && currDeliveryDate && currGrind && currFrequency && currPounds) {
                    var paymentReady = true;
                }

                req.session.orderAmount = 4500
                req.session.orderAmountDec = 45.00
                res.render('payment', {
                    username: req.session.username,
                    menuItem: "payment",
                    fullName : currFullName,
                    addressOne : currAddressOne,
                    addressTwo : currAddressTwo,
                    city : currNewCity,
                    state : currState,
                    zipcode : currZipcode,
                    deliveryDate : currDeliveryDate,
                    grind: currGrind,
                    frequency: currFrequency,
                    pounds: currPounds,
                    orderAmount: req.session.orderAmount,
                    orderAmountDec: req.session.orderAmountDec,
                    ready: paymentReady
                });
            });
    } else {
        res.redirect("/");
    }
});

||||||| merged common ancestors
=======
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
>>>>>>> master

<<<<<<< HEAD
router.post('/payment', function (req, res, next){
    // res.json(req.body);
||||||| merged common ancestors
=======
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
>>>>>>> master

    stripe.charges.create({
        amount: req.session.orderAmount,
        currency: "usd",
        source: req.body.stripeToken,
        description: "Charge for " + req.body.stripeEmail
    }, function (err, charge){
        console.log(charge);
        if(err) {
            res.send("you got an error " + err);
        } else {
            res.redirect('/thankyou');
        }
    })
});

router.get('/email', function (req, res, next){
    var transporter = nodeMailer.createTransport({
        service: 'Gmail',
        auth: {
            user: vars.email,
            pass: vars.password
        }
    });
    var text = "test email"
    var mailOptions = {
        from: "William Wyatt <wkwyatt1@gmail.com>",
        to: "Will Wyatt <wyatt_william@columbusstate.edu>",
        subject: "this is a subject",
        text: text
    }

    transporter.sendMail(mailOptions, function (error, info){
        if (error) {
            console.log(error);
            res.json({response: error});
        } else {
            console.log("Messages was successfully sent.  Message was " + info.response);
            res.json({response: "success"});
        }
    })
});


router.get('/contact', function (req, res, next) {
    res.render("contact");
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















