var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Order = new Schema({
	username: String,
	nextDelivery: String,
	shippingStatus: String,
	paymentStatus: String,
	pounds: Number,
	grind: String
});

module.exports = mongoose.model('Order', Order);
