const { User, Event, EventUser } = require('../models');
const { google } = require('googleapis');
const { oauthClient } = require('./config/oauthConfig');
const { getUser } = require('./utility');

async function findAllEvents() {
  try {
    const events = await Event.findAll();
    return events;
  } catch (error) {
    console.error('Error finding all events:', error);
    return { error: 'Failed to find all events.' };
  }
}

async function findEvent(event_id) {
  try {
    const event = await Event.findOne({
      where: {
        id: event_id
      }
    });
    return event;
  } catch (error) {
    console.error('Error finding event:', error);
    return { error: 'Failed to find event.' };
  }
}

async function findOwnedEvents(interaction) {
  const user = await getUser(interaction);
  if (!user) {
    return { error: `${interaction.user.username} not registered to deffy-bot.` };
  }
  try {
    const result = await getUserEvents(user.discord_id);
    console.log(result);
    // List events id from event_user
    const events = await EventUser.findAll({
      where: {
        owned: user.discord_id
      }
    })
    // List events from event table
    const ownedEvent = await Event.findAll({
      where: {
        id: events.map(event => event.event_id)
      }
    })
    return ownedEvent
  } catch (error) {
    console.error('Error finding owned events:', error);
    return { error: 'Failed to find owned events.' };
  }
}

async function addEvent(interaction) {
  const user = await getUser(interaction);
  if (!user) {
    return { error: `${interaction.user.username} not registered to deffy-bot.` };
  }
  let startTime, endTime;
  // Check if start_time is a valid date
  if (interaction.options.getString('start_time')) {
    startTime = new Date(interaction.options.getString('start_time'));
    if (startTime.toString() === 'Invalid Date') {
      return { error: 'Invalid start time.' };
    }
  }
  // Check if end_time is a valid date
  if (interaction.options.getString('end_time')) {
    endTime = new Date(interaction.options.getString('end_time'));
    if (endTime.toString() === 'Invalid Date') {
      return { error: 'Invalid end time.' };
    }
  }
  try {
    const event = await Event.create({
      title: interaction.options.getString('title'),
      description: interaction.options.getString('description'),
      start_time: startTime,
      end_time: endTime,
    });
    const eventUser = await addEventUser(event.id, user.discord_id);
    if (eventUser.error) {
      return eventUser.error;
    } else {
      return event;
    }
  } catch (error) {
    console.error('Error adding event:', error);
    return { error: 'Failed to add event.' };
  }
}

async function removeEvents(interaction) {
  const user = await getUser(interaction);
  if (!user) {
    return { error: `${interaction.user.username} not registered to deffy-bot.` };
  }
  try {
    // Save event title name
    const eventTitle = await Event.findOne({
      where: {
        id: interaction.options.getInteger('id')
      }
    })
    if (!eventTitle) {
      return { error: 'Event not found.' };
    }

    try {
      // Remove event from event table
      const event = await Event.destroy({
        where: {
          id: interaction.options.getInteger('id')
        }
      });
  
      // Remove event from event_user table
      const eventUser = await EventUser.destroy({
        where: {
          event_id: interaction.options.getInteger('id')
        }
      })
      return eventTitle;

    } catch (error) {
      console.error('Error removing event:', error);
      return { error: 'Failed to remove event.' };
    }

  } catch (error) {
    console.error('Error removing event:', error);
    return { error: 'Failed to remove event.' };
  }
}

async function addEventUser(event_id, discord_id) {
  try {
    const event = await findEvent(event_id);
    if (!event) {
      return { error: 'Event not found.' };
    }
    const existingEventUser = await EventUser.findOne({
      where: {
        event_id: event_id,
        owned: discord_id
      }
    })
    if (existingEventUser) {
      return { error: 'User already added to this event.' };
    }
    const eventUser = await EventUser.create({
      event_id: event_id,
      owned: discord_id,
    });
    return eventUser;
  } catch (error) {
    console.error('Error adding event user:', error);
    return { error: 'Failed to add event user.' };
  }
}

async function removeEventUser(event_id, discord_id) {
  try {
    const event = await findEvent(event_id);
    if (!event) {
      return { error: 'Event not found.' };
    }
    const eventUser = await EventUser.destroy({
      where: {
        event_id: event_id,
        owned: discord_id
      }
    });
    return eventUser;
  } catch (error) {
    console.error('Error removing event user:', error);
    return { error: 'Failed to remove event user.' };
  }
}

async function getUserEvents(userId) {
  try {
      // Retrieve user tokens from the database
      const user = await User.findOne({ where: { discord_id: userId } });
      if (!user || !user.tokens) {
          return 'You need to authenticate first! Use `!auth`.';
      }

      const tokens = JSON.parse(user.tokens);

      // Set credentials for OAuth client
      oauthClient.setCredentials(tokens);

      const calendar = google.calendar({ version: 'v3', auth: oauthClient });
      const res = await calendar.events.list({
          calendarId: 'primary',
          timeMin: new Date().toISOString(),
          maxResults: 5,
          singleEvents: true,
          orderBy: 'startTime',
      });

      const events = res.data.items;
      if (!events.length) return 'No upcoming events found.';

      return events.map(event => `📅 ${event.summary} - ${event.start.dateTime || event.start.date}`).join('\n');
  } catch (error) {
      console.error('Error fetching events:', error);
      return 'Failed to fetch events. Please try again.';
  }
}


module.exports = {
  findAllEvents,
  findEvent,
  findOwnedEvents,
  addEvent,
  removeEvents,
  addEventUser,
  removeEventUser,
}