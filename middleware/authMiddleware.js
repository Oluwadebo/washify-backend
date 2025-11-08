import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    
    if (!token) return res.json({ message: 'Not authorized, no token' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.json({ message: 'User not found' });

    req.user = user;
    req.userId = user._id; // ✅ Add this line
    next();
  } catch (error) {
    res.json({ message: 'Not authorized' });
  }
};
