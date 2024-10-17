

const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const PdfText = sequelize.define('PdfText', {
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  });

  module.exports=PdfText;