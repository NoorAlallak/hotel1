const express = require("express");
const router = express.Router();
const Coupon = require("../Models/Coupon");
const { authenticate, authorize } = require("../Middleware/AuthMiddleware");

router.get("/", authenticate, async (req, res, next) => {
  try {
    const coupons = await Coupon.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.json(coupons);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", authenticate, async (req, res, next) => {
  try {
    const coupon = await Coupon.findByPk(req.params.id);
    if (!coupon) {
      return res.status(404).json({ error: "Coupon not found" });
    }
    res.json(coupon);
  } catch (err) {
    next(err);
  }
});

router.post(
  "/",
  authenticate,
  authorize(["admin", "manager"]),
  async (req, res, next) => {
    try {
      const data = req.body;
      const coupon = await Coupon.create(data);
      res.status(201).json(coupon);
    } catch (err) {
      if (err.name === "SequelizeUniqueConstraintError") {
        return res.status(400).json({ error: "Coupon code must be unique" });
      }
      next(err);
    }
  }
);

router.patch(
  "/:id",
  authenticate,
  authorize(["admin", "manager"]),
  async (req, res, next) => {
    try {
      const coupon = await Coupon.findByPk(req.params.id);
      if (!coupon) {
        return res.status(404).json({ error: "Coupon not found" });
      }
      await coupon.update(req.body);
      res.json(coupon);
    } catch (err) {
      next(err);
    }
  }
);

router.delete(
  "/:id",
  authenticate,
  authorize(["admin", "manager"]),
  async (req, res, next) => {
    try {
      const coupon = await Coupon.findByPk(req.params.id);
      if (!coupon) {
        return res.status(404).json({ error: "Coupon not found" });
      }
      await coupon.destroy();
      res.json({ message: "Coupon deleted" });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
