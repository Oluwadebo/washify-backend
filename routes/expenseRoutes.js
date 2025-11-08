import express from 'express';
import Expense from '../models/Expense.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get all expenses for logged-in user
router.get('/', protect, async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.userId }).sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    res.json({ message: err.message });
  }
});

// Add new expense
router.post('/', protect, async (req, res) => {
  try {
    const newExpense = new Expense({
      ...req.body,
      userId: req.userId, // ✅ always use userId from token
    });

    const savedExpense = await newExpense.save();
    res.json(savedExpense);
  } catch (err) {
    res.json({ message: err.message });
  }
});

export default router;
