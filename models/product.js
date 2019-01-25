var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({ 
    userId: {type: String, required: true},
    user : {type: Schema.Types.ObjectId,ref: 'Product'},
    title: {type: String, required: true},
    category: {type: String, required: true},
    price: {type: Number, required: true},
<<<<<<< HEAD
    description: {type: String, required: true},
   // imagePath: {type: String, required: true}
=======
    description: {type: String, required: true}
    // imagePath: {type: String, required: true}
>>>>>>> a439b0a35e08b418540f8311b7186442ad05ece9
});

module.exports = mongoose.model('Product', schema);