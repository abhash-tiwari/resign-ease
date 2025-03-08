const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
    try {
        console.log('Headers:', req.headers); // Log all headers
        const token = req.header('Authorization');
        console.log('Raw token:', token); // Log the raw token
    
        if (!token) {
          return res.status(401).json({ message: 'No token provided' });
        }
    
        const tokenWithoutBearer = token.replace('Bearer ', '');
        console.log('Token without Bearer:', tokenWithoutBearer); // Log cleaned token
    
        const decoded = jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET);
        console.log('Decoded token:', decoded); // Log decoded token
    
        const user = await User.findById(decoded.id);
        console.log('Found user:', user); // Log user
    
        if (!user) {
          return res.status(401).json({ message: 'User not found' });
        }
    
        req.user = user;
        next();
      } catch (error) {
        console.error('Auth error:', error); // Log any errors
        res.status(401).json({ message: 'Authentication required: ' + error.message });
      }
  };

const isAdmin = async (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }
  next();
};

module.exports = { auth, isAdmin };