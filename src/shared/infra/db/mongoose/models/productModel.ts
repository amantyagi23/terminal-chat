import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    // Stable unique ID from API
    productId: {
      type: String,
      required: true,
      unique: true,
    },

    // Optional searchable fields
    title: {
      type: String,
      index: true,
    },

    // Full raw API payload (future-proof)
    data: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },

    // First time this product ever appeared
    firstSeenAt: {
      type: Date,
      required: true,
      index: true,
    },

    // Last time this record was synced from API
    lastSyncedAt: {
      type: Date,
      required: true,
      index: true,
    },

    // Helper flag (true only on first sync day)
    isNewData: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
    minimize: false, // keep empty objects if API sends them
    versionKey: false,
  },
);

// 🧠 Extra safety (unique constraint at DB level)
productSchema.index({ productId: 1 }, { unique: true });

export const ProductModel = mongoose.model("Product", productSchema);
