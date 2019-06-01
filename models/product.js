var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({ 
	user: {type: Schema.Types.ObjectId, ref: 'User'},
    email: {type: String, required: true},
    productName: {type: String, required: true}, 
    productCategory: {type: String, required: true},
    productPrice: {type: Number, required: true},
    productDescription: {type: String, required: true},
    productImage: {type: Number, required: true},
    productStatus: {type: String, required: true},  
    date_created: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Product', schema); 