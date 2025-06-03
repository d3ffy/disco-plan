const { User, Event, EventUser } = require('../models');
const { google } = require('googleapis');
const { oauthClient } = require('./config/oauthConfig');
const { getUser } = require('./utility');

// List all events
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
        event_id: event_id
      }
    });
    return event;
  } catch (error) {
    console.error('Error finding event:', error);
    return { error: 'Failed to find event.' };
  }
}

// List all events owned by the user
async function findOwnedEvents(interaction) {
  const user = await getUser(interaction);
  if (!user) {
    return { error: `${interaction.user.username} not registered to deffy-bot.` };
  }
  try {
    // List events id from event_user
    const events = await EventUser.findAll({
      where: {
        owned: true,
        discord_id: user.discord_id
      }
    })
    // List events from event table
    const ownedEvent = await Event.findAll({
      where: {
        event_id: events.map(event => event.event_id)
      }
    })
    return ownedEvent
  } catch (error) {
    console.error('Error finding owned events:', error);
    return { error: 'Failed to find owned events.' };
  }
}

async function findRelatedEvents(interaction) {
  const user = await getUser(interaction);
  if (!user) {
    return { error: `${interaction.user.username} not registered to deffy-bot.` };
  }
  try {
    // List events id from event_user
    const events = await EventUser.findAll({
      where: {
        discord_id: user.discord_id
      }
    })
    // List events from event table
    const relatedEvent = await Event.findAll({
      where: {
        id: events.map(event => event.event_id)
      }
    })
    return relatedEvent;
  } catch (error) {
    console.error('Error finding related events:', error);
    return { error: 'Failed to find related events.' };
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
    const eventUser = await EventUser.create({
      event_id: event.event_id, 
      owned: true,
      discord_id: user.discord_id
    });
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
  const eventId = interaction.options.getInteger('id');
  if (!user) {
    return { error: `${interaction.user.username} not registered to deffy-bot.` };
  }
  try {
    // Save event title name
    const eventTitle = await Event.findOne({
      where: {
        event_id: interaction.options.getInteger('id'),
      }
    })

    if (!eventTitle) {
      return { error: 'Event not found.' };
    }

    // Check if the user is the owner of the event
    const ownedEvent = await EventUser.findOne({
      where: {
        event_id: eventId,
        owned: true,
        discord_id: user.discord_id
      }
    });

    if (!ownedEvent) {
      return { error: 'You are not the owner of this event.' };
    }

    try {
      // Remove event from event table
      await Event.destroy({
        where: {
          event_id: eventId,
        }
      });
  
      // Remove event from event_user table
      await EventUser.destroy({
        where: {
          event_id: eventId,
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

async function addEventMember(event_id, interaction, discord_id) {
  // Check if the user is registered
  const user = await getUser(interaction);
  if (!user) {
    return { error: `${interaction.user.username} not registered to deffy-bot.` };
  }
  try {
    // Check if the event exists and the user is the owner
    const event = await EventUser.findOne({
      where: {
        event_id: event_id,
        owned: true,
        discord_id: user.discord_id
      }
    })
    if (!event) {
      return { error: 'You are not the owner of this event or event not found.' };
    }

    // Add the related user to the event
    const relatedMember = await EventUser.create({
      event_id: event_id,
      owned: false,
      discord_id: discord_id
    })
    return relatedMember;
  } catch (error) {
    console.error('Error adding related user:', error);
    return { error: 'Failed to add related user.' };
  }
}

async function removeEventMember(event_id, interaction, discord_id) {
  // Check if the user is registered
  const user = await getUser(interaction);
  if (!user) {
    return { error: `${interaction.user.username} not registered to deffy-bot.` };
  }
  try {
    // Check if the event exists and the user is the owner
    const event = await EventUser.findOne({
      where: {
        event_id: event_id,
        owned: true,
        discord_id: user.discord_id
      }
    })
    if (!event) {
      return { error: 'You are not the owner of this event or event not found.' };
    }

    // Remove the related user from the event
    const removedMember = await EventUser.destroy({
      where: {
        event_id: event_id,
        owned: false,
        discord_id: discord_id
      }
    })
    return removedMember;
  } catch (error) {
    console.error('Error removing related user:', error);
    return { error: 'Failed to remove related user.' };
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
  addEventMember,
  removeEventMember,
  findRelatedEvents
}