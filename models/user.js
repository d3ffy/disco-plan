const { DataTypes } = require('sequelize');
const sequelize = require('../src/config/databaseConfig'); // Import the Sequelize instance

// Define the User model
const User = sequelize.define('User', {
  discord_id: {
    primaryKey: true,
    type: DataTypes.STRING,
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: DataTypes.STRING,
  tokens: DataTypes.TEXT
}, {
  tableName: 'users',
  timestamps: false,
});

module.exports = User;