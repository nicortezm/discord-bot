import {
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import { Command } from "../../interfaces";

export const command: Command = {
  data: new SlashCommandBuilder()
    .setName("pause")
    .setDescription("Pausa o reanuda la música"),

  async execute(client, ctx) {
    if (!ctx.interaction?.inCachedGuild()) return;

    const { channel } = ctx.interaction.member.voice;

    if (!channel) {
      return ctx.sendMessage({
        content:
          "Necesitas estar en un Chat de voz para ejecutar este comando.",
        ephemeral: true,
      });
    }

    const player = client.manager?.players.get(ctx.interaction.guild.id);

    if (!player) {
      return ctx.sendMessage({
        content: "No hay música reproduciendose.",
        ephemeral: true,
      });
    }

    if (player.paused) {
      player.pause(false);

      const embed = new EmbedBuilder()
        .setColor("Random")
        .setDescription("▶️ Música reanudada");

      await ctx.sendMessage({ embeds: [embed] });
    } else {
      player.pause(true);

      const embed = new EmbedBuilder()
        .setColor("Random")
        .setDescription("⏸️ Música pausada");

      await ctx.sendMessage({ embeds: [embed] });
    }
  },
};
