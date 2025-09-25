const express = require("express");
const sequelize = require("./db");
const Hotel = require("./Models/Hotel");
const User = require("./Models/User");
const Room = require("./Models/Room");
const Booking = require("./Models/Booking");
const SeasonalPrice = require("./Models/SeasonalPrice");
const path = require("path");
const app = express();
const cores = require("cors");
app.use(
  cores({
    origin: true,
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
    credentials: true,
  })
);
const DashboardController = require("./Controllers/DashboardController");
const AuthController = require("./Controllers/AuthController");
const HotelsController = require("./Controllers/HotelsController");
const RoomController = require("./Controllers/RoomController");
const BookingController = require("./Controllers/BookingController");
const ReportsController = require("./Controllers/ReportsController");
const SearchController = require("./Controllers/SearchController");
const { authenticate, authorize } = require("./Middleware/AuthMiddleware");
const UserController = require("./Controllers/UserController");
app.use(express.json());
app.use("/users", authenticate, authorize("admin"), UserController);
app.use("/auth", AuthController);
app.use("/hotels", HotelsController);
app.use(
  "/reports",
  authenticate,
  authorize("admin,manager"),
  ReportsController
);
app.use(
  "/dashboard",
  authenticate,
  authorize("admin,manager"),
  DashboardController
);
app.use("/search", SearchController);
app.use("/rooms", RoomController);
app.use("/bookings", BookingController);
app.use(
  "/uploads/rooms",
  express.static(path.join(__dirname, "uploads/rooms"))
);

app.get("/admin", authenticate, authorize("admin"), (req, res) => {
  res.json({ message: `Welcome, Admin! ${req.user.id}` });
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connection established.");

    await sequelize.sync();
    console.log("✅ All models were synchronized successfully.");

    app.listen(3000, () => {
      console.log(" Server running at http://localhost:3000");
    });
  } catch (error) {
    console.error("Error syncing models:", error);
  }
})();
app.get("/", (req, res) => {
  res.send("Welcome to the Hotel Management System API");
});
module.exports = app;
