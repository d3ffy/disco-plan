const { SlashCommandBuilder } = require('discord.js');
const { findAllEvents, findEvent, findOwnedEvents, findRelatedEvents, addEvent, removeEvents, addEventMember, removeEventMember } = require('../../planner');
const { plannerMessage, errorMessage } = require('../../helper/embedMessage');

module.exports = {
	category: 'planner',
	data: new SlashCommandBuilder()
		.setName('planner')
		.setDescription('Planner commands.')
        .addSubcommand(subcommand =>
            subcommand
                .setName('list')
                .setDescription('List all planner events.'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('owned')
                .setDescription('List all planner events owned by user.'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('related')
                .setDescription('List all planner events related to you.'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('add')
                .setDescription('Add an event to the planner.')
                .addStringOption(option =>
                    option.setName('title')
                        .setDescription('Event title.')
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option.setName('description')
                        .setDescription('Event description.')
                )
                .addStringOption(option =>
                    option.setName('start_time')
                        .setDescription('Start time (e.g., YYYY-MM-DD HH:MM).')
                )
                .addStringOption(option =>
                    option.setName('end_time')
                        .setDescription('End time (e.g., YYYY-MM-DD HH:MM).')
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('remove')
                .setDescription('Remove an event from the planner.')
                .addIntegerOption(option =>
                    option.setName('id')
                        .setDescription('Event ID.')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('detail')
                .setDescription('Get event details.')
                .addIntegerOption(option =>
                    option.setName('id')
                        .setDescription('Event ID.')
                        .setRequired(true)
                )
        )
        .addSubcommandGroup(subcommandGroup =>
            subcommandGroup
                .setName('member')
                .setDescription('User commands.')
                .addSubcommand(subcommand =>
                    subcommand
                        .setName('add')
                        .setDescription('Add user to event.')
                        .addIntegerOption(option =>
                            option.setName('id')
                                .setDescription('Event ID.')
                                .setRequired(true)
                        )
                        
                        .addUserOption(option =>
                            option.setName('user')
                                .setDescription('User to add.')
                                .setRequired(true)
                        )
                )
                .addSubcommand(subcommand =>
                    subcommand
                        .setName('remove')
                        .setDescription('Remove user from event.')
                        .addIntegerOption(option =>
                            option.setName('id')
                                .setDescription('Event ID.')
                                .setRequired(true)
                        )
                        
                        .addUserOption(option =>
                            option.setName('user')
                                .setDescription('User to add.')
                                .setRequired(true)
                        )
                )
                
        ),
            
        
    async execute(interaction) {
        const embed = plannerMessage();
        // Get the subcommand group
        switch (interaction.options.getSubcommandGroup()) {
            case 'member':
                await interaction.deferReply({ ephemeral: true }) // DiscoPlan bot thinking...
                switch (interaction.options.getSubcommand()) {
                    case 'add':
                        // Add event_users
                        const addMember = await addEventMember(interaction.options.getInteger('id'), interaction, interaction.options.getUser('user').id);
                        if (addMember.error) {
                            return await interaction.editReply({
                                embeds: [errorMessage().setDescription(addMember.error)],
                                ephemeral: true
                            });
                        }
                        return await interaction.editReply({
                            embeds: [embed.setDescription(`${interaction.options.getUser('user').username} added to event id: \`${interaction.options.getInteger('id')}\` successfully. :white_check_mark:`)],
                            ephemeral: true
                        })

                    case 'remove':
                        // Remove event_users
                        const removeMember = await removeEventMember(interaction.options.getInteger('id'), interaction, interaction.options.getUser('user').id);
                        if (removeMember.error) {
                            return await interaction.editReply({
                                embeds: [errorMessage().setDescription(removeMember.error)],
                                ephemeral: true
                            });
                        }
                        return await interaction.editReply({
                            embeds: [embed.setDescription(`${interaction.options.getUser('user').username} removed from event id: \`${interaction.options.getInteger('id')}\` successfully. :white_check_mark:`)],
                            ephemeral: true
                        })
                }
            default:
                // Get the subcommand
                switch (interaction.options.getSubcommand()) {
                    // List all planner events.
                    case 'list':
                        await interaction.deferReply() // DiscoPlan bot thinking...
                        const events = await findAllEvents();
                        if (!events) {
                            return await interaction.editReply({
                                embeds: [embed.setDescription('No events found.')],
                            });
                        } else {
                            let eventList = '```\n'; // Start the monospaced block
                            eventList += `ID  Name         Description\n`; // Add the header
        
                            events.map(event => {
                                // Ensure values are strings and provide fallback values for null or undefined
                                const description = event.description || 'No description';
        
                                // Append each event, ensuring proper padding for alignment
                                eventList += `${event.event_id.toString().padEnd(3)} ${event.title.padEnd(12)} ${description}\n`;
                            });
        
                            eventList += '```'; // End the monospaced block
                            embed.setFields({ name: 'All Events', value: eventList });
                            
                            return await interaction.editReply({
                                embeds: [embed],
                            });
                            
        
                        }
                    // List all planner events owned by user.
                    case 'owned':
                        await interaction.deferReply({ ephemeral: true }) // DiscoPlan bot thinking...
                        const owned = await findOwnedEvents(interaction);
                        if (owned.error) {
                            return await interaction.editReply({
                                embeds: [errorMessage().setDescription(owned.error)],
                            });
                        } 
                        if (!owned) {
                            return await interaction.editReply({
                                embeds: [embed.setDescription('No events found.')],
                            });
                        }
                        else {
                            let eventList = '```\n'; // Start the monospaced block
                            eventList += `ID  Name         Description\n`; // Add the header
        
                            owned.map(event => {
                                const description = event.description || 'No description';
        
                                // Append each event, ensuring proper padding for alignment
                                eventList += `${event.event_id.toString().padEnd(3)} ${event.title.padEnd(12)} ${description}\n`;
                            });
        
                            eventList += '```'; // End the monospaced block
                            embed.setFields({ name: 'Owned Events', value: eventList });
                            
                            return await interaction.editReply({
                                embeds: [embed],
                            });
        
                        }

                    // List all planner events related to user.
                    case 'related':
                        await interaction.deferReply({ ephemeral: true }) // DiscoPlan bot thinking...
                        const related = await findRelatedEvents(interaction);
                        if (related.error) {
                            return await interaction.editReply({
                                embeds: [errorMessage().setDescription(related.error)],
                            });
                        } 
                        if (!related) {
                            return await interaction.editReply({
                                embeds: [embed.setDescription('No events found.')],
                            });
                        }
                        else {
                            let eventList = '```\n'; // Start the monospaced block
                            eventList += `ID  Name         Description\n`; // Add the header
        
                            related.map(event => {
                                const description = event.description || 'No description';
        
                                // Append each event, ensuring proper padding for alignment
                                eventList += `${event.id.toString().padEnd(3)} ${event.title.padEnd(12)} ${description}\n`;
                            });
        
                            eventList += '```'; // End the monospaced block
                            embed.setFields({ name: 'Related Events', value: eventList });
                            
                            return await interaction.editReply({
                                embeds: [embed],
                            });
                        }
        
                    // Add an event to the planner.
                    case 'add':
                        await interaction.deferReply({ ephemeral: true }) // DiscoPlan bot thinking...
                        const add = await addEvent(interaction);
                        if (add.error) {
                            return await interaction.editReply({
                                embeds: [errorMessage().setDescription(add.error)],
                            });
                        } else {
                            embed
                                .setDescription(`${interaction.user.username} add event \`${add.title}\` successfully. :white_check_mark:`)
                                .addFields(
                                    { name: 'Title', value: add.title },
                                    { name: 'Description', value: add.description ? add.description : 'No description' },
                                    { name: 'Start Time', value: add.start_time ? add.start_time.toString() : 'No start time' },
                                    { name: 'End Time', value: add.end_time ? add.end_time.toString() : 'No end time' }
                                );
                            return await interaction.editReply({
                                embeds: [embed],
                            });
                        }
        
                    // Remove an event from the planner.
                    case 'remove':
                        await interaction.deferReply({ ephemeral: true }) // DiscoPlan bot thinking...
                        const removeEvent = await removeEvents(interaction)
                        if (removeEvent.error) {
                            return await interaction.editReply({
                                embeds: [errorMessage().setDescription(removeEvent.error)],
                            })
                        } else {
                            embed.setDescription(`${interaction.user.username} remove event \`${removeEvent.title}\` successfully. :white_check_mark:`)
                            return await interaction.editReply({
                                embeds: [embed],
                            });
                        }
                    
                    // Get event details.
                    case 'detail':
                        await interaction.deferReply({ ephemeral: true }) // DiscoPlan bot thinking...
                        const event = await findEvent(interaction.options.getInteger('id'));
                        if (!event) {
                            return await interaction.editReply({
                                embeds: [errorMessage().setDescription(`Cannot find event with ID: \`${interaction.options.getInteger('id')}\`.`)],
                            });
                        } else {
                            embed
                                .addFields(
                                    { name: 'Title', value: event.title },
                                    { name: 'Description', value: event.description ? event.description : 'No description' },
                                    { name: 'Start Time', value: event.start_time ? event.start_time.toString() : 'No start time' },
                                    { name: 'End Time', value: event.end_time ? event.end_time.toString() : 'No end time' }
                                );
                            return await interaction.editReply({
                                embeds: [embed],
                            });
                        }
                }
        }
	},
};