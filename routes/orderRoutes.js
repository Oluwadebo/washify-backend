import express from 'express';
import Order from '../models/Order.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get all orders for logged-in user
router.get('/', async (req, res) => {
  try {
    const userId = req.query.userId; // from query

    const orders = await Order.find({ userId }).sort({ date: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a new order
router.post('/', async (req, res) => {
  try {
    console.log(req.body, 'body');

    const newOrder = new Order({ ...req.body });
    const savedOrder = await newOrder.save();
    console.log(newOrder);

    res.status(201).json(savedOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update an order
router.put('/:id', async (req, res) => {
  try {
    console.log(req,"update");
    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true }
    );
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete an order
router.delete('/:id', async (req, res) => {
  try {
    const order = await Order.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json({ message: 'Order deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
