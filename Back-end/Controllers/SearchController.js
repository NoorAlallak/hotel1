const express = require("express");
const { Op } = require("sequelize");
const router = express.Router();
module.exports = router;
const { Hotel, Room, Booking } = require("../Models/Associations");
router.get("/", async (req, res) => {
  try {
    let { city, checkIn, checkOut, guests, type, priceMin, priceMax } =
      req.query;

    guests = guests ? Number(guests) : undefined;
    priceMin = priceMin ? Number(priceMin) : undefined;
    priceMax = priceMax ? Number(priceMax) : undefined;

    if (checkIn && checkOut) {
      checkIn = new Date(checkIn);
      checkOut = new Date(checkOut);
      if (checkOut <= checkIn) {
        return res
          .status(400)
          .json({ error: "Check-out must be after check-in" });
      }
    }

    const hotels = await Hotel.findAll({
      where: city ? { city: { [Op.like]: `%${city}%` } } : undefined,
      include: {
        model: Room,
        as: "rooms", // match association alias
        where: {
          ...(type && { type }),
          ...(guests && { capacity: { [Op.gte]: guests } }),
          ...(priceMin !== undefined && priceMax !== undefined
            ? { basePrice: { [Op.between]: [priceMin, priceMax] } }
            : {}),
        },
      },
    });

    const result = [];

    for (const hotel of hotels) {
      const availableRooms = [];

      for (const room of hotel.rooms) {
        if (checkIn && checkOut) {
          const conflicts = await Booking.findOne({
            where: {
              roomId: room.id,
              [Op.or]: [
                { checkInDate: { [Op.between]: [checkIn, checkOut] } },
                { checkOutDate: { [Op.between]: [checkIn, checkOut] } },
                {
                  checkInDate: { [Op.lte]: checkIn },
                  checkOutDate: { [Op.gte]: checkOut },
                },
              ],
            },
          });
          if (!conflicts) availableRooms.push(room);
        } else {
          availableRooms.push(room);
        }
      }

      if (availableRooms.length > 0) {
        result.push({ hotel, rooms: availableRooms });
      }
    }

    res.json(result);
  } catch (err) {
    console.error("Search API error:", err);
    res.status(500).json({ error: "Server error" });
  }
});
