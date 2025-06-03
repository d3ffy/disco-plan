const sequelize = require('../src/config/databaseConfig');
const User = require('./user');
const Event = require('./event');
const EventUser = require('./event_user');

// Define associations (many-to-many)
User.belongsToMany(Event, {
  through: EventUser,
  foreignKey: 'discord_id',
  otherKey: 'event_id',
});

Event.belongsToMany(User, {
  through: EventUser,
  foreignKey: 'event_id',
  otherKey: 'discord_id',
});

// Sync models with the database
sequelize.sync()
  .then(() => {
    console.log('Models have been synchronized.');
  })
  .catch((err) => {
    console.error('Error syncing models:', err);
  });

// Export the models
module.exports = { User, Event, EventUser };