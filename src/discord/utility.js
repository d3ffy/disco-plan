const { User } = require('../../models');

async function register(interaction) {
  try {
    // Check if user already exists
    const existingUser = await getUser(interaction);

    if (existingUser) {
      return { error: 'User already registered.' };
    }

    // Create new user
    const user = await User.create({
      discord_id: interaction.user.id,
      username: interaction.user.username,
      email: interaction.options.getString('email'),
    });
    return user;
  } catch (error) {
    console.error('Error registering user:', error);
    return { error: 'Failed to register user.' };
  }
}

async function updateUserEmail(interaction) {
  try {
    // Check if user already exists
    const existingUser = await getUser(interaction);

    if (!existingUser) {
      return { error: 'User not registered.' };
    }

    // Update user email
    const user = await existingUser.update({
      email: interaction.options.getString('email'),
    });
    return user;
  } catch (error) {
    console.error('Error updating user email:', error);
    return { error: `${interaction.user.username} not registered to DiscoPlan.` };
  }
}

async function updateUsername(interaction) {
  try {
    // Check if user already exists
    const existingUser = await getUser(interaction);

    if (!existingUser) {
      return { error: `${interaction.user.username} not registered to DiscoPlan.` };
    }

    // Update username
    const user = await existingUser.update({
      username: interaction.user.username,
    });
    return user;

  } catch (error) {
    console.error('Error updating username:', error);
    return { error: 'Failed to update username.' };
  }
}

async function getUser(interaction) {
  try {
    // Find user by discord_id
    const existingUser = await User.findOne({
      where: { discord_id: interaction.user.id }
    });

    return existingUser; // Returns null if the user does not exist
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
}

module.exports = {
  register,
  updateUserEmail,
  updateUsername,
  getUser,
};