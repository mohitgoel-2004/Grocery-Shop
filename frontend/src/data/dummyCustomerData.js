// src/data/customerDummyData.js

const cities = [
  "Delhi",
  "Mumbai",
  "Noida",
  "Lucknow",
  "Jaipur",
  "Pune",
  "Hyderabad",
  "Bangalore",
  "Chandigarh",
  "Ahmedabad",
];

const statuses = ["active", "blocked"];

const memberships = ["Regular", "Premium", "VIP"];

const paymentMethods = ["UPI", "Cash", "Card", "Net Banking"];

const random = (arr) => arr[Math.floor(Math.random() * arr.length)];

const customers = Array.from({ length: 50 }, (_, index) => ({
  id: index + 1,

  customerId: `CUS${String(index + 1).padStart(5, "0")}`,

  firstName: `Customer${index + 1}`,

  lastName: "User",

  fullName: `Customer ${index + 1}`,

  email: `customer${index + 1}@gmail.com`,

  phone: `98${Math.floor(10000000 + Math.random() * 90000000)}`,

  avatar: `https://i.pravatar.cc/150?img=${index + 1}`,

  gender: index % 2 === 0 ? "Male" : "Female",

  dob: "1998-05-15",

  city: random(cities),

  state: "Uttar Pradesh",

  country: "India",

  address: `${index + 10}, Green Street`,

  pincode: "201301",

  status: random(statuses),

  membership: random(memberships),

  totalOrders: Math.floor(Math.random() * 100),

  totalSpent: Math.floor(Math.random() * 80000) + 500,

  walletBalance: Math.floor(Math.random() * 5000),

  rewardPoints: Math.floor(Math.random() * 1500),

  lastOrderDate: "2026-07-01",

  joinedDate: "2025-01-15",

  paymentMethod: random(paymentMethods),

  isVerified: Math.random() > 0.3,

  createdAt: new Date().toISOString(),

  updatedAt: new Date().toISOString(),
}));

export default customers;