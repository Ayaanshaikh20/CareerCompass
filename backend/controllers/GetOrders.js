const { Router } = require('express');
const router = Router();
const mongoose = require('mongoose');
const dbConnect = require('../config/dbConnect');

const Orders = mongoose.models.Order;

router.get('/api/get-orders', async (req, res) => {
  try {
    dbConnect();
    const { id } = req.query;
    let orders = await Orders.find({ userId: id });
    res.json({
      message: 'Orders fetched successfully',
      orders,
      status_code: 200,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error getting orders' });
  }
});

module.exports = router;
