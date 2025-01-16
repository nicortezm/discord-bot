import {
  EmbedBuilder,
  SlashCommandBuilder,
  InteractionContextType,
} from "discord.js";

import { Command } from "../../interfaces";

export const command: Command = {
  data: new SlashCommandBuilder()
    .setName("shuffle")
    .setDescription("Mueve las canciones de la cola de reproducción")
    .setContexts(InteractionContextType.Guild),

  async execute(client, ctx) {
    const player = client.manager?.getPlayer(ctx.interaction?.guildId!);

    const embed = new EmbedBuilder();

    if (!player) {
      return await ctx.sendMessage({
        content: "No hay canciones en la cola de reproducción",
      });
    }

    if (player.queue.length === 0) {
      return await ctx.sendMessage({
        content: "No hay canciones en la cola de reproducción",
        embeds: [
          embed.setColor("Red").setDescription("No hay canciones para barajar"),
        ],
      });
    }

    player.queue.shuffle();

    return await ctx.sendMessage({
      content: "La cola de reproducción ha sido barajada",
      embeds: [
        embed
          .setColor("Green")
          .setDescription("La cola de reproducción ha sido barajada"),
      ],
    });
  },
};
