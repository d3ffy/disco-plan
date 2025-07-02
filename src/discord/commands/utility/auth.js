const { SlashCommandBuilder } = require('discord.js');
const { utilityMessage } = require('../../helper/embedMessage');
const { AUTH_SERVER_URL, AUTH_SERVER_PORT } = require('../../../config/config');

module.exports = {
	category: 'utility',
	data: new SlashCommandBuilder()
		.setName('auth')
		.setDescription('Setup authentication for DiscoPlan.'),
		
	async execute(interaction) {
		const authUrl = `${AUTH_SERVER_URL}:${AUTH_SERVER_PORT}/auth?user_id=${interaction.user.id}`;
		const embed = utilityMessage()
			.setDescription(`Click [here](${authUrl}) to authenticate with Google Calendar`);
		return await interaction.reply({
			embeds: [embed],
			ephemeral: true
		});
	},
};