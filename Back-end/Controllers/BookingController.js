const express = require("express");
const router = express.Router();
const { Booking, Room, User, Hotel } = require("../Models/Associations");
const { Op } = require("sequelize");
const { authenticate } = require("../Middleware/AuthMiddleware");

router.post("/", async (req, res) => {
  const { roomId, userId, checkInDate, checkOutDate, guestsCount } = req.body;
  req.body;

  try {
    const overlap = await Booking.findOne({
      where: {
        roomId,
        status: "confirmed",
        [Op.not]: [
          {
            [Op.or]: [
              { checkOutDate: { [Op.lte]: checkInDate } },
              { checkInDate: { [Op.gte]: checkOutDate } },
            ],
          },
        ],
      },
    });

    if (overlap) {
      return res
        .status(409)
        .json({ message: "Room is not available for these dates" });
    }

    const booking = await Booking.create({
      roomId,
      userId,
      checkInDate,
      checkOutDate,
      guestsCount,
    });

    res.status(201).json(booking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.patch("/:id", async (req, res) => {
  console.log("PATCH body:", req.body);

  const { status } = req.body;
  if (!["confirmed", "cancelled"].includes(status)) {
    return res
      .status(400)
      .json({ message: "Invalid status", statusReceived: status });
  }

  try {
    const booking = await Booking.findByPk(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    booking.status = status;
    await booking.save({ fields: ["status"] });
    res.json({ message: `Booking ${status}`, booking });
  } catch (err) {
    console.error("Error in cancel patch:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});
router.get("/", authenticate, async (req, res) => {
  try {
    const userId = req.user.id;

    const bookings = await Booking.findAll({
      where: { userId },
      include: [
        {
          model: Room,
          as: "room",
          attributes: ["id", "type", "basePrice", "hotelId"],
          include: [
            {
              model: Hotel,
              as: "hotel",
              attributes: ["id", "name", "city", "address"],
            },
          ],
        },
      ],
      order: [["checkInDate", "DESC"]],
    });

    res.json(bookings);
  } catch (err) {
    console.error("Error fetching user bookings:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/calendar-events", async (req, res) => {
  try {
    const { hotelId } = req.query;
    const where = { status: "confirmed" };
    if (hotelId) where["$Room.hotelId$"] = hotelId;

    const bookings = await Booking.findAll({
      where,
      include: [
        { model: Room, as: "room", attributes: ["id", "type", "hotelId"] },
      ],
    });

    const events = bookings.map((b) => ({
      id: b.id,
      title: `Room ${b.room.type} Booking #${b.id}`,
      start: b.checkInDate,
      end: b.checkOutDate,
      status: b.status,
    }));

    res.json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load calendar data" });
  }
});
module.exports = router;
