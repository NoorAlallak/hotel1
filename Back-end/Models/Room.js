const { DataTypes, Model } = require("sequelize");
const sequelize = require("../db");

class Room extends Model {}

Room.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    hotelId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "Hotels", key: "id" },
      onDelete: "CASCADE",
    },
    type: {
      type: DataTypes.ENUM("single", "double", "suite", "family"),
      allowNull: false,
    },
    capacity: { type: DataTypes.INTEGER, allowNull: false },
    basePrice: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    description: { type: DataTypes.TEXT },
    images: { type: DataTypes.JSON },
    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  { sequelize, modelName: "Room" }
);

module.exports = Room;
