var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

// Create the Schema for the users account 
var Account = new Schema({
	username: String,
	password: String,
	grind: String,
	frequency: String,
	pounds: Number
});

Account.plugin(passportLocalMongoose);

module.exports = mongoose.model('Account', Account);
