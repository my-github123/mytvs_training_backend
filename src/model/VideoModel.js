const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Post = sequelize.define("VideosList", {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  videoId: {
    type: DataTypes.INTEGER,
    // allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  Title: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  TumbNailImage: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  Description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  VideoUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isLiked: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
  Comment: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  commentCount: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  likeCount: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  isDisabled: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  Date: {
    // Add this line to define the Date column
    type: DataTypes.DATE,
    allowNull: true,
  },
});

Post.associate = (models) => {
  Post.hasMany(models.Like, {
    foreignKey: "videoId",
    as: "likes",
  });
};

module.exports = Post;
