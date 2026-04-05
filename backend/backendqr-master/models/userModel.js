const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      match: [/.+\@.+\..+/, 'Please enter a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
    },
    phone: {
      type: String,
      match: [/^\d{10}$/, 'Please enter a valid phone number'],
    },
    address: {
      type: String,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    customer: [
      {
        name: {
          type: String,
          required: [true, 'Customer name is required'],
          trim: true,
        },
        email: {
          type: String,
          required: [true, 'Customer email is required'],
          unique: true,
          match: [/.+\@.+\..+/, 'Please enter a valid email'],
        },
        phoneNo: {
          type: String,
          match: [/^\d{10}$/, 'Please enter a valid phone number'],
        },
        balance: {
          type: Number,
          default: 0,
        },
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

module.exports = User;
