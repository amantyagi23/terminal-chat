import mongoose from "mongoose";

const productOptionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      index: true,
    },
    productId: {
      type: String,
      required: true,
    },
    productOptionId: { type: String, required: true, unique: true },
    data: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },

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
    timestamps: true,
    minimize: false, // keep empty objects if API sends them
    versionKey: false,
  },
);

export const ProductOptionModel = mongoose.model("productOption", productOptionSchema);
