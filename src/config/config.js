require('dotenv').config();

// Instant environment variables
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const USER_ID = process.env.USER_ID;
const GUILD_ID = process.env.GUILD_ID;

if (!DISCORD_TOKEN || !USER_ID || !GUILD_ID) {
    console.warn('[ENV] Discord bot credentials are not set. Please check your .env file.');
}

// Google variables
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REDIRECT_URI) {
    console.warn('[ENV] Google OAuth2 credentials are not set. Please check your .env file.');
}

module.exports = {
    DISCORD_TOKEN,
    USER_ID,
    GUILD_ID,
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI
}