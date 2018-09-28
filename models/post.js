'use strict';
const Sequelize = require('sequelize');
const sequelize = new Sequelize(
  'postgres://postgres:postgres@localhost/board2', {
    logging: true,
    operatorsAliases: false
  });
const Post = sequelize.define('Post', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  content: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  postedBy: {
    type: Sequelize.STRING,
    allowNull: false //googleのdisplayName
  },
  postId: {
    type: Sequelize.STRING,
    allowNull: false //googleのid
  },
  postedAt: {
    type: Sequelize.DATE,
    allowNull: false
  }
}, {
  freezeTableName: true,
  timestamps: true
});

Post.sync();
module.exports = Post;