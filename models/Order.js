import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  customer: { type: String, required: true },
  service: { type: String, required: true },
  price: { type: Number, required: true },
  paymentStatus: { type: String, default: 'Pending' },
  date: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

const Order = mongoose.model('Order', orderSchema);
export default Order;
