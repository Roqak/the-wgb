var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');

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
router.get('/forgotpassword', function(req, res, next) {
    var myemail =  req.body.email;
    console.log(req.body.email);
    console.log('foluwa is here');
     res.render('user/forgotpassword', {
        user: req.user
      });
 });

//<!--PRODUCTS ROUTES
//THIS IS A TEST NOT WORKING YET, YOU  CAN DELETE OR IGNORE IT
/*router.get('/products',isLoggedIn,  function (req, res, next) { 
    Product.find({},function (err, products) {
        if(err){
            return res.write('Error');
        }
        var product;
        products.forEach(function(order){
            product = new Product(product.products);
            order.items = product.generateArray();
        });
        res.render('user/products', {orders:order,            
            user: req.user,
            products: productChunks,
            successMsg: successMsg, 
            noMessages: !successMsg,
            csrfToken: req.csrfToken()});
    });
});*/
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

router.post('/products', function (req, res, next) {
    console.log('Post a User: ' + JSON.stringify(req.body));
    console.log('Product: ' +''+ req.body.title +''+ req.body.description +''+ req.body.price);
	
    // Create a Customer
    var product = new Product({ 
        title : req.body.title,
        category: req.body.category,
        price: req.body.price,
        description: req.body.description
    });
 
    // Save a Product in the MongoDB
    product.save()
    .then(data => {
        //res.send(data);
        console.log('Product Created successfully');
    }).catch(err => {
        res.status(500).send({
            message: err.message
        });
    });

    res.render('user/products');
});
//<!--//PRODUCTS ROUTES

//GET PROFILE ROUTES
router.get('/profile', isLoggedIn, function (req, res, next) {
    Order.find({user: req.user}, function(err, orders) {
        if (err) {
            return res.write('Error!');
        }
        var cart;
        orders.forEach(function(order) {
            cart = new Cart(order.cart);
            order.items = cart.generateArray();
        });
        res.render('user/profile', { orders: orders });
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
