// const connectDB = require('./config/db');
// const Category = require('./models/Category');
// const Product = require('./models/Product');
// (async () => {
//   try {
//     await connectDB();
//     const cats = await Category.find({}).lean();
//     console.log('CATEGORIES', JSON.stringify(cats.map(c => ({ _id: String(c._id), name: c.name, slug: c.slug, isActive: c.isActive })), null, 2));
//     const prods = await Product.find({}).populate('category', 'name slug').lean();
//     console.log('PRODUCTS', JSON.stringify(prods.map(p => ({ name: p.name, category: p.category && { _id: String(p.category._id), name: p.category.name, slug: p.category.slug } })), null, 2));
//     process.exit(0);
//   } catch (e) {
//     console.error(e);
//     process.exit(1);
//   }
// })();
