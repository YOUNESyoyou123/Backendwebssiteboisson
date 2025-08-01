
const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  ProductName: String,
  Description: String,
  ProductImage: String,
  ProductBackground: String,
  ProductLogoImage: String,
  category: String,
});

const Product = mongoose.model("Product", ProductSchema);
module.exports = Product;
