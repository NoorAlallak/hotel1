// controllers/dashboardController.js
const express = require("express");
const router = express.Router();
const { Booking, Room, User } = require("../Models/Associations");
const { Op } = require("sequelize");
const { authenticate, authorize } = require("../Middleware/AuthMiddleware");

// GET /dashboard/status
router.get(
  "/status",
  authenticate,
  authorize(["admin", "manager"]),
  async (req, res) => {
    try {
      const today = new Date();
      const startOfDay = new Date(today.setHours(0, 0, 0, 0));
      const endOfDay = new Date(today.setHours(23, 59, 59, 999));

      // Today's confirmed bookings
      const todayBookings = await Booking.count({
        where: {
          status: "confirmed",
          createdAt: { [Op.between]: [startOfDay, endOfDay] },
        },
      });

      // Occupancy rate
      const totalRooms = await Room.count();
      const occupiedRooms = await Booking.count({
        where: {
          status: "confirmed",
          checkInDate: { [Op.lte]: today },
          checkOutDate: { [Op.gte]: today },
        },
      });
      const occupancyRate = totalRooms
        ? ((occupiedRooms / totalRooms) * 100).toFixed(0)
        : 0;

      // Revenue using basePrice
      const bookingsWithRooms = await Booking.findAll({
        where: { status: "confirmed" },
        include: [{ model: Room, as: "room", attributes: ["basePrice"] }],
      });

      const revenue = bookingsWithRooms.reduce(
        (sum, booking) => sum + Number(booking.room?.basePrice || 0),
        0
      );

      res.json({ todayBookings, occupancyRate, revenue });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// GET /dashboard/recent-actions
router.get(
  "/recent-actions",
  authenticate,
  authorize(["admin", "manager"]),
  async (req, res) => {
    try {
      const recentBookings = await Booking.findAll({
        order: [["updatedAt", "DESC"]],
        limit: 10,
        include: [{ model: User, as: "user", attributes: ["id", "username"] }],
      });

      const recentActions = recentBookings.map((b) => ({
        id: b.id,
        action: `Booking ${b.status}`,
        user: b.user?.username || "Unknown",
        time: b.updatedAt,
      }));

      res.json(recentActions);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;
