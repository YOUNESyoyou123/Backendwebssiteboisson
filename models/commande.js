// models/Commande.js
const mongoose = require("mongoose");

const CommandeSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true },
  country: { type: String, required: true },
  phone: { type: String, required: true },
  wilaya: { type: String },
  commune: { type: String },
  address: { type: String },
  products: [
    {
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
    },
  ],
  file: {
    type: String,
    require: true,
  },
  status: {
    type: String,
    enum: ["En cours de traitement", "Accepted", "Refused", "Livré"],
    default: "En cours de traitement",
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Commande", CommandeSchema);
