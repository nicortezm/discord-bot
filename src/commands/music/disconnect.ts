import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { Command } from '../../interfaces';

// * En caso de que el bot sea desconectado por alguien

export const command: Command = {
  data: new SlashCommandBuilder()
    .setName('disconnect')
    .setDescription('Disconnect the bot from the voice channel'),

  async execute(client, interaction) {
    if (!interaction.inCachedGuild()) return;

    const { channel } = interaction.member.voice;

    if (!channel) {
      return interaction.reply({
        content: 'You need to be in a voice channel to use this command.',
        ephemeral: true,
      });
    }

    const player = client.manager?.players.get(interaction.guild.id);

    if (!player) {
      return interaction.reply({
        content: 'There is no music playing.',
        ephemeral: true,
      });
    }

    try {
      // Limpiar la cola y destruir el player
      player.queue.clear();
      player.destroy();
      client.manager?.players.delete(interaction.guild.id);

      // Crear el embed para notificar la desconexión
      const embed = new EmbedBuilder()
        .setColor('Random')
        .setDescription(
          '🛑 The bot has been disconnected from the voice channel.'
        );

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(
        `Error disconnecting player in guild ${interaction.guild.id}:`,
        error
      );
      return interaction.reply({
        content:
          'There was an error while disconnecting the bot. Please try again later.',
        ephemeral: true,
      });
    }
  },
};
