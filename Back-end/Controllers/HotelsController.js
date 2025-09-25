const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const Hotel = require("../Models/Hotel");

const validateHotelData = (data, isUpdate = false) => {
  const errors = [];

  if (!isUpdate || data.name !== undefined) {
    if (!data.name || data.name.trim() === "") {
      errors.push("Name is required");
    }
  }

  if (!isUpdate || data.city !== undefined) {
    if (!data.city || data.city.trim() === "") {
      errors.push("City is required");
    }
  }

  if (!isUpdate || data.address !== undefined) {
    if (!data.address || data.address.trim() === "") {
      errors.push("Address is required");
    }
  }

  if (!isUpdate || data.description !== undefined) {
    if (!data.description || data.description.trim() === "") {
      errors.push("Description is required");
    }
  }

  if (!isUpdate || data.coverImage !== undefined) {
    if (!data.coverImage || data.coverImage.trim() === "") {
      errors.push("Cover image is required");
    }
  }

  if (!isUpdate || data.manager !== undefined) {
    if (!data.manager || data.manager.trim() === "") {
      errors.push("Manager is required");
    }
  }

  return errors;
};

router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    const q = req.query.q || "";

    const where = q
      ? {
          [Op.or]: [
            { name: { [Op.like]: `%${q}%` } },
            { city: { [Op.like]: `%${q}%` } },
            { manager: { [Op.like]: `%${q}%` } },
          ],
        }
      : {};

    const { rows, count } = await Hotel.findAndCountAll({
      where,
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    res.json({
      hotels: rows,
      total: count,
      page,
      pages: Math.ceil(count / limit),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const hotel = await Hotel.findByPk(req.params.id);
    if (!hotel) return res.status(404).json({ message: "Hotel not found" });
    res.json(hotel);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const errors = validateHotelData(req.body);
    if (errors.length > 0) {
      return res.status(400).json({
        message: "Validation failed",
        errors,
      });
    }

    const hotel = await Hotel.create(req.body);
    res.status(201).json(hotel);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const hotel = await Hotel.findByPk(req.params.id);
    if (!hotel) return res.status(404).json({ message: "Hotel not found" });

    const errors = validateHotelData(req.body, true);
    if (errors.length > 0) {
      return res.status(400).json({
        message: "Validation failed",
        errors,
      });
    }

    await hotel.update(req.body);
    res.json(hotel);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const hotel = await Hotel.findByPk(req.params.id);
    if (!hotel) return res.status(404).json({ message: "Hotel not found" });

    await hotel.destroy();
    res.json({ message: "Hotel deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
