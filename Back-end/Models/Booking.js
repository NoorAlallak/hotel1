const { Model, DataTypes } = require("sequelize");
const sequelize = require("../db");
class Booking extends Model {
  static associate(models) {
    Booking.belongsTo(models.Room, {
      foreignKey: "room_id",
      as: "room",
    });
    Booking.belongsTo(models.User, {
      foreignKey: "user_id",
      as: "user",
    });
  }
}
Booking.init(
  {
    checkInDate: { type: DataTypes.DATE, allowNull: false },
    checkOutDate: { type: DataTypes.DATE, allowNull: false },
    status: {
      type: DataTypes.ENUM("pending", "confirmed", "cancelled"),
      defaultValue: "pending",
    },
    guestsCount: { type: DataTypes.INTEGER, allowNull: false },
    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    sequelize,
    modelName: "Booking",
    tableName: "bookings",
  }
);

module.exports = Booking;
