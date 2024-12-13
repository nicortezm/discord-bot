import {
  InteractionContextType,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from 'discord.js';
import { Command } from '../../interfaces';

export const command: Command = {
  data: new SlashCommandBuilder()
    .setName('add-role')
    .setDescription('Add role to user')
    .setContexts(InteractionContextType.Guild)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
    .addUserOption((opt) =>
      opt.setName('user').setDescription('User to add role').setRequired(true)
    )
    .addRoleOption((opt) =>
      opt.setName('rol').setDescription('Role to add').setRequired(true)
    ),
  async execute(client, interaction) {
    if (!interaction.inCachedGuild()) return;
    const member = interaction.options.getMember('user');
    const role = interaction.options.getRole('rol', true);
    try {
      await member?.roles.add(role.id);

      await interaction.reply({
        content: `Role ${role} has been added to the user ${member}.`,
        ephemeral: true,
      });
    } catch (error) {
      await interaction.reply({
        content: `Error: Missing Permissions `,
        ephemeral: true,
      });
    }
  },
};
