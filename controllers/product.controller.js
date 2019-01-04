var Product = require('../models/product');


//Save Products data into MongoDB
exports.save =  (req, res) =>  {
    console.log("About to save to the db");
    var product = new Product({ 
        userId:req.body.userId,
        title : req.body.title,
        category: req.body.category,
        price: req.body.price,
        description: req.body.description,
        imagePath: req.body.imagePath
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
        var isAjaxRequest = req.xhr;
        console.log('AJAX request is '+isAjaxRequest);
}

//Delete Products data from MongoDB
exports.delete = (req, res) => {
    console.log('performing delete db post');
    var id = req.body.id;
    product.deleteOne({_id: new mongodb.ObjectID(id)});
    if (err){
       throw err;
     }else{
        res.redirect('/product');
     }
     
}

//FORGOT PASSWORD
exports.forgotpassword = (req, res) => {
    console.log("Your email is " +req.body.email);
       
}

