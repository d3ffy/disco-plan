const { EmbedBuilder } = require('discord.js');
const planner = require('../commands/planner/planner');

module.exports = {
    infoMessage() {
        return new EmbedBuilder()
            .setTitle('📒  User Information')
            .setColor('White')
            .setTimestamp();
    },
    
    errorMessage() {
        return new EmbedBuilder()
            .setTitle('⚠️  Error')
            .setColor('Red')
            .setTimestamp();
    },

    utilityMessage() {
        return new EmbedBuilder()
            .setTitle('🔧  Utility')
            .setColor('Blue')
            .setTimestamp();
    },

    plannerMessage() {
        return new EmbedBuilder()
            .setTitle('📅  Planner')
            .setColor('Purple')
            .setTimestamp();
    }
};