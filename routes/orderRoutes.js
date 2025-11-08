import express from 'express';
import Order from '../models/Order.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// ✅ Get all orders for logged-in user
router.get('/', protect, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.userId }).sort({ date: -1 });
    res.json(orders);
  } catch (err) {
    res.json({ message: err.message });
  }
});

// ✅ Add a new order
router.post('/', protect, async (req, res) => {
  try {
    const newOrder = new Order({ ...req.body, userId: req.userId });
    const savedOrder = await newOrder.save();
    res.json(savedOrder);
  } catch (err) {
    res.json({ message: err.message });
  }
});

// ✅ Update an order
router.put('/:id', protect, async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findOneAndUpdate(
      { _id: id, userId: req.userId },
      req.body,
      { new: true }
    );
    if (!order) return res.json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.json({ message: err.message });
  }
});

// ✅ Delete an order
router.delete('/:id', protect, async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findOneAndDelete({ _id: id, userId: req.userId });
    if (!order) return res.json({ message: 'Order not found' });
    res.json({ message: 'Order deleted successfully' });
  } catch (err) {
    res.json({ message: err.message });
  }
});

export default router;
