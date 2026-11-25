require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cardRoutes = require("./routes/cardRoutes");

const app = express();
app.disable("x-powered-by");
app.use(express.json({ limit: "12mb" }));

app.get("/api/health", (req, res) => {
  res.json({ ok: true, database: mongoose.connection.readyState === 1 });
});
app.use("/api/cards", cardRoutes);

if (process.env.NODE_ENV === "production") {
  const clientDist = path.join(__dirname, "../../client/dist");
  app.use(express.static(clientDist));
  app.get("*", (req, res) => res.sendFile(path.join(clientDist, "index.html")));
}

const port = process.env.PORT || 3000;
if (!process.env.MONGODB_URI) {
  console.error("Missing MONGODB_URI environment variable.");
  process.exit(1);
}
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  });

app.listen(port, () => console.log(`Say it softly API listening on ${port}`));