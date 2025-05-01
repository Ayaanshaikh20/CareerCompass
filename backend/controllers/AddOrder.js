const { Router } = require('express');
const router = Router();
const mongoose = require('mongoose');
const dbConnect = require('../config/dbConnect');

// Define Product Schema
const productSchema = new mongoose.Schema({
  name: String,
  price: String,
  image: String,
  quantity: Number,
});

// Define Order Schema
const ordersSchema = new mongoose.Schema({
  customerName: String,
  customerAddress: String,
  customerPhone: String,
  products: [productSchema],
  totalAmount: Number,
  status: String,
  userId: String,
});

// Create Order model
const Order = mongoose.model('Order', ordersSchema);

// Create Product model
const Product = mongoose.models.Product;

// Add Order Route
router.post('/api/add-order', async (req, res) => {
  try {
    const {
      customerName,
      customerAddress,
      customerPhone,
      products,
      totalAmount,
      status,
      userId,
    } = req.body;

    // Connect to the database
    await dbConnect();

    for (const orderedProduct of products) {
      await Product.findByIdAndUpdate(orderedProduct?._id, {
        $inc: { stock: -orderedProduct.quantity },
      });
    }

    // Create a new order
    const newOrder = new Order({
      customerName,
      customerAddress,
      customerPhone,
      products,
      totalAmount,
      status,
      userId,
    });

    // Save the new order to the database
    await newOrder.save();

    // Return success response
    res.status(201).json({
      message:
        'Order added successfully, order is being reviewed please wait for confirmation',
      order: newOrder,
      status_code: 201,
    });
  } catch (error) {
    console.error('Error adding order:', error);
    res
      .status(500)
      .json({ message: 'Error adding order', error: error.message });
  }
});

module.exports = router;
