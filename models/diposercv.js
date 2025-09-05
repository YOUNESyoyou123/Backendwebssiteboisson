const mongoose = require("mongoose");

const diposercvSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  file: { type: String, required: true },
  status: {
    type: String,
    enum: ["En cours de traitement", "Reserver"],
    default: "En cours de traitement",
  },
  responsable: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Diposercv", diposercvSchema);
