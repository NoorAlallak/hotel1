const sequelize = require("../db");
const Hotel = require("./Hotel");
const Room = require("./Room");
const Booking = require("./Booking");
const User = require("./User");
const SeasonalPrice = require("./SeasonalPrice");
const Coupon = require("./Coupon");
const Favorite = require("./Favorite");

Hotel.hasMany(Room, { foreignKey: "hotelId", as: "rooms" });
Room.belongsTo(Hotel, { foreignKey: "hotelId", as: "hotel" });

Room.hasMany(Booking, { foreignKey: "roomId", as: "bookings" });
Booking.belongsTo(Room, { foreignKey: "roomId", as: "room" });

User.hasMany(Booking, { foreignKey: "userId", as: "bookings" });
Booking.belongsTo(User, { foreignKey: "userId", as: "user" });

SeasonalPrice.belongsTo(Room, {
  foreignKey: "room_id",
  as: "room",
});
Room.hasMany(SeasonalPrice, {
  foreignKey: "room_id",
  as: "seasonalPrices",
});

User.hasMany(Favorite, { foreignKey: "userId" });
Favorite.belongsTo(User, { foreignKey: "userId" });

Hotel.hasMany(Favorite, { foreignKey: "hotelId" });
Favorite.belongsTo(Hotel, { foreignKey: "hotelId" });

module.exports = {
  sequelize,
  Hotel,
  Room,
  Booking,
  User,
  SeasonalPrice,
  Coupon,
  Favorite,
};
