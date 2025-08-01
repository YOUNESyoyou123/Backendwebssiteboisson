const mongoose = require("mongoose");
const Inscriptionclient = new mongoose.Schema({
  FullName: { type: String, required: true, unique: true },
  Password: { type: String, required: true },
  Role: { type: String, enum: ["admin", "superadmin"], default: "admin" },
});

module.exports = mongoose.model("Inscriptionclient", Inscriptionclient);
