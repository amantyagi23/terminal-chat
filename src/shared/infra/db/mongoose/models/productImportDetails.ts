import mongoose from "mongoose";

const productImportDetails = new mongoose.Schema(
  {
    importId: { type: String, unique: true },
    productId: { type: String, unique: true },
    status: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const ProductImportDetailsModel = mongoose.model(
  "productImportDetails",
  productImportDetails,
);
