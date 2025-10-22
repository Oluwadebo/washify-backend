import express from 'express';
import { signupUser, checkEmail, loginUser,logoutUser , validateUser , getProfile} from '../controllers/userController.js';
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public
router.post('/signup', signupUser);
router.post('/check-email', checkEmail);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/validate', validateUser);

// Protected
router.get("/profile", protect, getProfile);

export default router;
