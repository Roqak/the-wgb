var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');

const products =   require('../controllers/product.controller.js');

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

//FORGET PASSWORD
router.post('/forgotpassword', function(req, res, next) {
    var myemail =  req.body.email;
    console.log(myemail);
    console.log('post forgot pssword');
     res.render('/', {
        user: req.user
      });
 });


router.get('/forgotpassword', function(req, res, next) {
    var myemail =  req.body.email;
    console.log(req.body.email);
    console.log('foluwa is here');
     res.render('user/forgotpassword', {
        email: req.email
      });
 });



//GET PRODUCT ROUTES
router.get('/products',isLoggedIn,  function (req, res, next) { //products.findAll,
        var successMsg = req.flash('success')[0];
        Product.find(function (err, docs) {
            var productChunks = [];
            var chunkSize = 3;
            for (var i = 0; i < docs.length; i += chunkSize) {
                productChunks.push(docs.slice(i, i + chunkSize));
            }
            res.render('user/products', 
            {title: 'Wegobuyam', 
            user: req.user,
            products: productChunks,
            successMsg: successMsg, 
            noMessages: !successMsg,
            csrfToken: req.csrfToken()
            });
        });
});

router.post('/products', products.save, function (req, res, next) {
    //console.log('Post a User: ' + JSON.stringify(req.body));
    res.redirect('/products');
});
//<!--//PRODUCTS ROUTES

//GET PROFILE ROUTES
router.get('/profile', isLoggedIn, function (req, res, next) {
  var email =  req.body.email;
    Order.find({user: req.user}, function(err, orders) {
        if (err) {
            return res.write('Error!');
        }
        var cart;
        orders.forEach(function(order) {
            cart = new Cart(order.cart);
            order.items = cart.generateArray();
        });
        res.render('user/profile', { orders: orders,email:email });
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
        res.redirect('/user/profile');
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
    failureRedirect: 'user/signin',
    failureFlash: true
}), function (req, res, next) {
    console.log(req.body.email +" and " + req.body.password);
    if (req.session.oldUrl) {
        var oldUrl = req.session.oldUrl;
        req.session.oldUrl = null;
        res.redirect(oldUrl);
    } else {
        res.redirect('/user/profile');
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
    res.redirect('/user/signin');
}

function notLoggedIn(req, res, next) {
    if (!req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}
