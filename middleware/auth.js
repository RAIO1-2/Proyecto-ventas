import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server'; // Ensure this import is included

const authMiddleware = (handler) => {
  return async (req, res) => {
    const token = req.cookies.token || ''; // Get the token from cookies

    if (!token) {
      console.log('No token found, redirecting to /login');
      // Redirect to /login if token is not present
      return NextResponse.redirect(new URL('/login', req.url));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // Attach user info to request
      console.log('User authenticated:', req.user); // Log user info
      return handler(req, res);
    } catch (error) {
      console.error('Token verification failed:', error);
      return res.status(403).json({ message: 'Invalid token' });
    }
  };
};

export default authMiddleware;
