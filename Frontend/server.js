const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("dotenv").config();
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Allow specific website URLs
const allowedOrigins = [
  "https://dynamicqr.vercel.app",
  "https://prepayqr.vercel.app",
  "https://smartkhata.vercel.app",
  "https://prepayofficial.vercel.app",
  "https://backendqr-wal6.onrender.com",
  "http://localhost:3000",
  "http://localhost:5000",
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true, // Allow cookies if needed
};

app.use(cors(corsOptions));

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI || "mongodb+srv://raunak1:DOGTAIL1234@dynamic.ui5a0.mongodb.net/?retryWrites=true&w=majority&appName=dynamic",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("Connected to MongoDB successfully!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1);
  }
};
connectDB();

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNo: { type: String, required: true, unique: true },
    upino: { type: String },
    address: { type: String },
    isAdmin: { type: Boolean, default: false },
    customer: [
      {
        name: { type: String },
        phone: { type: String },
        category: { type: String },
        customeraddress: { type: String },
        balance: { type: Number, default: 0 },
      },
    ],
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);
const User = mongoose.model("User", userSchema);

const transactionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    customerid: { type: String },
    customerno:{ type: String },
    customername:{type:String},
    amount: { type: Number},
    cashin: { type: Number, default: 0 },
    cashout: { type: Number, default: 0 },
    amountpaid: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    note: {type:String},
    expense: { type: Number, default: 0 },
    paymentmode: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);
const Transaction = mongoose.model("Transaction", transactionSchema);

//FOR PROFILE MANAGEMENT
app.get('/profile/:phoneNo', async (req, res) => {
  const {  phoneNo } = req.params;
  try {
    const user = await User.findOne({ phoneNo });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
// Route: PUT /api/user/profile/:phone
app.put('/profile/:phoneNo', async (req, res) => {
  const {  phoneNo } = req.params;
  const { name, email, address, upino } = req.body;
  try {
    const updatedUser = await User.findOneAndUpdate(
      {  phoneNo },
      { name, email, address, upino },
      { new: true } // Return updated document
    );
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user details:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
// API to create a new user
app.post("/api/signup", async (req, res) => {
  try {
    const { username, password, email, phoneNo, upino, address, isAdmin } = req.body;

    // Validate required fields
    if (!username || !password || !email || !phoneNo) {
      return res.status(400).json({ message: "Username, password, email, and phone number are required." });
    }

    // Check if email or phone number already exists
    const existingUser = await User.findOne({ $or: [{ email }, { phoneNo }] });
    if (existingUser) {
      return res.status(400).json({ message: "Email or phone number already exists." });
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      password: hashedPassword,
      email,
      phoneNo,
      upino,
      address,
      isAdmin,
    });

    await newUser.save();
    res.status(201).json({ message: "User created successfully!", user: newUser });
  } catch (error) {
    console.error("Error creating user:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
app.post("/api/login", async (req, res) => {
  try {
    const { phoneNo, password } = req.body;

    // Find user by phone number
    const user = await User.findOne({ phoneNo });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password); // Use bcrypt to compare hashed passwords

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    res.status(200).json({ message: "Login successful", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
app.get("/customer/:phone", async (req, res) => {
  const { phone } = req.params;
  try {
    const user = await User.findOne({ phoneNo: phone });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ customer: user.customer });
  } catch (error) {

    res.status(500).json({ error: "Error fetching customers" });
  }
});
// Add a new customer
app.post("/user/:phone/customer", async (req, res) => {
  const { phone } = req.params; // Use 'phone' for the parameter
  const { name, phoneNo, category, customeraddress, balance } = req.body;

  try {
    const user = await User.findOne({ phoneNo:phone });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.customer.push({ name, phone: phoneNo, category, customeraddress, balance });
    await user.save();
    res.status(201).json({ message: "Customer added successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error adding customer" });
  }
});
// Update a customer's details
app.put("/user/:phone/customer/:customerPhone", async (req, res) => {
  const { phone, customerPhone } = req.params;
  const { name, category, customeraddress, balance, newPhoneNo } = req.body;
  try {
    const user = await User.findOne({ phoneNo: phone });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const customer = user.customer.find((c) => c.phone === customerPhone);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    customer.name = name || customer.name;
    customer.category = category || customer.category;
    customer.customeraddress = customeraddress || customer.customeraddress;
    customer.balance = balance !== undefined ? balance : customer.balance;
    if (newPhoneNo) customer.phone = newPhoneNo;
    await user.save();
    res.status(200).json({ message: "Customer updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error updating customer" });
  }
});
// Delete a customer
app.delete("/user/:phone/customer/:customerPhone", async (req, res) => {
  const { phone, customerPhone } = req.params;

  try {
    const user = await User.findOne({ phoneNo: phone });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.customer = user.customer.filter((c) => c.phone !== customerPhone);
    await user.save();
    res.status(200).json({ message: "Customer deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting customer" });
  }
});
app.get("/api/transactions/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const transactions = await Transaction.find({ user: userId }).populate("user", "name email");
    res.status(200).json({ transactions });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
app.get("/user/:phoneNo", async (req, res) => {
  const { phoneNo } = req.params;
  try {
    const user = await User.findOne({ phoneNo });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ customer: user.customer });
  } catch (error) {
    res.status(500).json({ error: "Error fetching customer" });
  }
});
app.post("/api/transaction", async (req, res) => {
  try {
    const {
      userId,
      customerno,
      customername,
      amount,
      cashin,
      cashout,
      amountpaid,
      paymentmode,
      discount,
      note,
      expense,
    } = req.body;

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let customerData = null;
    let updatedBalance = null;

    // Check if a customer with the given phone number exists
    if (customerno) {
      customerData = user.customer.find((cust) => cust.phone === customerno);
    }

    if (customerData) {
      console.log("Customer found:", customerData);

      // Calculate the balance adjustment based on the amount paid
      if (amountpaid > amount) {
        updatedBalance = customerData.balance - (amountpaid - amount); // Deduct the excess payment
      } else if (amountpaid < amount) {
        updatedBalance = customerData.balance + (amount - amountpaid); // Add the remaining balance to the customer's balance
      } else {
        updatedBalance = customerData.balance; // No change to balance
      }

      // Update the customer's balance
      customerData.balance = updatedBalance;

      // Save the updated user document
      await user.save();
    } else {
      console.log("Customer not found, skipping balance update.");
    }

    // Create and save the transaction
    const transaction = new Transaction({
      user: userId,
      customer: customerData ? customerData._id : null, // Include customer ID only if customer exists
      customerno: customerData ? customerno : null,
      customername: customerData ? customername : null,
      amount,
      cashin,
      cashout,
      amountpaid,
      paymentmode,
      discount,
      note,
      expense,
    });
    await transaction.save();

    res.status(201).json({
      message: "Transaction created successfully",
      transaction,
      updatedBalance,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


app.get("/api/user/:userId/customers", async (req, res) => {
  const { userId } = req.params;

  try {
    // Find user and fetch their customers
    const user = await User.findById(userId).select("customer");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json(user.customer);
  } catch (error) {
    console.error("Error fetching customers:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/customer-transactions", async (req, res) => {
  const { userId, phone } = req.query;

  try {
    // Validate required fields
    if (!userId || !phone) {
      return res.status(400).json({ error: "User ID and phone are required" });
    }
    // Find transactions for the given customer phone and user
    const transactions = await Transaction.find({
      user: userId,
      customerno: phone,
    });

    if (!transactions.length) {
      return res
        .status(404)
        .json({ error: "No transactions found for this customer" });
    }
    return res.status(200).json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});



app.get('/', async (req, res) => {
   res.json({message:"server active !"});
});
// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
