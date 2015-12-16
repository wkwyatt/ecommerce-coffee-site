var express = require('express');
var passport = require('passport');
//Require our account.js file which resides in models one dir up
var Account = require('../models/account');
var router = express.Router();

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

    res.render("delivery");

}); 

module.exports = router;
