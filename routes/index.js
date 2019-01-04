var express = require('express');
var router = express.Router();
var passport = require('passport');
var csrf = require('csurf');
var bodyParser = require('body-parser');

var products =   require('../controllers/product.controller.js');

var Cart = require('../models/cart');
var Product = require('../models/product');
var Order = require('../models/order');


var csrfProtection = csrf();
router.use(csrfProtection);



/* GET home page. */
router.get('/', function (req, res, next) {
    var successMsg = req.flash('success')[0];
    Product.find(function (err, docs) {
        var productChunks = [];
        var chunkSize = 3;
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

//GET PRODUCT ROUTES
router.get('/products' ,isLoggedIn, function (req, res, next) { 
    var user = req.user.email;
    var isAjaxRequest = req.xhr;
    console.log(isAjaxRequest);
    /*
    var successMsg = req.flash('success')[0];
    Product.find({user:req.user},function (err, docs) {
        var productChunks = [];
        var chunkSize = 3;
        for (var i = 0; i < docs.length; i += chunkSize) {
            productChunks.push(docs.slice(i, i + chunkSize));
        }
        res.render('user/products', 
        {title: 'Wegobuyam', 
        user: user,
        docs:docs,
        products: productChunks,
        successMsg: successMsg, 
        noMessages: !successMsg,
        csrfToken: req.csrfToken()
        });
    });*/
    /*
    var successMsg = req.flash('success')[0];
    Product.find({user:req.user}, function(err,orders){
        var productChunks = [];
            var chunkSize = 3;
            for (var i = 0; i < orders.length; i += chunkSize) {
                productChunks.push(orders.slice(i, i + chunkSize));
            }
            res.render('user/products', 
            {title: 'Wegobuyam', 
            user: req.user,
            orders:orders,
            successMsg: successMsg, 
            noMessages: !successMsg,
            csrfToken: req.csrfToken()
            });

    });*/
   /* Product.find({user:req.user}, function(err,orders){
        if(err){
            return res.write('Error!');
        }
        var product;
        products.forEach(function(order){
            product = new Product(order.product);
            order.items = product.generateArray();
        });
        res.render('user/products', 
            {title: 'Wegobuyam', 
            user: req.user,
            orders:orders,
            successMsg: successMsg, 
            noMessages: !successMsg,
            csrfToken: req.csrfToken()
            });

    });*/

        var successMsg = req.flash('success')[0];
        Product.find(function (err, docs) {
            var productChunks = [];
            var chunkSize = 3;
            for (var i = 0; i < docs.length; i += chunkSize) {
                productChunks.push(docs.slice(i, i + chunkSize));
            }
            res.render('user/products', 
            {title: 'Wegobuyam', 
            user: req.user.email,
            products: productChunks,
            successMsg: successMsg, 
            noMessages: !successMsg,
            csrfToken: req.csrfToken()
            });
        });
});

router.post('/products', products.save, function(req, res) {
    var user = req.user.email;
    // var isAjaxRequest = req.xhr;
    // console.log(isAjaxRequest);
    console.log('Post a User: ' + JSON.stringify(req.body));
    // res.redirect('/products',{user: user});
    res.json({'msg':'lll'}).status(200);
});
//<!--//PRODUCTS ROUTES

/////
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


  ////DELETE
  router.get('/delete/:id', function(req, res, next) {//products.delete,
    console.log(req.params.id);
    product.deleteOne({ _id: req.params.id })
    .then(() => {
        res.json({ success: true });
    })
    .catch(err => {
        res.status.json({ err: err });
    });
   // console.log('performing delete db post');
    //res.redirect('/product');
   // var id = req.query.id;
    /*MongoClient.connect(dburl, function(err, db) {
      if(err) { throw err;  }
  
      db.collection('Products', function(err, products) {
        Products.deleteOne({_id: new mongodb.ObjectID(id)});
        if (err){
           throw err;
         }else{
            db.close();
            res.redirect('/');
         }
      });
    });*/
  });
  

//GET PROFILE ROUTES
router.get('/profile', isLoggedIn, function (req, res, next) {
  var email =  req.body.email;
  var user = req.user.email;
  console.log(email);
    Order.find({user: req.user}, function(err, orders) {
        if (err) {
            //return res.write('Error!');
            console.log('Error!');
        }
        var cart;
        orders.forEach(function(order) {
            cart = new Cart(order.cart);
            order.items = cart.generateArray();
        });
        res.render('user/profile', {  user: user,orders: orders,email:email});
    });
});

router.get('/forgotpassword', function (req, res, next) {
    var messages = req.flash('error');
     res.render('forgotpassword', {
        csrfToken: req.csrfToken(), 
        user: req.user,
        messages: messages, 
        hasErrors: messages.length > 0});
});

router.post('/forgotpassword', products.forgotpassword, function(req, res, next) {
    res.render('forgotpassword');
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
