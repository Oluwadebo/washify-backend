import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const formatUser = (user) => ({
  id: user._id,
  FirstName: user.FirstName,
  LastName: user.LastName,
  shopName: user.shopName,
  tell: user.tell,
  address: user.address,
  email: user.email,
  logo: user.logo,
});

// =============================
//  REGISTER NEW USER
// =============================
export const signupUser = async (req, res) => {
  try {
    const { FirstName, LastName, shopName, tell, address, email, password, logo } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      FirstName,
      LastName,
      shopName,
      tell,
      address,
      email,
      password: hashedPassword,
      logo,
    });

    res.status(201).json({
      message: 'User registered successfully ✅',
       user: formatUser(user),
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// =============================
//  CHECK EMAIL AVAILABILITY
// =============================
export const checkEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.json({ status: 'exists' });
    } else {
      return res.json({ status: 'unavailable' });
    }
  } catch (error) {
    console.error('Email check error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// =============================
//  LOGIN USER
// =============================
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please enter both email and password' });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'No account found with this email' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Incorrect password' });

    // ✅ Generate JWT Token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
// console.log(token);

    // ✅ Send JWT as a secure cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: true, 
      sameSite: 'None',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      message: 'Login successful ✅',
       token,
      user: formatUser(user),
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const validateUser = async (req, res) => {
  try {
    // ✅ Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.json({ valid: false });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) return res.json({ valid: false });

    res.json({ valid: true, user: formatUser(user) });
  } catch (error) {
    console.error('Validate user error:', error.message);
    res.json({ valid: false });
  }
};


// Get logged-in user profile
export const getProfile = async (req, res) => {
  try {
    
    if (!req.user) return res.status(401).json({ message: "Not authenticated" });

    res.status(200).json({
      id: req.user._id,
      FirstName: req.user.FirstName,
      LastName: req.user.LastName,
      shopName: req.user.shopName,
      tell: req.user.tell,
      address: req.user.address,
      email: req.user.email,
      logo: req.user.logo,
    });
  } catch (error) {
    console.error("Profile fetch error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};


export const logoutUser = (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
};