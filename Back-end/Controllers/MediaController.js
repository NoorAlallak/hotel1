const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Media = require("../Models/Media");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = "./uploads";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.get("/", async (req, res) => {
  try {
    const media = await Media.findAll({ order: [["uploaded", "DESC"]] });
    res.json(media);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.post("/", upload.array("files[]", 10), async (req, res) => {
  try {
    const files = req.files;
    const newMedia = await Promise.all(
      files.map((file) =>
        Media.create({
          name: file.originalname,
          type: file.mimetype.startsWith("image/") ? "image" : "file",
          size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
          url: `/uploads/${file.filename}`,
        })
      )
    );
    res.status(201).json(newMedia);
  } catch (err) {
    res.status(500).json({ message: "Upload failed", error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const media = await Media.findByPk(req.params.id);
    if (!media) return res.status(404).json({ message: "Media not found" });

    const filePath = path.join(
      __dirname,
      "../uploads",
      path.basename(media.url)
    );
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await media.destroy();
    res.json({ message: "Media deleted", id: req.params.id });
  } catch (err) {
    res.status(500).json({ message: "Delete failed", error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const media = await Media.findByPk(req.params.id);
    if (!media) return res.status(404).json({ message: "Media not found" });

    const { name } = req.body;
    media.name = name || media.name;
    await media.save();
    res.json(media);
  } catch (err) {
    res.status(500).json({ message: "Update failed", error: err.message });
  }
});

module.exports = router;
