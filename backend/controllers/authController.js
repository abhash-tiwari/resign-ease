const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { username, password, email, role } = req.body;

    // Check if user exists
    let user = await User.findOne({ $or: [{ username }, { email }] });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const userRole = role === "admin" ? "admin" : "employee";

    user = await User.create({
      username,
      password: hashedPassword,
      email,
      role: userRole,
    });
   
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Special case for admin
    // if (username === 'admin' && password === 'admin') {
    //   const token = jwt.sign(
    //     { id: 'admin', role: 'admin' },
    //     process.env.JWT_SECRET,
    //     { expiresIn: '24h' }
    //   );
    //   return res.json({ token });
    // }

   

    // Regular user login
    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
        token,
        data: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      });
  
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};