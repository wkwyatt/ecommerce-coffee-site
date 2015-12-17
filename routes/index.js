var express = require('express');
var passport = require('passport');
var nodeMailer = require('nodemailer');
//Require our account.js file which resides in models one dir up
var Account = require('../models/account');
var router = express.Router();
var vars = require('../config/vars.json');

/* GET home page. */
router.get('/', function (req, res) {
    //res.send(req.session);
    res.render('index', { username : req.session.username });
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
    Account.register(new Account({ username : req.body.username }), req.body.password, function(err, account) {
        if (err) {
            return res.render('register', { err : err });
        }
        passport.authenticate('local')(req, res, function () {
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
    res.render('login', { user : req.user });
});

router.post('/login', function(req, res, next) {

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

    if (!req.body.getStarted){
      passport.authenticate('local', function(err, user, info) {
        if (err) {
          return next(err); // will generate a 500 error
        }
        // Generate a JSON response reflecting authentication status
        if (! user) {
          return res.redirect('/login?failedlogin=1');
        }
        if (user){
            // Passport session setup.
            passport.serializeUser(function(user, done) {
              console.log("serializing " + user.username);
              done(null, user);
            });

            passport.deserializeUser(function(obj, done) {
              console.log("deserializing " + obj);
              done(null, obj);
            });        
            req.session.username = user.username;
        }

        return res.redirect('/choices');
      })(req, res, next);
    }
});

/* ---------------------------- */
/* ----------Logout----------- */
/* ---------------------------- */
router.get('/logout', function(req, res) {
    req.session.destroy();
    res.redirect('/');
});

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
    res.render('payment');
});

router.get('/email', function (req, res, next){
    var transporter = nodeMailer.createTransport({
        service: 'Gmail',
        auth: {
            user: vars.email,
            pass: vars.password
        }
    })
})
module.exports = router;
