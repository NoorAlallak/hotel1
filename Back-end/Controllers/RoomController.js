// routes/rooms.js
const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const multer = require("multer");

const Room = require("../Models/Room");
const Hotel = require("../Models/Hotel");
const SeasonalPrice = require("../Models/SeasonalPrice");

router.get("/hotel/:hotelId", async (req, res) => {
  try {
    const { hotelId } = req.params;

    const rooms = await Room.findAll({
      where: { hotelId: hotelId },
      include: [
        { model: Hotel, as: "hotel", attributes: ["id", "name"] },
        { model: SeasonalPrice, as: "seasonalPrices" },
      ],
      order: [["id", "ASC"]],
    });

    if (!rooms || rooms.length === 0) {
      return res.status(404).json({ error: "No rooms found for this hotel" });
    }

    res.json(rooms);
  } catch (err) {
    console.error("Error fetching rooms for hotel:", err);
    res.status(500).json({ error: err.message });
  }
});
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, "../uploads/rooms");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `room-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files allowed"), false);
    }
  },
});

// GET all rooms (with hotel name + seasonalPrices)
router.get("/", async (req, res) => {
  try {
    const rooms = await Room.findAll({
      include: [
        { model: Hotel, as: "hotel", attributes: ["id", "name"] },
        { model: SeasonalPrice, as: "seasonalPrices" },
      ],
      order: [["id", "ASC"]],
    });
    return res.json(rooms);
  } catch (err) {
    console.error("Error get rooms:", err);
    return res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const room = await Room.findByPk(req.params.id, {
      include: [
        { model: Hotel, as: "hotel", attributes: ["id", "name"] },
        { model: SeasonalPrice, as: "seasonalPrices" },
      ],
    });
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }
    return res.json(room);
  } catch (err) {
    console.error("Error get room:", err);
    return res.status(500).json({ error: err.message });
  }
});

router.post("/", upload.array("images", 5), async (req, res) => {
  try {
    const data = req.body;

    // Process images
    if (req.files && req.files.length > 0) {
      data.images = req.files.map((f) => `/uploads/rooms/${f.filename}`);
    } else {
      data.images = [];
    }

    const room = await Room.create(data);
    return res.status(201).json(room);
  } catch (err) {
    console.error("Error create room:", err);
    return res.status(400).json({ error: err.message });
  }
});

router.put("/:id", upload.array("images", 5), async (req, res) => {
  try {
    const room = await Room.findByPk(req.params.id);
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    const data = req.body;

    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((f) => `/uploads/rooms/${f.filename}`);
      const existing = room.images || [];
      data.images = existing.concat(newImages);
    }

    await room.update(data);
    return res.json(room);
  } catch (err) {
    console.error("Error update room:", err);
    return res.status(400).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const room = await Room.findByPk(req.params.id);
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    // Delete image files
    if (room.images && Array.isArray(room.images)) {
      room.images.forEach((imgPath) => {
        const full = path.join(__dirname, "..", imgPath);
        if (fs.existsSync(full)) {
          fs.unlinkSync(full);
        }
      });
    }

    await room.destroy();
    return res.json({ message: "Room deleted" });
  } catch (err) {
    console.error("Error delete room:", err);
    return res.status(500).json({ error: err.message });
  }
});

// DELETE single image from a room
router.delete("/:id/images", async (req, res) => {
  try {
    const { imageUrl } = req.body;
    const room = await Room.findByPk(req.params.id);
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }
    const imgs = room.images || [];
    const updated = imgs.filter((img) => img !== imageUrl);
    room.images = updated;
    await room.save();

    const full = path.join(__dirname, "..", imageUrl);
    if (fs.existsSync(full)) {
      fs.unlinkSync(full);
    }

    return res.json({ message: "Image removed" });
  } catch (err) {
    console.error("Error delete image:", err);
    return res.status(500).json({ error: err.message });
  }
});

// POST add seasonal price to room
router.post("/:id/seasonal-prices", async (req, res) => {
  try {
    const room = await Room.findByPk(req.params.id);
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }
    const sp = await SeasonalPrice.create({
      room_id: req.params.id,
      name: req.body.name,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      price: req.body.price,
    });
    return res.status(201).json(sp);
  } catch (err) {
    console.error("Error add seasonal price:", err);
    return res.status(400).json({ error: err.message });
  }
});

// DELETE a seasonal price (global)
router.delete("/seasonal-prices/:spId", async (req, res) => {
  try {
    const sp = await SeasonalPrice.findByPk(req.params.spId);
    if (!sp) {
      return res.status(404).json({ error: "SeasonalPrice not found" });
    }
    await sp.destroy();
    return res.json({ message: "Seasonal price removed" });
  } catch (err) {
    console.error("Error delete seasonal price:", err);
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
