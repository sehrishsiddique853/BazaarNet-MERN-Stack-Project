// populate.js
const mongoose = require('mongoose');
const Category = require('./models/Category');
const Ad = require('./models/Ad');
const Product = require('./models/Product');
const dummyData = require('./dummyData');

async function populate() {
  try {
    // Connect to MongoDB Atlas
    await mongoose.connect('mongodb+srv://Tatheer_15:1512@cluster0.copt0q5.mongodb.net/ecommerceDB');

    // Clear existing data
    await Category.deleteMany({});
    await Ad.deleteMany({});
    await Product.deleteMany({});

    // Insert categories
    const categories = await Category.insertMany(dummyData.categories);
    console.log('Categories inserted');

    // Create a map of slug to _id
    const categoryMap = {};
    categories.forEach(cat => {
      categoryMap[cat.slug] = cat._id;
    });

    // Insert ads
    await Ad.insertMany(dummyData.ads);
    console.log('Ads inserted');

    // Update products with category ObjectIds and add new fields
    const productsWithIds = dummyData.products.map(product => {
      // Calculate original price if discount exists
      let originalPrice = product.price;
      if (product.discount && product.discount > 0) {
        originalPrice = Math.round(product.price / (1 - product.discount / 100));
      }
      
      // Generate additional images (use main image as base, add variations)
      const images = [product.image];
      // Add 2-3 additional images (using same image for now, can be replaced with actual images)
      for (let i = 0; i < 2; i++) {
        images.push(product.image); // In production, these would be different image URLs
      }
      
      return {
        ...product,
        category: categoryMap[product.category],
        // Add new fields with defaults if not present
        description: product.description || `${product.title}. High quality product with excellent features.`,
        brand: product.brand || 'No Brand',
        stock: product.stock || Math.floor(Math.random() * 100) + 10, // Random stock between 10-110
        originalPrice: product.originalPrice || originalPrice,
        images: product.images || images,
        ratingCount: product.ratingCount || Math.floor(Math.random() * 500) + 50, // Random between 50-550
        answeredQuestions: product.answeredQuestions || Math.floor(Math.random() * 100) + 10 // Random between 10-110
      };
    });

    await Product.insertMany(productsWithIds);
    console.log('Products inserted');

    console.log('Dummy data populated successfully');
  } catch (error) {
    console.error('Error populating data:', error);
  } finally {
    mongoose.connection.close();
  }
}

populate();