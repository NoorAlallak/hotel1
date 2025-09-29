const express = require("express");
const router = express.Router();
const Favorite = require("../Models/Favorite");
const { Hotel } = require("../Models/Associations");
const { authenticate } = require("../Middleware/AuthMiddleware");

router.get("/", authenticate, async (req, res) => {
  try {
    const favorites = await Favorite.findAll({
      where: { userId: req.user.id },
      include: [{ model: Hotel, as: "Hotel" }],
    });
    res.json(favorites);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/", authenticate, async (req, res) => {
  const { hotelId } = req.body;
  try {
    const existing = await Favorite.findOne({
      where: { userId: req.user.id, hotelId },
    });
    if (existing) return res.status(409).json({ message: "Already favorited" });

    const favorite = await Favorite.create({
      userId: req.user.id,
      hotelId,
    });
    res.status(201).json(favorite);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:hotelId", authenticate, async (req, res) => {
  try {
    const favorite = await Favorite.findOne({
      where: { userId: req.user.id, hotelId: req.params.hotelId },
    });
    if (!favorite) return res.status(404).json({ message: "Not found" });

    await favorite.destroy();
    res.json({ message: "Favorite removed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
