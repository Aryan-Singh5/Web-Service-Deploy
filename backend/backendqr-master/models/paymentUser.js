const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
    },
    customer: {
      name: {
        type: String,
        trim: true,
      },
      email: {
        type: String,
        match: [/.+\@.+\..+/, 'Please enter a valid email'],
      },
      phoneNo: {
        type: String,
        match: [/^\d{10}$/, 'Please enter a valid phone number'],
      },
    },
    amount: {
      type: Number,
      required: [true, 'Transaction amount is required'],
    },
    cashIn: {
      type: Number,
      default: 0,
    },
    cashOut: {
      type: Number,
      default: 0,
    },
    amountPaid: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    expense: {
      type: Number,
      default: 0,
    },
    paymentMode: {
      type: String,
      enum: ['Cash', 'Card', 'UPI', 'Wallet', 'Other'],
      required: [true, 'Payment mode is required'],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
