var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

// Create the Schema for the users account 
var Account = new Schema({
	username: String,
<<<<<<< HEAD
	password: String,
	grind: String,
	frequency: String,
	pounds: Number,
	fullName: String,
	addressOne: String,
	addressTwo: String,
	newCity: String,
	state: String,
	zipcode: Number,
	deliveryDate: String
||||||| merged common ancestors
	password: String
=======
	password: String,
	grind: String,
	pounds: String,
	frequency: String,
	fullName: String,
	address1: String,
	address2: String,
	city: String,
	state: String,
	zip: String,
	nextDelivery: String,
	accessLevel: Number
>>>>>>> master
});

Account.plugin(passportLocalMongoose);

module.exports = mongoose.model('Account', Account);
