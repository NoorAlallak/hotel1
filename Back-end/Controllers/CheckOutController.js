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

// Checkout a booking: apply coupon and seasonal price, then delete booking
router.post("/:id", authenticate, async (req, res) => {
  const { couponCode } = req.body;
  const bookingId = req.params.id;

  try {
    const booking = await Booking.findByPk(bookingId, {
      include: [{ model: Room, as: "room" }],
    });

    if (!booking || booking.status !== "confirmed") {
      return res
        .status(404)
        .json({ message: "Booking not found or not confirmed" });
    }

    let totalPrice = booking.room.basePrice;

    // Apply seasonal price if applicable
    const seasonal = await SeasonalPrice.findOne({
      where: {
        room_id: booking.room.id, // matches your association
        startDate: { [Op.lte]: booking.checkInDate },
        endDate: { [Op.gte]: booking.checkOutDate },
      },
    });

    if (seasonal) totalPrice = seasonal.price;

    // Apply coupon if provided
    if (couponCode) {
      const coupon = await Coupon.findOne({ where: { code: couponCode } });
      if (coupon) {
        if (coupon.type === "percentage") {
          totalPrice -= (totalPrice * coupon.discount) / 100;
        } else {
          totalPrice -= coupon.discount;
        }
        if (totalPrice < 0) totalPrice = 0;
      }
    }

    // Delete booking after checkout
    await booking.destroy();

    res.json({ message: "Checkout successful", totalPrice, bookingId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
