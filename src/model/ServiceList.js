const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const ServiceList = sequelize.define("ServiceList", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  serviceType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = ServiceList;
