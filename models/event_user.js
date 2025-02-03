// models/eventUser.js
const { DataTypes } = require('sequelize');
const sequelize = require('../src/config/databaseConfig');

// Define the EventUser junction table
const EventUser = sequelize.define('EventUser', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    event_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    owned: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    tableName: 'event_users',
    timestamps: false,
});

module.exports = EventUser;
