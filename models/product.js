var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({ 
    userId: {type: String, required: true},
    user : {type: Schema.Types.ObjectId,ref: 'Product'},
    title: {type: String, required: true},
    category: {type: String, required: true},
    price: {type: Number, required: true},
    description: {type: String, required: true}
    // imagePath: {type: String, required: true}
});

module.exports = mongoose.model('Product', schema);