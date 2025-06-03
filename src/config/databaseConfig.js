const { Sequelize } = require('sequelize');

const customLogging = (msg) => {
  if (msg.toLowerCase().includes('warning')) {
    console.warn(`[Sequelize Warning]: ${msg}`);
  } else if (msg.toLowerCase().includes('error')) {
    console.error(`[Sequelize Error]: ${msg}`);
  }
};

// Initialize Sequelize with SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './sqlite.db', // Path to your SQLite database file
  mode: 'OPEN_READWRITE',
  logging: (customLogging),
});

// Test the connection
sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = sequelize;