// routes/homeRoutes.js
const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const Ad = require('../models/Ad');
const Product = require('../models/Product');

// GET /api/home - Fetch home page data
router.get('/home', async (req, res) => {
  try {
    const categories = await Category.find({});
    const ads = await Ad.find({});
    // Featured products are those with a discount greater than zero. Include
    // discount, reason and category reference so the frontend can display
    // additional details. Sample a limited number to show on the home page.
    // Increase the number of featured products for a richer showcase on the
    // homepage. Select only products with a discount greater than zero.
    const randomProductsSection1 = await Product.aggregate([
      { $match: { discount: { $gt: 0 } } },
      // Sample more items than before to widen the section.
      { $sample: { size: 15 } },
      { $project: { _id: 1, title: 1, image: 1, discount: 1, featuredReason: 1, category: 1 } }
    ]);
    const randomProductsSection2 = await Product.aggregate([
      { $sample: { size: 10 } },
      { $project: { _id: 1, title: 1, image: 1, price: 1, rating: 1 } }
    ]);
    res.json({
      categories,
      ads,
      randomProductsSection1,
      randomProductsSection2
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/categories - Get all categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await Category.find({});
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/ads - Get all ads
router.get('/ads', async (req, res) => {
  try {
    const ads = await Ad.find({});
    res.json(ads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/products/random - Get random products for sections
router.get('/products/random', async (req, res) => {
  try {
    const { section, limit = 10 } = req.query;
    let projection = { _id: 1, title: 1, image: 1 };
    if (section === '2') {
      projection.price = 1;
      projection.rating = 1;
    }
    const products = await Product.aggregate([
      { $sample: { size: parseInt(limit) } },
      { $project: projection }
    ]);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/products/search - Search products
router.get('/products/search', async (req, res) => {
  try {
    const { q, category, minPrice, maxPrice, page = 1, limit = 20 } = req.query;
    let query = {};
    if (q) query.title = { $regex: q, $options: 'i' };
    if (category) query.category = category; // Assuming category slug or ID
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }
    const products = await Product.find(query)
      .populate('category')
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    const total = await Product.countDocuments(query);
    res.json({
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/products/:id - Get single product by ID
router.get('/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category');
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid product ID' });
    }
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;