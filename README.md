
# Disco-Plan Project

Synchonized Discord bot with Google Calendar.


## ⭐ Features

- **🔍 Add Events**:
Create events directly from Discord and sync them with Google Calendar. Supports setting titles, descriptions and start/end times.

- **🎯 Invite Attendees**:
Mention users in Discord to automatically add them as attendees in Google Calendar events, with invitation emails sent.

- **📅 List Upcoming Events**:
Display a list of upcoming Google Calendar events within Discord.

- **🔄 Two-Way Sync**:
Update on Google Calendar and reflect updates in Discord.

## ⚙ Getting started

### 📦 Prerequisites

Ensure you have the following installed:

- [npm](https://docs.npmjs.com/)
- [Docker](https://docs.docker.com/get-started/)
- [Docker Compose](https://docs.docker.com/compose/)

### 🛠 Installation

#### Install System Dependencies

```bash
  npm install
```

### 🔐 Environment Variables

Create a `.env` file in the root directory with the following variables:

| Variable | Description | Required |
|----------|-------------|:---------:|
| `DISCORD_TOKEN` | Discord Bot Token | ✅ |
| `GUILD_ID` | Discord Server ID | ✅ |
| `USER_ID` | Bot User ID | ✅ |
| `GOOGLE_API_KEY` | Google API key | ✅ |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID | ✅ |
| `GOOGLE_CLIENT_SECRET` | Google secret key | ✅ |
| `AUTH_SERVER_URL` | Auth server URL  <br/>(default:`http://localhost:3000`)| ❌ |
| `AUTH_SERVER_PORT` | Auth server port <br/>(default:`3000`)| ❌ |


### 🚀 Running the Application

#### ⚙️ Development Server

Run the app locally at `http://localhost:3000`:

```bash
  npm run start
```

### 📦 Deployment

To deploy using Docker Compose:

```bash
  docker compose up --build -d
```

## 📚 Acknowledgements

- [Express.js](https://expressjs.com/)
- [Docker](https://docs.docker.com/)
- [discord.js](https://discord.js.org/docs/packages/discord.js/14.21.0)
- [Google Calendar](https://developers.google.com/workspace/calendar/api/guides/overview)

