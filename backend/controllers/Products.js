const { Router } = require('express');
const router = Router();
const mongoose = require('mongoose');
const dbConnect = require('../config/dbConnect');

const productSchema = new mongoose.Schema({
  id: String,
  name: String,
  price: String,
  stock: Number,
  image: String, // URL for the image
});

const Product = mongoose.model('Product', productSchema);

router.get('/api/products', async (req, res) => {
  dbConnect();
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

module.exports = router;
