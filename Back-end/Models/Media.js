const { DataTypes, Model } = require("sequelize");
const sequelize = require("../db"); // your Sequelize instance

class Media extends Model {}

Media.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    type: { type: DataTypes.STRING, allowNull: false },
    size: { type: DataTypes.STRING, allowNull: false },
    url: { type: DataTypes.STRING, allowNull: false },
    uploaded: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  { sequelize, modelName: "Media", tableName: "media", timestamps: false }
);

module.exports = Media;
