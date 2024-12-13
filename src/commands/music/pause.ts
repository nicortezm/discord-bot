import {
  EmbedBuilder,
  SlashCommandBuilder,
  InteractionContextType,
} from 'discord.js';
import { Command } from '../../interfaces';

export const command: Command = {
  data: new SlashCommandBuilder()
    .setName('pause')
    .setDescription('Pause or resume the current song'),

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

    if (player.paused) {
      player.pause(false);

      const embed = new EmbedBuilder()
        .setColor('Random')
        .setDescription('▶️ Resumed the music');

      await interaction.reply({ embeds: [embed] });
    } else {
      player.pause(true);

      const embed = new EmbedBuilder()
        .setColor('Random')
        .setDescription('⏸️ Paused the music');

      await interaction.reply({ embeds: [embed] });
    }
  },
};
