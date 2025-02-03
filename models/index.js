const sequelize = require('../src/config/databaseConfig'); // Import the sequelize instance
const User = require('./user');
const Event = require('./event');
const EventUser = require('./event_user');

// Set up associations (many-to-many relationship between users and events)
User.belongsToMany(Event, { through: EventUser, foreignKey: 'discord_id' });
Event.belongsToMany(User, { through: EventUser, foreignKey: 'event_id' });

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