const express = require("express");
const router = express.Router();
router.get("/occupancy", async (req, res) => {
  const { start, end } = req.query;

  const bookings = await Booking.findAll({
    where: {
      checkIn: { [Op.lte]: end },
      checkOut: { [Op.gte]: start },
    },
  });

  const totalRooms = await Room.count();

  const occupancyRate = ((bookings.length / totalRooms) * 100).toFixed(2);

  res.json({ occupancyRate: `${occupancyRate}%` });
});
router.get("/revenue", async (req, res) => {
  const { start, end } = req.query;

  const bookings = await Booking.findAll({
    where: {
      checkIn: { [Op.lte]: end },
      checkOut: { [Op.gte]: start },
      status: "confirmed",
    },
    include: Room,
  });

  let revenue = 0;
  bookings.forEach((b) => {
    revenue += b.Room.basePrice;
  });

  res.json({ revenue });
});
router.get("/top-rooms", async (req, res) => {
  const limit = parseInt(req.query.limit) || 5;

  const topRooms = await Booking.findAll({
    attributes: [
      "roomId",
      [sequelize.fn("COUNT", sequelize.col("roomId")), "bookingsCount"],
    ],
    group: ["roomId"],
    order: [[sequelize.literal("bookingsCount"), "DESC"]],
    limit,
    include: Room,
  });

  res.json(topRooms);
});
module.exports = router;
