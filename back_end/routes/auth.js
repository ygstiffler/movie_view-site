const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = express.Router();
const SECRET = process.env.JWT_SECRET; // Secure JWT key

// Register a new user
router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await User.create({ email, password: hashedPassword });
    res.json({ message: "User registered successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error });
  }
});

// Login user
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.status(400).json(
    { message: "User not found" 

    });


  const isValid = await bcrypt.compare(password, user.password);
  
  if (!isValid) return res.status(400).json(
    { message: "Invalid password" 

    });
    

  const token = jwt.sign({ id: user._id }, SECRET, { expiresIn: "1h" });
  
  res.json({ token });
});

module.exports = router;