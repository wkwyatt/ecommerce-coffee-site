var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var Account = new Schema({
	username: String,
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
});

Account.plugin(passportLocalMongoose);

module.exports = mongoose.model('Account', Account);
