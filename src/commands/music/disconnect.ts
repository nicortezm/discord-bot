import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { Command } from '../../interfaces';

// * En caso de que el bot sea desconectado por alguien

export const command: Command = {
  data: new SlashCommandBuilder()
    .setName('disconnect')
    .setDescription('Desconectar al bot del canal de voz'),

  async execute(client, interaction) {
    if (!interaction.inCachedGuild()) return;

    const { channel } = interaction.member.voice;

    if (!channel) {
      return interaction.reply({
        content:
          'Necesitas estar en un Chat de voz para ejecutar este comando.',
        ephemeral: true,
      });
    }

    const player = client.manager?.players.get(interaction.guild.id);

    if (!player) {
      return interaction.reply({
        content: 'No hay música reproduciendose.',
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
        .setDescription('🛑 Se ha desconectado el bot del canal de voz.');

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(
        `Error disconnecting player in guild ${interaction.guild.id}:`,
        error
      );
      return interaction.reply({
        content:
          'Ha ocurrido un error al desconectar el bot, porfavor intenta nuevamente',
        ephemeral: true,
      });
    }
  },
};
