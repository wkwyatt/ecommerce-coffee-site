var express = require('express');
var passport = require('passport');
var nodeMailer = require('nodemailer');
var stripe = require('stripe')("sk_test_ZTHgOGDFSTgCoyatqVuVD0PS");
//Require our account.js file which resides in models one dir up
var Account = require('../models/account');
var router = express.Router();
var vars = require('../config/vars.json');

/* GET home page. */
router.get('/', function (req, res) {
    //res.send(req.session);
    res.render('index', { username : req.session.username, menuItem: "home" });
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
    Account.register(new Account({ username : req.body.username }), req.body.password, function(err, account) {
        if (err) {
            return res.render('register', { err : err });
        }
        passport.authenticate('local')(req, res, function () {
            req.session.username = req.body.username;
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

router.post('/login', function (req, res, next){
    passport.authenticate('local', function (err, user, info){
        if(err){
            return next(err);
        }

        if(!user){
            return res.redirect('login?failedlogin=1');
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
            if(user.accessLevel == 5) { //level 5 = Admin
                req.session.accessLevel = "admin";
            }
            req.session.username = user.username;
        }

        return res.redirect(req.session.route ? req.session.route : '/')

    })(req, res, next);
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


router.post('/payment', function (req, res, next){
    // res.json(req.body);

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
