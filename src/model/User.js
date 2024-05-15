// userModel.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const User = sequelize.define("user", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  empId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  district: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phoneNumber: {
    type: DataTypes.STRING(25),
    allowNull: false,
  },
  designation: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  garageName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  garageType: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  garageId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  loginStatus: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "false",
  },
  appVersion: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  versionCode: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  manufacturer: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  model: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fromApp: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  sdkVersion: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  networkType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    onUpdate: DataTypes.NOW,
  },
});

module.exports = User;
