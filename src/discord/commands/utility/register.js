const { SlashCommandBuilder } = require('discord.js');
const { register } = require('../../utility');
const { utilityMessage, errorMessage } = require('../../helper/embedMessage');

module.exports = {
	category: 'utility',
	data: new SlashCommandBuilder()
		.setName('register')
		.setDescription('Register to DiscoPlan!')
        .addStringOption(option =>
            option
                .setName('email')
                .setDescription('Your email.')
                .setRequired(true)
        ),
	async execute(interaction) {
		const user = await register(interaction);
        const embed = user.error ? errorMessage() : utilityMessage();
        if (user.error) {
            return await interaction.reply({
                embeds: [embed.setDescription(`${user.error}`)],
                ephemeral: true
            });
        } else {
            return await interaction.reply({
                embeds: [embed.setDescription(`${interaction.user.username} registered to DiscoPlan! :white_check_mark:`)],
                ephemeral: true 
            })
	}
}}