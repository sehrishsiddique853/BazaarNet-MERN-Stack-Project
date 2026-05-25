// models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String,
    required: true,
    trim: true
  },
  // Array of additional product images for detail page gallery
  images: {
    type: [String],
    default: []
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  // Original price before discount (for showing strikethrough price)
  originalPrice: {
    type: Number,
    min: 0
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  // Number of ratings/reviews
  ratingCount: {
    type: Number,
    min: 0,
    default: 0
  },
  // Number of answered questions (for product detail page)
  answeredQuestions: {
    type: Number,
    min: 0,
    default: 0
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  // Product description for detail page
  description: {
    type: String,
    trim: true,
    default: ''
  },
  // Brand information
  brand: {
    type: String,
    trim: true,
    default: 'No Brand'
  },
  // Stock quantity
  stock: {
    type: Number,
    min: 0,
    default: 0
  },
  // Discount percentage applied to the product. A value greater than zero
  // indicates that the product is featured due to a promotional sale.
  discount: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  // Optional reason explaining why this product is featured, e.g. "20% off sale".
  featuredReason: {
    type: String,
    trim: true,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);