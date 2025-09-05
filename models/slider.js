const mongoose = require("mongoose");

const sliderSchema = new mongoose.Schema(
  // {
  //   title: { type: String },
  //   DescriptionSlider: { type: String }, // Description spécifique au slider
  //   ProductSliderImage: { type: String, required: true },
  //   product: {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: "Product",
  //   },

  //   ProductName: { type: String },
  //   Description: { type: String }, // Copie de la description du produit
  //   ProductImage: { type: String },
  //   category: { type: String },
  //   Gout: { type: String },
  // },
  // { timestamps: true }

  {
    // Common fields (not language-specific)
    ProductSliderImage: { type: String, required: true },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },

    // Language-specific fields
    ar: {
      title: { type: String },
      DescriptionSlider: { type: String },
      ProductName: { type: String },
      Description: { type: String },
      category: { type: String },
      Gout: { type: String },
    },
    fr: {
      title: { type: String },
      DescriptionSlider: { type: String },
      ProductName: { type: String },
      Description: { type: String },
      category: { type: String },
      Gout: { type: String },
    },
    en: {
      title: { type: String },
      DescriptionSlider: { type: String },
      ProductName: { type: String },
      Description: { type: String },
      category: { type: String },
      Gout: { type: String },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Slider", sliderSchema);
