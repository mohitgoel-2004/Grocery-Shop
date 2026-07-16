const Category = require("../models/Category");
const Product = require("../models/Product");

const catalog = [
  {
    category: {
      name: "Vegetables",
      slug: "vegetables",
      icon: "🥦",
      sortOrder: 1,
    },
    products: [
      {
        name: "Beetroot",
        slug: "beetroot",
        price: 17.99,
        weight: "1 kg",
        image: "https://cdn-icons-png.flaticon.com/512/2909/2909762.png",
        badge: "Fresh",
        rating: 4.5,
        stock: 80,
        description: "Fresh farm-picked beetroot for your daily meals.",
      },
      {
        name: "Tomato",
        slug: "tomato",
        price: 14.29,
        weight: "1 kg",
        image: "https://cdn-icons-png.flaticon.com/512/135/135620.png",
        badge: "Seasonal",
        rating: 4.4,
        stock: 120,
        description: "Juicy tomatoes sourced from local farms.",
      },
    ],
  },
  {
    category: {
      name: "Fruits",
      slug: "fruits",
      icon: "🍍",
      sortOrder: 2,
    },
    products: [
      {
        name: "Avocado",
        slug: "avocado",
        price: 12.99,
        weight: "500 g",
        image: "https://cdn-icons-png.flaticon.com/512/590/590685.png",
        badge: "Organic",
        rating: 4.7,
        stock: 50,
        description: "Creamy ripe avocados for healthy meals.",
      },
      {
        name: "Apple",
        slug: "apple",
        price: 80,
        weight: "1 kg",
        image: "https://cdn-icons-png.flaticon.com/512/415/415682.png",
        badge: "Popular",
        rating: 4.8,
        stock: 60,
        description: "Crisp apples with a sweet, refreshing taste.",
      },
    ],
  },
  {
    category: {
      name: "Dairy",
      slug: "dairy",
      icon: "🥛",
      sortOrder: 3,
    },
    products: [
      {
        name: "Clevo UHT Strawberry",
        slug: "clevo-uht-strawberry",
        price: 16,
        weight: "60 g",
        image: "https://via.placeholder.com/150",
        badge: "Fresh",
        rating: 4.2,
        stock: 40,
        description: "Smooth strawberry-flavoured dairy drink.",
      },
      {
        name: "Yogurt Drink",
        slug: "yogurt-drink",
        price: 3.5,
        weight: "200 ml",
        image: "https://via.placeholder.com/150",
        badge: "Healthy",
        rating: 4.0,
        stock: 100,
        description: "Creamy probiotic yogurt drink with fruit flavours.",
      },
    ],
  },
  {
    category: {
      name: "Snacks",
      slug: "snacks",
      icon: "🛒",
      sortOrder: 4,
    },
    products: [
      {
        name: "Beng-Beng Chocolate",
        slug: "beng-beng-chocolate",
        price: 16,
        weight: "50 g",
        image: "https://via.placeholder.com/150",
        badge: "Popular",
        rating: 4.5,
        stock: 90,
        description: "Chocolate snack with a crispy wafer center.",
      },
      {
        name: "Chitato Supreme Cheese",
        slug: "chitato-supreme-cheese",
        price: 11,
        weight: "68 g",
        image: "https://via.placeholder.com/150",
        badge: "Best Seller",
        rating: 4.6,
        stock: 75,
        description: "Crunchy chips infused with rich cheese flavour.",
      },
    ],
  },
];

const seedCatalog = async () => {
  const categoryCount = await Category.countDocuments();
  const productCount = await Product.countDocuments();

  if (categoryCount > 0 && productCount > 0) {
    return;
  }

  for (const entry of catalog) {
    const categoryDoc =
      (await Category.findOneAndUpdate(
        { slug: entry.category.slug },
        { $setOnInsert: entry.category },
        { upsert: true, returnDocument: "after" }
      )) || (await Category.findOne({ slug: entry.category.slug }));

    for (const product of entry.products) {
      await Product.findOneAndUpdate(
        { slug: product.slug },
        {
          $setOnInsert: {
            ...product,
            category: categoryDoc._id,
          },
        },
        { upsert: true, returnDocument: "after" }
      );
    }
  }
};

module.exports = {
  seedCatalog,
};