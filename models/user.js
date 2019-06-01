var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var userSchema = new Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    resetPasswordToken: {type: String},
    resetPasswordExpires: {type: Date},
    firstname: {type: String, required: true},
    lastname: {type: String, required: true},
    whatsappNumber: {type: Number, required: true, unique: true},
    state: {type: String, required: true},
    lga: {type: String, required: true},
    serviceType: {type: String, required: true}

});

//OLD CODE
userSchema.methods.encryptPassword = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);  
};

userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);  
};

/*
userSchema.pre('save', function(next) {
  var user = this;
  var SALT_FACTOR = 5;

  if (!user.isModified('password')) return next();

  bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};
*/
module.exports = mongoose.model('User', userSchema);