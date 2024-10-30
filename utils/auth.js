const jwt = require('jsonwebtoken');

// Set token secret and expiration date
const secret = process.env.JWT_SECRET || 'mysecretsshhhhh'; // Use environment variable
const expiration = '2h';

module.exports = {
  // Function for our authenticated routes
  authMiddleware: function (req, res, next) {
    console.log("In Auth Middleware");
    
    // Allow token to be sent via req.query or headers
    // let token = req.query.token || req.headers.authorization;
    console.log("toke: ")
    // Check if token is provided
    if (token && req.headers.authorization) {
      // Split Bearer from token value
      token = token.split(' ').pop().trim(); 
    }

    if (!token) {
      return res.status(401).json({ message: 'You have no token!' });
    }

    // Verify token and get user data out of it
    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data; // Attach user data to request object
    } catch (err) {
      console.log('Invalid token', err);
      return res.status(401).json({ message: 'Invalid token!' });
    }

    // Send to next endpoint
    next();
  },
  
  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};
