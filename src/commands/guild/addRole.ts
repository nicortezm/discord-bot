import {
  GuildMember,
  InteractionContextType,
  PermissionFlagsBits,
  Role,
  SlashCommandBuilder,
} from "discord.js";
import { Command } from "../../interfaces";

export const command: Command = {
  data: new SlashCommandBuilder()
    .setName("add-role")
    .setDescription("Add role to user")
    .setContexts(InteractionContextType.Guild)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
    .addUserOption((opt) =>
      opt.setName("user").setDescription("User to add role").setRequired(true)
    )
    .addRoleOption((opt) =>
      opt.setName("rol").setDescription("Role to add").setRequired(true)
    ),
  async execute(client, ctx) {
    if (!ctx.interaction?.inCachedGuild()) return;
    const member = ctx.options.getMember("user") as GuildMember;
    const role = ctx.options.getRole("rol", true) as Role;
    try {
      await member?.roles.add(role?.id);

      await ctx.sendMessage({
        content: `Role ${role} has been added to the user ${member}.`,
        ephemeral: true,
      });
    } catch (error) {
      await ctx.sendMessage({
        content: `Error: Missing Permissions `,
        ephemeral: true,
      });
    }
  },
};
