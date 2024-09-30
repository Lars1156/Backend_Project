const mongoose = require('mongoose');
const {isEmail}= require ('validator');
const bcrypt = require('bcryptjs')
const userSchema = new mongoose.Schema(
  {
    userName:{
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
          validator: isEmail,
          message: 'Please enter a valid email address',
        },
      },
      password: {
        type: String,
        required: true,
        minlength: 8, // Minimum length for password
        validate: {
          validator: function(v) {
            return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(v);
          },
          message: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
        },
      },
    }, {
      timestamps: true,
  }
);

userSchema.pre('save', async function(next) {
    const user = this;
    if (!user.isModified('password')) return next(); // Only hash the password if it has been modified
    try {
      const salt = await bcrypt.genSalt(10); // Generate a salt
      user.password = await bcrypt.hash(user.password, salt); // Hash the password
      next();
    } catch (error) {
      next(error); // Pass errors to the next middleware
    }
  });
const User = mongoose.model('User', userSchema);

module.exports = User;