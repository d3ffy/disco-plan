const { SlashCommandBuilder } = require('discord.js');
const { updateUserEmail, updateUsername, getUser } = require('../../utility');
const { infoMessage, errorMessage } = require('../../helper/embedMessage');

module.exports = {
	category: 'utility',
	data: new SlashCommandBuilder()
		.setName('user')
		.setDescription('Provides information about the user.')
		.addSubcommand(subcommand =>
			subcommand
				.setName('update')
				.setDescription('Update user information.')
				.addStringOption(option =>
					option
						.setName('email')
						.setDescription('Your email.')
				)
				.addStringOption(option =>
					option
						.setName('phone')
						.setDescription('Your phone number.')
				)
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('info')
				.setDescription('Get user information.')
		),

	async execute(interaction) {
		const embed = infoMessage();
		
		switch (interaction.options.getSubcommand()) {
			case 'update': {
				// Retrieve options
				const email = interaction.options.getString('email');
				const phone = interaction.options.getString('phone');

				// Embed description update
				embed.setDescription('User information updated :white_check_mark:');

				// Check if email or phone number is provided
				const usernameUpdate = await updateUsername(interaction);
				if (usernameUpdate.error) {
					return interaction.reply({
						embeds: [errorMessage().setDescription(usernameUpdate.error)],
						ephemeral: true,
					});
				} else {
					embed.addFields({ name: 'Username', value: interaction.user.username });
				}

				if (email) {
					const emailUpdate = await updateUserEmail(interaction);
					if (emailUpdate.error) {
						return interaction.reply({
							embeds: [errorMessage().setDescription(emailUpdate.error)],
							ephemeral: true,
						});
					} else {
						embed.addFields({ name: 'Email', value: email });
					}
				}

				if (phone) {
					embed.addFields({ name: 'Phone number', value: phone });
				}

				// Send success message
				return interaction.reply({
					embeds: [embed],
					ephemeral: true,
				});
			}

			case 'info':
				// Retrieve user information
				const user = await getUser(interaction);
				if (!user) {
					return interaction.reply({
						embeds: [errorMessage().setDescription('User not registered.')],
						ephemeral: true,
					});
				} else {
					embed
					.addFields(
						{ name: 'Username', value: user.username, inline: true },
						{ name: 'Email', value: user.email, inline: true },
					)
					.addFields({ name: 'Joined', value: interaction.member.joinedAt.toString() }) ;
				}
					
				// Display user information
				return interaction.reply({ 
					embeds: [embed],
					ephemeral: true,
				});
		}
	},
};
