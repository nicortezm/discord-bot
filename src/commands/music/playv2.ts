import { EmbedBuilder, SlashCommandBuilder, VoiceChannel } from "discord.js";
import { Command } from "../../interfaces";
import { KazagumoSearchResult } from "kazagumo";

export const command: Command = {
  data: new SlashCommandBuilder()
    .setName("playv2")
    .setDescription("Reproduce una canción de youtube")
    .addStringOption((option) =>
      option
        .setName("buscar")
        .setDescription("El video a reproducir")
        .setRequired(true)
    ),

  async execute(client, ctx) {
    await ctx.sendDeferMessage("Cargando...");
    const search = (ctx.options.get("buscar")?.value as string) ?? "";

    let player = client.manager?.getPlayer(ctx.guild!.id);

    const memberVcChannel = (ctx.member as any).voice.channel as VoiceChannel;

    if (!player) {
      player = await client.manager?.createPlayer({
        guildId: ctx.guild!.id,
        voiceId: memberVcChannel.id,
        textId: ctx.channel.id,
        deaf: true,
      });
    }

    const response = (await player?.search(search, {
      requester: ctx.author,
    })) as KazagumoSearchResult;
    const embed = new EmbedBuilder();

    if (!response || response.tracks.length === 0) {
      return await ctx.editMessage({
        content: "",
        embeds: [
          embed.setColor("Red").setDescription("No se encontraron resultados"),
        ],
      });
    }

    player?.queue.add(
      response.type === "PLAYLIST" ? response.tracks : response.tracks[0]
    );

    if (response.type === "PLAYLIST") {
      await ctx.editMessage({
        content: "",
        embeds: [
          embed
            .setColor("Green")
            .setDescription(
              `Se ha añadido la playlist a la cola de reproducción Cantidad de canciones: ${response.tracks.length}`
            ),
        ],
      });
    } else {
      await ctx.editMessage({
        content: "",
        embeds: [
          embed
            .setColor("Green")
            .setDescription(
              `Se ha añadido a la cola de reproducción: [${response.tracks[0].title}](${response.tracks[0].uri}) - Solicitado por: ${response.tracks[0].requester}`
            ),
        ],
      });
    }

    if (!player?.playing && !player?.paused) {
      await player?.play();
    }
  },
};
