const mongoose = require("mongoose");

const inventoryBatchSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },

    batchNo: {
      type: String,
      required: true,
      trim: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 0,
    },

    manufacturingDate: {
      type: Date,
      default: null,
    },

    expiryDate: {
      type: Date,
      default: null,
    },

    purchasePrice: {
      type: Number,
      default: 0,
      min: 0,
    },

    supplier: {
      type: String,
      default: "",
      trim: true,
    },

    status: {
      type: String,
      enum: ["active", "expired", "depleted"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

inventoryBatchSchema.index({
  product: 1,
  batchNo: 1,
});

module.exports = mongoose.model(
  "InventoryBatch",
  inventoryBatchSchema
);