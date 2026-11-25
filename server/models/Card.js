const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  v: { type: Number, required: true },
  salt: { type: String, required: true },
  iv: { type: String, required: true },
  ct: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 60 * 60 * 24 * 365 }
}, { versionKey: false });

module.exports = mongoose.model("Card", cardSchema);