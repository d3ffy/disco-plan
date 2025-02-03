const { EmbedBuilder } = require('discord.js');
const planner = require('../commands/planner/planner');

module.exports = {
    infoMessage() {
        return new EmbedBuilder()
            .setTitle('📒  User Information')  // Directly using an emoji in the title
            .setColor('White')
            .setTimestamp();
    },
    
    errorMessage() {
        return new EmbedBuilder()
            .setTitle('⚠️  Error')  // Directly using an emoji in the title
            .setColor('Red')
            .setTimestamp();
    },

    utilityMessage() {
        return new EmbedBuilder()
            .setTitle('🔧  Utility')  // Directly using an emoji in the title
            .setColor('Blue')
            .setTimestamp();
    },

    plannerMessage() {
        return new EmbedBuilder()
            .setTitle('📅  Planner')  // Directly using an emoji in the title
            .setColor('Purple')
            .setTimestamp();
    }
};