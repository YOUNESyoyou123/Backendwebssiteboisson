const mongoose = require("mongoose");

const sliderSchema = new mongoose.Schema(
  {
    title: { type: String },
    DescriptionSlider: { type: String }, // Description spécifique au slider
    ProductSliderImage: { type: String, required: true },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    // Champs du produit copiés
    ProductName: { type: String },
    Description: { type: String }, // Copie de la description du produit
    ProductImage: { type: String },
    category: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Slider", sliderSchema);
