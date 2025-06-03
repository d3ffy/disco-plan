const { DataTypes } = require("sequelize");
const sequelize = require("../src/config/databaseConfig");

// Define the EventUser junction table
const EventUser = sequelize.define('EventUser', {
    event_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    owned: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    discord_id: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: 'event_users',
    timestamps: false,
});

module.exports = EventUser;
