import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { Command } from "../../interfaces";
import { chunk, paginated } from "../../lib/utils";

export const command: Command = {
  data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("Muestra la cola de reproducción"),

  async execute(client, ctx) {
    const player = client.manager?.getPlayer(ctx.guild.id);

    if (!player)
      return await ctx.sendMessage({
        content: "No hay canciones en la cola de reproducción",
        ephemeral: true,
      });

    const embed = new EmbedBuilder().setColor("Blurple").setAuthor({
      name: "Cola de reproducción",
      iconURL: ctx.guild.iconURL() || undefined,
    });

    const currentTrack = player.queue.current;
    const isStream = currentTrack?.isStream ? "En vivo" : "No en vivo";

    if (currentTrack && player.queue.isEmpty) {
      embed.setDescription(
        `**Reproduciendo ahora:**\n[${currentTrack.title}](${currentTrack.uri})\n` +
          `Solicitado por: ${currentTrack.requester}\n` +
          `Estado: ${isStream}`
      );

      return await ctx.sendMessage({ embeds: [embed] });
    }

    try {
      const songs = player.queue.map(
        (track, index) =>
          `\`${index + 1}.\` [${track.title}](${track.uri}) - Solicitado por: ${
            track.requester
          }`
      );
      const queueList = [
        `**Reproduciendo ahora:**\n[${currentTrack?.title}](${currentTrack?.uri}) - ${isStream}\n`,
        "**Próximas canciones:**",
        ...songs,
      ];

      const chunks = chunk(queueList, 10);

      const pages = chunks.map((chunk, i) => {
        return new EmbedBuilder()
          .setColor("Blurple")
          .setAuthor({
            name: "Cola de reproducción",
            iconURL: ctx.guild.iconURL() || undefined,
          })
          .setDescription(chunk.join("\n"))
          .setFooter({
            text: `Página ${i + 1} de ${chunks.length} • Total: ${
              player.queue.length
            } canciones`,
          });
      });

      // If there's only one page, send it directly
      if (pages.length === 1) {
        return await ctx.sendMessage({ embeds: [pages[0]] });
      }

      return await paginated(client, ctx, pages);
    } catch (error) {
      console.error("Error in queue command:", error);
      return await ctx.sendMessage({
        content: "Ocurrió un error al mostrar la cola de reproducción.",
        ephemeral: true,
      });
    }
  },
};
