const { DataTypes, Model } = require("sequelize");
const sequelize = require("../db");
class Hotel extends Model {}
Hotel.init(
  {
    name: { type: DataTypes.STRING, allowNull: false },
    city: { type: DataTypes.STRING, allowNull: false },
    address: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    coverImage: { type: DataTypes.STRING, allowNull: false },
    manager: { type: DataTypes.STRING, allowNull: false },
    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    sequelize,
    modelName: "Hotel",
    tableName: "hotels",
  }
);

module.exports = Hotel;
