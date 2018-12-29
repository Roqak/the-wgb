var Product = require('../models/product');


//Save Products data into MongoDB
exports.save =  (req, res) =>  {
    console.log("About to save to the db");
    var product = new Product({ 
        title : req.body.title,
        category: req.body.category,
        price: req.body.price,
        description: req.body.description
    });
    product.save()
    .then(data => {
    console.log('Saving to database');
    //res.send(data);
    console.log('Product Created successfully');
    }).catch(err => {
    res.status(500).send({
        message: err.message
    });
});
res.direct('/products');
}

