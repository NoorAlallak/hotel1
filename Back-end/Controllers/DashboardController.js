const express = require("express");
const router = express.Router();
const { Booking, Room, User } = require("../Models/Associations");
const { Op } = require("sequelize");
const { authenticate, authorize } = require("../Middleware/AuthMiddleware");

router.get(
  "/status",
  authenticate,
  authorize(["admin", "manager"]),
  async (req, res) => {
    try {
      const now = new Date();
      const startOfToday = new Date(now);
      startOfToday.setHours(0, 0, 0, 0);

      const endOfToday = new Date(now);
      endOfToday.setHours(23, 59, 59, 999);

      // Fix for Today's Bookings: Count bookings that occur TODAY
      const todayBookings = await Booking.count({
        where: {
          [Op.or]: [
            // Bookings that start today
            {
              checkInDate: {
                [Op.gte]: startOfToday,
                [Op.lte]: endOfToday,
              },
            },
            // Bookings that are ongoing today
            {
              checkInDate: { [Op.lte]: startOfToday },
              checkOutDate: { [Op.gte]: endOfToday },
            },
            // Bookings that end today
            {
              checkOutDate: {
                [Op.gte]: startOfToday,
                [Op.lte]: endOfToday,
              },
            },
          ],
          status: { [Op.in]: ["confirmed", "completed"] },
        },
      });

      const totalRooms = await Room.count();

      // Fix for Occupancy Rate: Count rooms occupied RIGHT NOW
      const currentTime = new Date();
      const occupiedRooms = await Booking.count({
        where: {
          checkInDate: { [Op.lte]: currentTime },
          checkOutDate: { [Op.gte]: currentTime },
          status: { [Op.in]: ["confirmed", "completed"] },
        },
        distinct: true,
        col: "roomId", // Count unique rooms to avoid double-counting
      });

      const occupancyRate = totalRooms
        ? ((occupiedRooms / totalRooms) * 100).toFixed(0)
        : 0;

      const bookingsWithRooms = await Booking.findAll({
        where: {
          status: { [Op.in]: ["confirmed", "completed"] },
        },
        include: [{ model: Room, as: "room", attributes: ["basePrice"] }],
      });

      const revenue = bookingsWithRooms.reduce(
        (sum, booking) => sum + (Number(booking.room?.basePrice) || 0),
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
