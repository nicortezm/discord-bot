import {
  AutocompleteInteraction,
  CommandInteraction,
  GuildMember,
  PermissionFlagsBits,
} from "discord.js";
import { Event } from "../../interfaces";
import Context from "../../lib/context";
import { GlobClient } from "../../interfaces";

export const event: Event<"interactionCreate"> = {
  name: "interactionCreate",
  async execute(
    client: GlobClient,
    interaction: CommandInteraction | AutocompleteInteraction
  ) {
    if (!(interaction?.guild && interaction.guildId)) return;
    if (interaction instanceof CommandInteraction && interaction.isCommand()) {
      const { commandName } = interaction;

      const command = client.commands.get(commandName);
      if (!command) return;

      const ctx = new Context(
        interaction as any,
        interaction.options.data as any
      );
      ctx.setArgs(interaction.options.data as any);
      const clientMember = interaction.guild.members.resolve(client.user.id!)!;

      if (
        !(
          interaction.inGuild() &&
          interaction.channel
            ?.permissionsFor(clientMember)
            .has(PermissionFlagsBits.ViewChannel)
        )
      )
        return;

      if (
        !(
          clientMember.permissions.has(PermissionFlagsBits.ViewChannel) &&
          clientMember.permissions.has(PermissionFlagsBits.SendMessages) &&
          clientMember.permissions.has(PermissionFlagsBits.EmbedLinks) &&
          clientMember.permissions.has(PermissionFlagsBits.ReadMessageHistory)
        )
      ) {
        return await (interaction.member as GuildMember)
          .send({
            content:
              "I need the following permissions to work properly: `View Channel`, `Send Messages`, `Embed Links`, `Read Message History`",
          })
          .catch(() => {
            null;
          });
      }

      if (
        command.developer &&
        !client.config.developers.includes(interaction.user.id)
      ) {
        return await interaction.reply({
          content: "This command is only for developers",
          ephemeral: true,
        });
      }

      try {
        await command.execute(client, ctx);
      } catch (error) {
        await interaction.reply({
          content: "There was an error while executing this command!",
        });
      }
    }
  },
};
