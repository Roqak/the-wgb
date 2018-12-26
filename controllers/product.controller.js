var Product = require('../models/product');


// Fetch all Users
exports.findAll = (req, res) =>  {
	console.log("Fetch all Users");
	
    Product.find()
    .then(products => {
        res.send(products);
    }).catch(err => {
        res.status(500).send({
            message: err.message
        });
    });
};