import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  InteractionContextType,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from 'discord.js';
import { Command } from '../../interfaces';

export const command: Command = {
  data: new SlashCommandBuilder()
    .setName('add-role-v2')
    .setDescription('Add role to user')
    .setContexts(InteractionContextType.Guild)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),
  developer: true,
  async execute(client, interaction) {
    const rowButtons = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId('add-role-v2_1261875412829470743') // ID rol
        .setLabel('Add Role')
        .setStyle(ButtonStyle.Primary)
    );

    await interaction.reply({
      content: 'Want to get a new role?',
      components: [rowButtons],
    });
  },
};
