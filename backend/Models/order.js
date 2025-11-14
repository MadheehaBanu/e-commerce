const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderItemSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  title: String,
  price: Number,
  qty: Number
});

const OrderSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  items: [OrderItemSchema],
  total: { type: Number, required: true },
  shippingAddress: { type: Object }, // expand as you want
  status: { type: String, default: 'Pending' }, // Pending, Confirmed, Shipped, Delivered, Cancelled
  paid: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);
