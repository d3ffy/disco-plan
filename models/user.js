const { DataTypes } = require('sequelize');
const sequelize = require('../src/config/databaseConfig'); // Import the Sequelize instance

// Define the User model
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  discord_id: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tokens: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'users', // Optional: specify table name if it's different from model name
  timestamps: false,  // Optional: set to true if you want to include createdAt/updatedAt timestamps
});

module.exports = User;