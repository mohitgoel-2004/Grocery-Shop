export const inventoryData = [
  {
    id: 1,
    name: "Aashirvaad Atta 5kg",
    sku: "ATT-001",
    category: "Atta & Flour",
    brand: "Aashirvaad",
    stock: 25,
    reservedStock: 3,
    minStock: 10,
    maxStock: 100,
    unit: "Pack",
    costPrice: 210,
    sellingPrice: 250,
    damagedStock: 1,
    expiredStock: 0,
    wastageStock: 1,
    batchNo: "ATT-2408-A",
    manufacturingDate: "2026-06-01",
    expiryDate: "2027-06-01",
    supplier: "ABC Wholesale",
  },

  // other products...
];

export const movementData = [
  {
    id: 1,
    product: "Aashirvaad Atta 5kg",
    sku: "ATT-001",
    type: "purchase",
    quantity: 20,
    beforeStock: 5,
    afterStock: 25,
    reason: "New Purchase",
    date: "08 Aug 2026, 10:30 AM",
    performedBy: "Admin",
  },

  // other movements...
];