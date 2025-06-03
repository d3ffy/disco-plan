const { DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../src/config/databaseConfig');

// Define the Event model
const Event = sequelize.define('Event', {
  event_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: DataTypes.STRING,
  description: DataTypes.STRING,
  start_time: DataTypes.DATE,
  end_time: DataTypes.DATE,
  created_at: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
  }
}, {
  tableName: 'events',
  timestamps: false,
});

module.exports = Event;