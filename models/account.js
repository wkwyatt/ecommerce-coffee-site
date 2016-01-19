var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

// Create the Schema for the users account 
var Account = new Schema({
	username: String,
	password: String,
	grind: String,
	frequency: String,
	pounds: Number,
	fullName: String,
	address1: String,
	address2: String,
	city: String,
	state: String,
	zip: Number,
	nextDelivery: String,
	accessLevel: Number
});

Account.plugin(passportLocalMongoose);

module.exports = mongoose.model('Account', Account);
