const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const path = require("path");

const connectDB = require("./config/db");

// Seeders
const seedAdmin = require("./services/adminSeeder");
const { seedCatalog } = require("./services/catalogSeeder");

// Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const addressRoutes = require("./routes/addressRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

// Admin Routes
const adminRoutes = require("./routes/adminRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const adminProductRoutes = require("./routes/adminProductRoutes");
const adminOrderRoutes = require("./routes/adminOrderRoutes");
const adminCustomerRoutes = require("./routes/adminCustomerRoutes");
const adminProfileRoutes = require("./routes/adminProfileRoutes");

// Middleware
const {
  notFound,
  errorHandler,
} = require("./middleware/errorMiddleware");

const app = express();

/* ===========================
   CORS
=========================== */

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://10.77.245.168:5173",
    ],
    credentials: true,
  })
);

/* ===========================
   Body Parser
=========================== */

app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/* ===========================
   Root
=========================== */

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Grocery Delivery API Running 🚀",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "API Healthy",
  });
});

/* ===========================
   Customer APIs
=========================== */

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/addresses", addressRoutes);
app.use("/api/notifications", notificationRoutes);

/* ===========================
   Admin APIs
=========================== */

app.use("/api/admin", adminRoutes);

app.use("/api/admin/dashboard", dashboardRoutes);

app.use("/api/admin/products", adminProductRoutes);

app.use("/api/admin/orders", adminOrderRoutes);

app.use("/api/admin/customers", adminCustomerRoutes);

app.use("/api/admin/profile", adminProfileRoutes);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* ===========================
   Error Handler
=========================== */

app.use(notFound);
app.use(errorHandler);

/* ===========================
   Start Server
=========================== */

const PORT = process.env.PORT || 5000;

connectDB()
  .then(async () => {
    await seedAdmin();
    await seedCatalog();

    app.listen(PORT, () => {
      console.log("-----------------------------------");
      console.log(`🚀 Server running on port ${PORT}`);
      console.log("-----------------------------------");
    });
  })
  .catch((err) => {
    console.error("Server Error:", err.message);
    process.exit(1);
  });