// dummyData.js
const dummyData = {
  categories: [
    {
      name: "Electronics",
      image: "https://upload.wikimedia.org/wikipedia/commons/e/e6/Smartphone_case_cover_white.jpg",
      slug: "electronics"
    },
    {
      name: "Fashion",
      image: "https://upload.wikimedia.org/wikipedia/commons/8/8d/T-SHIRTS.jpg",
      slug: "fashion"
    },
    {
      name: "Home & Garden",
      image: "https://upload.wikimedia.org/wikipedia/commons/d/dd/Throw_Pillows_(Scatter_Cushions).jpg",
      slug: "home-garden"
    },
    {
      name: "Sports & Outdoors",
      image: "https://upload.wikimedia.org/wikipedia/commons/a/a8/CampingTent1.jpg",
      slug: "sports-outdoors"
    },
    {
      name: "Beauty & Personal Care",
      image: "https://upload.wikimedia.org/wikipedia/commons/4/46/Men's_Skin_Care-_Men's_Botanics_Intensive_Face_Moisturiser.jpg",
      slug: "beauty-personal-care"
    },
    {
      name: "Books",
      image: "https://upload.wikimedia.org/wikipedia/commons/b/b0/Stack_of_books2.jpg",
      slug: "books"
    },
    {
      name: "Toys & Games",
      image: "https://upload.wikimedia.org/wikipedia/commons/c/cc/Toy_blocks_-_Snap_2532.JPG",
      slug: "toys-games"
    },
    {
      name: "Automotive",
      image: "https://upload.wikimedia.org/wikipedia/commons/1/16/Little_Trees_car_freshener_at_day.jpg",
      slug: "automotive"
    },
    {
      name: "Health & Household",
      image: "https://images.pexels.com/photos/13779107/pexels-photo-13779107.jpeg?cs=srgb",
      slug: "health-household"
    },
    {
      name: "Grocery",
      image: "https://upload.wikimedia.org/wikipedia/commons/0/07/Honeycrisp-Apple.jpg",
      slug: "grocery"
    }
  ],
  ads: [
    {
      title: "Big Sale on Electronics",
      image: "https://upload.wikimedia.org/wikipedia/commons/0/01/AirPods.jpg",
      link: "https://daraz.com/electronics-sale",
      description: "Up to 50% off on all electronics"
    },
    {
      title: "Fashion Week Special",
      image: "https://upload.wikimedia.org/wikipedia/commons/8/8d/T-SHIRTS.jpg",
      link: "https://daraz.com/fashion-week",
      description: "Latest trends at unbeatable prices"
    },
    {
      title: "Home Decor Deals",
      image: "https://upload.wikimedia.org/wikipedia/commons/d/dd/Throw_Pillows_(Scatter_Cushions).jpg",
      link: "https://daraz.com/home-decor",
      description: "Transform your home today"
    },
    {
      title: "Sports Gear Clearance",
      image: "https://upload.wikimedia.org/wikipedia/commons/a/a7/Running_shoes.jpg",
      link: "https://daraz.com/sports-gear",
      description: "Gear up for your next adventure"
    },
    {
      title: "Beauty Essentials",
      image: "https://upload.wikimedia.org/wikipedia/commons/9/96/Green_shampoo_bottle.jpg",
      link: "https://daraz.com/beauty-essentials",
      description: "Glow up with our beauty products"
    },
    {
      title: "Book Lovers' Paradise",
      image: "https://upload.wikimedia.org/wikipedia/commons/b/b0/Stack_of_books2.jpg",
      link: "https://daraz.com/books-paradise",
      description: "Discover your next favorite read"
    },
    {
      title: "Fun Toys for Kids",
      image: "https://upload.wikimedia.org/wikipedia/commons/c/cc/Toy_blocks_-_Snap_2532.JPG",
      link: "https://daraz.com/toys-kids",
      description: "Endless fun and learning"
    },
    {
      title: "Auto Parts Discount",
      image: "https://upload.wikimedia.org/wikipedia/commons/6/69/Porsche_Tire_Pressure_Gauge_(9207945919).jpg",
      link: "https://daraz.com/auto-parts",
      description: "Keep your vehicle running smoothly"
    },
    {
      title: "Health & Wellness",
      image: "https://images.pexels.com/photos/13779107/pexels-photo-13779107.jpeg?cs=srgb",
      link: "https://daraz.com/health-wellness",
      description: "Stay healthy and fit"
    },
    {
      title: "Grocery Savings",
      image: "https://upload.wikimedia.org/wikipedia/commons/0/07/Honeycrisp-Apple.jpg",
      link: "https://daraz.com/grocery-savings",
      description: "Fresh groceries at low prices"
    }
  ],
  // The products are loaded from productsData.js, which reads
  // new_products_list.txt and converts it into an array of objects.
  products: require('./productsData')
};

module.exports = dummyData;