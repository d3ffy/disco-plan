const express = require('express');
const { google } = require('googleapis');
const app = express();
const { oauthClient } = require('../config/oauthConfig');
const { User } = require('../../models');
const { AUTH_SERVER_PORT, AUTH_SERVER_URL } = require('../config/config');

app.get('/', (req, res) => {
    res.send('Hello! You can now authenticate the bot with Google Calendar.');
})

app.get('/auth', (req, res) => {
    const discordUserId = req.query.user_id; // Get from Discord bot command
    const authUrl = oauthClient.generateAuthUrl({
        access_type: 'offline',
        scope: ['https://www.googleapis.com/auth/calendar'],
        state: discordUserId, // Store Discord ID as state
    });
    res.redirect(authUrl);
});

app.get('/oauth2callback', async (req, res) => {
    const code = req.query.code;

    if (!code) {
        return res.send('No authorization code provided');
    }

    try {
        const { tokens } = await oauthClient.getToken(code);
        oauthClient.setCredentials(tokens);

        // Save tokens and associate them with the user ID (state)
        await saveTokens(req.query.state, tokens);

        res.send('Authorization successful! You can now use Google Calendar with the bot.');
    } catch (error) {
        console.error('Error exchanging code for tokens:', error);
        res.send('Authorization failed. Please try again.');
    }
});

async function saveTokens(userId, tokens) {
    // Save the tokens securely in a database, associated with the user ID
    try {
        await User.update({ tokens: JSON.stringify(tokens) }, { where: { discord_id: userId } });
    } catch (error) {
        console.error('Error saving tokens:', error);
    }
}

app.listen(AUTH_SERVER_PORT, () => {
    console.log(`OAuth2 Server running on ${AUTH_SERVER_URL}`);
});
