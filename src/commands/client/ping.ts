import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { Command } from '../../interfaces';

export const command: Command = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Check Bot connection'),

  async execute(client, interaction) {
    const delay = Date.now() - interaction.createdAt.getTime();

    const embedResponse = new EmbedBuilder()
      .setTitle('Pong!')
      .setDescription(`Bot delay is \`${delay}ms\`.`)
      .setColor('Aqua');
    await interaction.reply({ embeds: [embedResponse], ephemeral: true });
  },
};
