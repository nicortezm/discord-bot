import {
  EmbedBuilder,
  SlashCommandBuilder,
  InteractionContextType,
} from 'discord.js';
import { Command } from '../../interfaces';

export const command: Command = {
  data: new SlashCommandBuilder()
    .setName('pause')
    .setDescription('Pausa o reanuda la música'),

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

    if (player.paused) {
      player.pause(false);

      const embed = new EmbedBuilder()
        .setColor('Random')
        .setDescription('▶️ Música reanudada');

      await interaction.reply({ embeds: [embed] });
    } else {
      player.pause(true);

      const embed = new EmbedBuilder()
        .setColor('Random')
        .setDescription('⏸️ Música pausada');

      await interaction.reply({ embeds: [embed] });
    }
  },
};
