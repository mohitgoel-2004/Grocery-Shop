const mongoose = require("mongoose");

const stockMovementSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: [
        "RESTOCK",
        "SALE",
        "RESERVED",
        "RELEASED",
        "DAMAGED",
        "EXPIRED",
        "ADJUSTMENT",
      ],
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
    },

    beforeStock: {
      type: Number,
      required: true,
      min: 0,
    },

    afterStock: {
      type: Number,
      required: true,
      min: 0,
    },

    reason: {
      type: String,
      default: "",
      trim: true,
    },

    referenceId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },

    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

stockMovementSchema.index({
  product: 1,
  createdAt: -1,
});

module.exports = mongoose.model(
  "StockMovement",
  stockMovementSchema
);