const express = require("express");
const rateLimit = require("express-rate-limit");
const { createCard, getCard } = require("../controllers/cardController");

const router = express.Router();
const createLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 20, standardHeaders: "draft-7", legacyHeaders: false });
const readLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 60, standardHeaders: "draft-7", legacyHeaders: false });

router.post("/:id", createLimiter, createCard);
router.get("/:id", readLimiter, getCard);

module.exports = router;