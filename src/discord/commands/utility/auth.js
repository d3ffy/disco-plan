const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	category: 'utility',
	data: new SlashCommandBuilder()
		.setName('auth')
		.setDescription('Setup authentication for deffy-bot.'),
		
	async execute(interaction) {
		const authUrl = `http://localhost:3000/auth?user_id=${interaction.user.id}`;
		return await interaction.reply({
			content: `Click here to authenticate with Google Calendar: ${authUrl}`,
			ephemeral: true
		});
	},
};