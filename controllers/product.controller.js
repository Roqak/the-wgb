
var nodemailer = require('nodemailer');
var xoauth2 = require('xoauth2');
var async = require('async');
var crypto = require('crypto');

var mg = require('nodemailer-mailgun-transport');
var mailgun = require("mailgun-js");

var User = require('../models/user');
var Product = require('../models/product');
/*
var api_key = 'key-57acc0fbdf82015e361cef16949c1036';
var DOMAIN = 'erlaters.com';*/

var api_key = 'key-bcc482230a149b0cfffa03ff651c03fb'; 
var DOMAIN = 'sandboxaec16ef9281b4e41b54638f09a5b8ab4.mailgun.org';
var mailgun = require('mailgun-js')({apiKey: api_key, domain: DOMAIN});


//Save Products data into MongoDB
exports.save =  (req, res,next) =>  {
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
            next();
            }).catch(err => {
            res.status(500).send({
            message: err.message
          });
        });
};


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

