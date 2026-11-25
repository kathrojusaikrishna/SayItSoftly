const Card = require("../models/Card");

const ID_PATTERN = /^[a-z2-9]{12}$/;
const MAX_CIPHERTEXT_CHARS = 12_000_000;

exports.createCard = async (req, res) => {
  try {
    const { v, salt, iv, ct } = req.body || {};
    if (!ID_PATTERN.test(req.params.id) || v !== 1 ||
        typeof salt !== "string" || typeof iv !== "string" ||
        typeof ct !== "string" || ct.length > MAX_CIPHERTEXT_CHARS) {
      return res.status(400).json({ error: "Invalid encrypted card payload." });
    }
    // Create-only: a caller cannot overwrite a card by reusing its ID.
    await Card.create({ _id: req.params.id, v, salt, iv, ct });
    return res.status(201).json({ ok: true });
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ error: "Card ID collision. Please create the card again." });
    if (error.name === "ValidationError") return res.status(400).json({ error: "Invalid card data." });
    console.error("Card create failed:", error.message);
    return res.status(500).json({ error: "Could not save this card." });
  }
};

exports.getCard = async (req, res) => {
  try {
    if (!ID_PATTERN.test(req.params.id)) return res.status(400).json({ error: "Invalid card ID." });
    const card = await Card.findById(req.params.id).select("v salt iv ct").lean();
    if (!card) return res.status(404).json({ error: "Card not found." });
    return res.json(card);
  } catch (error) {
    console.error("Card fetch failed:", error.message);
    return res.status(500).json({ error: "Could not retrieve this card." });
  }
};