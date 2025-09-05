const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  // ProductName: String,
  // Description: String,
  // ProductImage: String,
  // ProductBackground: String,
  // ProductLogoImage: String,
  // category: String,
  // Gout: String,
  ProductLogoImage: { type: String, required: true }, // Common logo
  ProductImage: { type: String, required: true }, // Common product image

  // Arabic content
  ar: {
    ProductName: { type: String, required: true },
    Description: { type: String, required: true },
    ProductBackground: { type: String },
    category: { type: String },
    Gout: { type: String },
  },

  // French content
  fr: {
    ProductName: { type: String, required: true },
    Description: { type: String, required: true },
    ProductBackground: { type: String },
    category: { type: String },
    Gout: { type: String },
  },

  // English content
  en: {
    ProductName: { type: String, required: true },
    Description: { type: String, required: true },
    ProductBackground: { type: String },
    category: { type: String },
    Gout: { type: String },
  },
});

const Product = mongoose.model("Product", ProductSchema);
module.exports = Product;
