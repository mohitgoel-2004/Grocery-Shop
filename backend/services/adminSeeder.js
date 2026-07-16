const Admin = require("../models/Admin");

/**
 * Seed Default Admin
 */
const seedAdmin = async () => {
  try {
    const existingAdmin = await Admin.findOne();

    if (existingAdmin) {
    //   console.log("✅ Admin already exists");
      return;
    }

    const admin = await Admin.create({
      name: "Super Admin",
      email: "admin@grocery.com",
      password: "Admin@123",
      role: "superadmin",
      isActive: true,
    });

    // console.log("====================================");
    // console.log("✅ Default Admin Created Successfully");
    // console.log("====================================");
    // console.log(`Name     : ${admin.name}`);
    // console.log(`Email    : ${admin.email}`);
    // console.log(`Password : Admin@123`);
    // console.log("====================================");
  } catch (error) {
    console.error("❌ Admin Seeder Error:", error.message);
  }
};

module.exports = seedAdmin;