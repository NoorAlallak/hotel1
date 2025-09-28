const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Coupon = sequelize.define(
  "Coupon",
  {
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    discount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM("Percentage", "Fixed"),
      allowNull: false,
    },
    validFrom: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    validTo: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    used: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    maxUses: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("Active", "Inactive", "Expired"),
      defaultValue: "Active",
    },
  },
  {
    tableName: "Coupons",
    timestamps: true,
  }
);

Coupon.addHook("beforeSave", (coupon, options) => {
  if (coupon.validTo < new Date()) {
    coupon.status = "Expired";
  }
});

module.exports = Coupon;
