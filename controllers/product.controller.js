var async = require('async');
var crypto = require('crypto');
var multer = require('multer');
var mg = require('nodemailer-mailgun-transport');
var mailgun = require("mailgun-js");
var User = require('../models/user');
var cloudinary = require('cloudinary');
var Product = require('../models/product');


// var api_key = 'key-bcc482230a149b0cfffa03ff651c03fb'; 
// var DOMAIN = 'sandboxaec16ef9281b4e41b54638f09a5b8ab4.mailgun.org';
// var mailgun = require('mailgun-js')({apiKey: api_key, domain: DOMAIN});


//Save Products details into DB
exports.save =  (req, res,next) =>  {
  
      console.log("POST: About to save new product");
      var price = req.body.productPrice;
      var price2 = req.user.productPrice;
      console.log(price + ' and ' + price2);

      var product = new Product({ 
            email:req.body.email,
            productName : req.body.productName,
            productCategory: req.body.productCategory,
            productPrice: req.body.productPrice,
            productDescription: req.body.productDescription,
            productImage: req.body.productImage,
            productStatus: req.body.productStatus
        });
      console.log(product);
        product.save()
        .then(data => {
                console.log('Saving to database');
                console.log(data);
                console.log('Product Created successfully');
                next();
                }).catch(err => {
                res.status(200).send({
                message: err.message,
                csrfToken: req.csrfToken()
            });
            })
            .catch((error)=>{
              console.log(error);
            });
};

//Save Products details into DB
exports.saveUserData =  (req, res,next) =>  {
    var userData = new User({
          //userId:req.body.userId,
          email:req.body.email,
          product_name : req.body.title,
          product_category: req.body.category,
          product_price: req.body.price,
          product_description: req.body.description,
          status: req.body.status,
          state: req.body.state,
          lga: req.body.lga,
          whatsapp_num: req.body.whatsapp_num
    });
    console.log(userData);
    userData.save()
        .then(data => {
            console.log('Saving to database');
            //res.send(data);
            console.log('Product Created successfully');
            next();
            }).catch(err => {
            res.status(500).send({
            message: err.message,
            csrfToken: req.csrfToken()
        });
        })
        .catch((uploaderror)=>{
          console.log(uploaderror);
        });
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
     
};

//FORGOT PASSWORD
exports.forgotpassword = (req, res) => {
    console.log("Sending email to " +req.body.email);
    //
    async.waterfall([
      function(done) {
        crypto.randomBytes(20, function(err, buf) {
          var token = buf.toString('hex');
          done(err, token);
        });
      },
      function(token, done) {
        User.findOne({ email: req.body.email }, function(err, user) {
          if (!user) {
            req.flash('error', 'No account with that email address exists.');
            return res.redirect('/forgot');
          }
          user.resetPasswordToken = token;
          user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
          console.log(user.resetPasswordToken);
  
          user.save(function(err) {
            done(err, token, user);
          });
        });
      },
  
  
      function(token, user, done){
          var data = {
            from: 'moronfoluwaakintola@gmail.com', //contact@erlaters.com
            to: user.email,
            subject: 'Whogobuyam Password Reset',
            text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                'https://' + req.headers.host + '/reset/' + token + '\n\n' +
                'If you did not request this, please ignore this email and your password will remain unchanged.\n'
          };
  
          mailgun.messages().send(data, function (error, body) {
            console.log(body);
            req.flash('success', 'A Password reset mail has been sent to your email address');
            res.redirect('/signin');
          });
      }
    ], function(err) {
      if (err) return next(err);
      res.redirect('/forgot');
    });
};

