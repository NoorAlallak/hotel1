const { Model, DataTypes } = require("sequelize");
const sequelize = require("../db");

class SeasonalPrice extends Model {}

SeasonalPrice.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "SeasonalPrice",
    tableName: "seasonal_prices",
    timestamps: true,
  }
);

module.exports = SeasonalPrice;
