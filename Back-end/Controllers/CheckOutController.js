const express = require("express");
const router = express.Router();
const {
  Booking,
  Room,
  Coupon,
  SeasonalPrice,
} = require("../Models/Associations");
const { authenticate } = require("../Middleware/AuthMiddleware");
const { Op } = require("sequelize");

router.post("/:id", authenticate, async (req, res) => {
  const bookingId = req.params.id;
  const { couponCode } = req.body;

  try {
    const booking = await Booking.findByPk(bookingId, {
      include: [{ model: Room, as: "room" }],
    });

    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    if (req.user.role !== "admin" && booking.userId !== req.user.id) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    if (booking.status !== "confirmed") {
      return res
        .status(400)
        .json({ success: false, message: "Booking is not confirmed" });
    }

    let originalPrice = booking.room.basePrice;
    let totalPrice = originalPrice;
    let discount = 0;
    let couponApplied = false;

    const seasonal = await SeasonalPrice.findOne({
      where: {
        room_id: booking.room.id,
        startDate: { [Op.lte]: booking.checkInDate },
        endDate: { [Op.gte]: booking.checkOutDate },
      },
    });

    if (seasonal) {
      totalPrice = seasonal.price;
      originalPrice = seasonal.price;
    }

    if (couponCode) {
      const coupon = await Coupon.findOne({ where: { code: couponCode } });
      if (!coupon) {
        return res.status(400).json({
          success: false,
          couponApplied: false,
          message: "Invalid coupon code",
        });
      }
      couponApplied = true;

      if (coupon.type === "percentage") {
        discount = (totalPrice * coupon.discount) / 100;
      } else {
        discount = coupon.discount;
      }

      totalPrice -= discount;
      if (totalPrice < 0) totalPrice = 0;
    }

    await booking.update({ status: "completed" });

    res.json({
      success: true,
      totalPrice,
      originalPrice,
      discount,
      couponApplied,
      basePrice: booking.room.basePrice,
      bookingId: booking.id,
    });
  } catch (err) {
    console.error("Checkout error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
