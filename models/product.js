var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({ 
	user: {type: Schema.Types.ObjectId, ref: 'User'},
    email: {type: String, required: true},
    product_name: {type: String, required: true}, 
    product_category: {type: String, required: true},
    product_price: {type: Number, required: true},
    product_description: {type: String, required: true},
    status: {type: String, required: true}, 
    state: {type: String, required: true}, 
    lga: {type: String, required: true}, 
    whatsapp_num: {type: String, required: true}, 
    date_created: {type: String, required: true}
});

module.exports = mongoose.model('Product', schema);