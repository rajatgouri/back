const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const vehicle = require('./Vehicle');

const ClientSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    trim: true,
  },
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  role: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  emailOtp :{
    type: String,
  },
  phoneOtp :{
    type: String,
  },
  isNumberVerified: {
    type: Boolean,
    required: true,
  },
  isIdSubmitted: {
    type: Boolean,
    required: true,
  },
  isEmailVerified: {
    type: Boolean,
    required: true,
  },
  isIdApproved: {
    type: Boolean,
    required: true,
  },
  profilePicture: {
    type: String,
    required: true,
  },
  rejected: {
    type: Boolean,
  },
  frontId: {
    type: String,
    required: true,
  },
  backId: {
    type: String,
    required: true,
  },
  vehicles: [
    vehicle
  ]
});

ClientSchema.pre('save', function (next) {
  const user = this;

  if (!user.isModified('password')) return next();

  bcrypt.genSalt(10, function (err, salt) {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);

      user.password = hash;
      next();
    });
  });
});

ClientSchema.methods.comparePassword = function (candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

ClientSchema.virtual('_password')
  .set(function (_password) {
    this.password = _password;
    bcrypt.genSalt(10, function (err, salt) {
      if (err) return;
      else {
        bcrypt.hash(this.password, salt, function (err, hash) {
          if (err) return;
          else {
            this.password = hash;
          }
        });
      }
    });
  })
  .get(function () {
    return this.password;
  });

module.exports = mongoose.model('Users', ClientSchema);
