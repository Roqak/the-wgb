var express = require('express');
var router = express.Router();
var passport = require('passport');
var csrf = require('csurf');
var cloudinary = require('cloudinary');
var bodyParser = require('body-parser');

var products =   require('../controllers/product.controller.js');
var Cart = require('../models/cart');
var Product = require('../models/product');
// var Order = require('../models/order');
var User = require('../models/user');


var csrfProtection = csrf();
router.use(csrfProtection);

/* GET home page. */
router.get('/', function (req, res, next) {
    var successMsg = req.flash('success')[0];
    Product.find(function (err, docs) {
        var productChunks = [];
        var chunkSize = 300;
        for (var i = 0; i < docs.length; i += chunkSize) {
            productChunks.push(docs.slice(i, i + chunkSize));
        }
        res.render('shop/index', 
        {title: 'Wegobuyam', 
        user: req.user,
        products: productChunks,
         successMsg: successMsg, 
         noMessages: !successMsg
        });
    });
});

//
router.get('/dashboard', isLoggedIn, function (req, res, next) {
        console.log("dashboard page");
        var successMsg = req.flash('success')[0];

        var user = req.user.email  || "";
        var name = req.user.name  || "";

        var productChunks = [];    
        Product.find({email: user}).then((result) => {
          if(result){
          for (var i = 0; i < result.length; i++) {
               productChunks.push([result[i]]);
              }
          }

        res.render('user/dashboard',{ 
                    user: req.user.email,
                    products: productChunks,
                    csrfToken: req.csrfToken(),
                    name:name 
            });     
        });

     });


//
router.post('/dashboard', products.save, function(req, res,next) {});




router.post('/edit', function(req, res, next) {
    console.log('performing edit db post');
    MongoClient.connect(dburl, function(err, db) {
      if(err) { throw err;  }
      var collection = db.collection('products');
      var product = {'product_name': req.body.product_name, 'price': req.body.price, 'category': req.body.category};
      collection.update({'_id':new mongodb.ObjectID(req.body.id)}, {$set:{'product_name': req.body.product_name, 'price': req.body.price, 'category': req.body.category}}, function(err, result) {
      if(err) { throw err; }
        db.close();
        res.redirect('/products');
       });
    });
  });


// //UPDATE USER INFO
// router.post('/update-user', function(req, res) {
    console.log('performing edit db post');

//     var userData = new User({
//           //userId:req.body.userId,
//           email:req.body.email,
//           product_name : req.body.title,
//           product_category: req.body.category,
//           product_price: req.body.price,
//           product_description: req.body.description,
//           status: req.body.status,
//           state: req.body.state,
//           lga: req.body.lga,
//           whatsapp_num: req.body.whatsapp_num
//     });
//     console.log(userData);
//     userData.save()
//         .then(data => {
//             console.log('Saving to database');
//             //res.send(data);
//             console.log('Product Created successfully');
//             next();
//             }).catch(err => {
//             res.status(500).send({
//             message: err.message,
//             csrfToken: req.csrfToken()
//         });
//         })
//         .catch((uploaderror)=>{
//           console.log(uploaderror);
//         });
//     // var user = req.user.email;
//     // console.log('Post a User: ' + JSON.stringify(req.body));
//     // // res.redirect('/products',{user: user});
//     // res.json({'msg':'lll'}).status(200);
// });


//GET USER STORE
//SIMILAR TO USER ACCOUNT
router.get('/store/:id/:_id', function (req, res, next) {
    var messages = req.flash('error');
   // console.log('PARAMATER '+req.params.id +''+ _id);

    console.log('PARAMATERS '+req.params._id+' and '+req.params.id);
    var email = req.params.id
    var itemId = req.params._id

    var productChunks = [];
    Product.find({'_id':itemId}).then((result) => {
        if(result){
          for (var i = 0; i < result.length; i++) {
            productChunks.push([result[i]]);
          }
        }

    //LAST 3 PRODUCTS POSTED BY USER
        var lastProducts = [];
    Product.find({'email':req.params.id}).then((result) => {
        if(result){
          for (var i = 0; i < result.length; i++) {
            lastProducts.push([result[i]]);
          }
        }
                
    res.render('user/store', {
        csrfToken: req.csrfToken(), 
        user: req.user,
        products: productChunks,
        recents: lastProducts
    });
});
});
    });


  ////DELETE
  router.get('/delete/:id', function(req, res) {//products.delete,
    console.log(req.params.id);
    Product.deleteOne({ _id: req.params.id })
    .then(() => {
        res.json({ success: true });
    })
    .catch(err => {
        res.status.json({ err: err });
    });
  });
  
  //FORGET PASSWORD ROUTE
router.get('/forgotpassword', function (req, res, next) {
    var messages = req.flash('error');
     res.render('forgotpassword', {
        csrfToken: req.csrfToken(), 
        user: req.user,
        messages: messages, 
        hasErrors: messages.length > 0});
});



//
router.post('/add-product',isLoggedIn, function(req, res, next) {
    res.render('forgotpassword',{user:req.user});
});


router.post('/forgotpassword', products.forgotpassword, function(req, res, next) {
    console.log('Post a User: ' + JSON.stringify(req.body));
    res.render('forgotpassword',{user:req.user});
});

router.get('/reset/:token', function(req, res) {
    User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
      if (!user) {
        req.flash('error', 'Password reset token is invalid or has expired.');
        return res.redirect('/forgot');
      }
      res.render('user/reset', {user: req.user, csrfToken: req.csrfToken()});
    });
});

router.post('/reset/:token', function(req, res) {
    async.waterfall([
      function(done) {
        User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
          if (!user) {
            req.flash('error', 'Password reset token is invalid or has expired.');
            return res.redirect('back');
          }
  
          user.password = req.body.password;
          user.resetPasswordToken = undefined;
          user.resetPasswordExpires = undefined;
  
          user.save(function(err) {
            req.logIn(user, function(err) {
              done(err, user);
            });
          });
        });
      },
      function(user, done) {
        var smtpTransport = nodemailer.createTransport('SMTP', {
            service: 'SendGrid',
            auth: {
              user: 'moronfoluwaakintola@gmail.com',
              pass: 'Moronfoluwa@2020'
            }
        });
        var mailOptions = {
          to: user.email,
          from: 'moronfoluwaakintola@gmail.com',
          subject: 'Your password has been changed',
          text: 'Hello,\n\n' +
            'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
        };
        smtpTransport.sendMail(mailOptions, function(err) {
          req.flash('success', 'Success! Your password has been changed.');
          done(err);
        });
      }
    ], function(err) {
      res.redirect('/');
    });
  });

//
router.get('/stocks', function(req, res) {
    //var user = req.user.email;
    var isAjaxRequest = req.xhr;
    console.log(isAjaxRequest);
        var successMsg = req.flash('success')[0];
        var productChunks = [];
        Product.find().then((result)=>{
            if(result){
                     for (var i = 0; i < result.length; i++) {
                // productChunks.push(result[i]);
                productChunks.push([result[i]]);
            }
                // res.send({productChunks})
                // console.log(result[0].userId)
     res.render('user/stocks', 
            {title: 'Wegobuyam', 
            products: productChunks,
            successMsg: successMsg, 
            noMessages: !successMsg
            });
            }
        }).catch((err)=>{
            console.log("Error ",err);
        });
});

router.get('/stocks/:id', function(req, res){
    console.log('Your parameters are ' + req.params.id);
    var successMsg = req.flash('success')[0];
    var productChunks = [];
    Product.find({ productCategory: req.params.id}).then((result)=>{
        if(result){
            for (var i = 0; i < result.length; i++) {
            // productChunks.push(result[i]);
            productChunks.push([result[i]]);
        }
        res.render('user/stocks', 
            {title: 'Wegobuyam', 
            user: req.user.email,
            products: productChunks,
            successMsg: successMsg, 
            noMessages: !successMsg
            });
            }
        }).catch((err)=>{
            console.log("Error ",err);
        });

});

router.get('/search', function(req, res){
    console.log('Your search is ' + req.query.search);
    var successMsg = req.flash('success')[0];
    var productChunks = [];
    Product.find({ category: req.query.search}).then((result)=>{
        if(result){
                 for (var i = 0; i < result.length; i++) {
            // productChunks.push(result[i]);
            productChunks.push([result[i]]);
            console.log(result[i]);
        }
        res.render('user/stocks',
            {title: 'Wegobuyam', 
            // user: req.user.email,
            user: req.query.search,
            products: productChunks,
            successMsg: successMsg, 
            noMessages: !successMsg
            });
            }
        }).catch((err)=>{
            console.log("Error ",err);
        });

});



router.get('/help', function(req, res) {
    res.render('user/help');
});


router.get('/jsonproducts', function (req, res, next) {
    var successMsg = req.flash('success')[0];
    Product.find(function (err, docs) {
        var productChunks = [];
        var chunkSize = 3;
        for (var i = 0; i < docs.length; i += chunkSize) {
            productChunks.push(docs.slice(i, i + chunkSize));
        }
        res.send (JSON.stringify(
            {
                title: 'Wegobuyam', 
            user: req.user,
            products: productChunks,
             successMsg: successMsg, 
             noMessages: !successMsg
            }));
        /*JSON.stringify(
        {
            title: 'Wegobuyam', 
        user: req.user,
        products: productChunks,
         successMsg: successMsg, 
         noMessages: !successMsg
        }));*/
    });
});


//GET LOGOUT ROUTES
router.get('/logout', isLoggedIn, function (req, res, next) {
    req.logout();
    res.redirect('/');
});

router.use('/', notLoggedIn, function (req, res, next) {
    next();
});


//GET SIGNUP ROUTES
router.get('/signup', function (req, res, next) {
    var messages = req.flash('error');
    res.render('user/signup', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
});


//POST SIGNUP ROUTES
router.post('/signup', passport.authenticate('local.signup', {
    failureRedirect: '/signup', //**/user/signup */
    failureFlash: true
}), function (req, res, next) {
    if (req.session.oldUrl) {
        var oldUrl = req.session.oldUrl;
        req.session.oldUrl = null;
        res.redirect(oldUrl);
    } else {
        res.redirect('/profile');
    }
});

//GET SIGNIN ROUTES
router.get('/signin', function (req, res, next) {
    var messages = req.flash('error'); res.render('user/signin', {
        csrfToken: req.csrfToken(), 
        user: req.user,
        messages: messages, 
        hasErrors: messages.length > 0});
});

//POST SIGNIN ROUTES
router.post('/signin', passport.authenticate('local.signin', {
    failureRedirect: '/signin',
    failureFlash: true
}), function (req, res, next) {
    console.log(req.body.email +" and " + req.body.password);
    if (req.session.oldUrl) {
        var oldUrl = req.session.oldUrl;
        req.session.oldUrl = null;
        res.redirect(oldUrl);
    } else {
        res.redirect('/profile');
    }
});


//ERROR 404 ROUTES
router.get('*', function(req, res, next) {
    res.render('error');
});

module.exports = router;

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.session.oldUrl = req.url;
    res.redirect('/signin');
}

function notLoggedIn(req, res, next) {
    if (!req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}