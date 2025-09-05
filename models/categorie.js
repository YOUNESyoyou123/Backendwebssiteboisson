const mongoose = require("mongoose");
const Categorie = new mongoose.Schema({
  CategorieName: { type: String, required: true, unique: true },
  LogoCategorie: { type: String, required: true },
});

module.exports = mongoose.model("Categorie", Categorie);
