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
    await ctx.sendDeferMessage({ content: "Shuffling..." });

    const player = client.manager?.players.get(ctx.interaction?.guildId!);

    if (!player?.queue.length && !player?.queue.current) {
      const embed = new EmbedBuilder()
        .setColor("Red")
        .setDescription("No hay canciones en la cola de reproducción");
      return ctx.sendMessage({ embeds: [embed] });
    }
    const shuffleEmoji = "🔀";

    const embed = new EmbedBuilder()
      .setDescription(`${shuffleEmoji} Shuffled the queue`)
      .setColor("Green");

    player.queue.shuffle();

    return ctx
      .sendMessage({ embeds: [embed] })
      .catch((error) => console.log(error));
  },
};
