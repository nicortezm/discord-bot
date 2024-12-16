import {
  EmbedBuilder,
  InteractionContextType,
  PermissionsBitField,
  SlashCommandBuilder,
} from 'discord.js';
import { Command } from '../../interfaces';

/* 
TODO:
- Implementar sistema de queues
- poder reproducir desde links
- Actualizar embed cuando se cambie la canción (thumbnail,url etc)
- Otras cosas que no recuerdo


*/

export const command: Command = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Reproduce una canción de youtube')
    .setContexts(InteractionContextType.Guild)
    .addStringOption((option) =>
      option
        .setName('buscar')
        .setDescription('El video a reproducir')
        .setRequired(true)
    ),

  async execute(client, ctx) {
    if (!ctx.interaction?.inCachedGuild()) return; // solo se puede usar en un server
    if (!ctx.interaction.guild.members.me) return; // no se puede ejecutar este comando en este sv
    const search = ctx.options.get('buscar')?.value as string ?? '';
    const { channel } = ctx.interaction.member.voice;
    if (!channel) {
      return ctx.sendMessage({
        content: 'Necesitas estar en un canal de voz',
        ephemeral: true,
      });
    }
    if (!ctx.interaction.guild) return;
    if (!ctx.interaction.channel) return;
    if (
      !channel
        .permissionsFor(ctx.interaction.guild.members.me)
        .has(PermissionsBitField.Flags.Connect)
    ) {
      return ctx.sendMessage({
        content: 'No tengo permisos para entrar a tu canal de voz',
        ephemeral: true,
      });
    }

    await ctx.sendMessage({ content: 'Buscando...' });

    const player = await client.manager?.createPlayer({
      guildId: ctx.interaction.guild.id,
      voiceId: channel.id,
      textId: ctx.interaction.channel.id,
      volume: 100,
      deaf: true,
    });

    const res = await player?.search(search, { requester: ctx.interaction.user });
    if (!player) return;
    if (!res?.tracks.length) {
      return ctx.editMessage('No encontré resultados');
    }
    if (res.type === 'PLAYLIST') {
      for (let track of res.tracks) {
        player?.queue.add(track);
      }
      if (!player?.playing && !player?.paused) {
        player?.play();
      }
      // Obtener URL y thumbnail de la canción
      const trackUrl = res.tracks[0].uri || ''; // URL del video
      const trackThumbnail = res.tracks[0].thumbnail || ''; // Thumbnail de la canción, si no existe, poner un predeterminado
      // Verificar si hay más canciones en la cola
      const hasNextTrack = player.queue.size > 0;
      const embed = new EmbedBuilder()
        .setColor('Random')
        .setTitle('Playlist Añadida')
        .setDescription(
          `**[${res.playlistName}](${search})** \n\n**Canciones en la cola:** \`${res.tracks.length}\``
        )
        .setURL(trackUrl) // Agregar URL del video
        .setThumbnail(trackThumbnail) // Carátula de la canción
        .setFooter({
          text: `Ahora reproduciendo: ${
            hasNextTrack ? player.queue.at(0)?.title : 'No hay más canciones'
          }`,
        });
      return ctx.editMessage({ content: '', embeds: [embed] });
    } else {
      player?.queue.add(res.tracks[0]);
      if (!player?.playing && !player?.paused) {
        player?.play();
      }
      const embed = new EmbedBuilder()
        .setColor('Random')
        .setTitle('Canción Añadida')
        .setDescription(`▶️ Reproduciendo **${res.tracks[0].title}**`)
        .setURL(res.tracks[0].uri ?? '') // Agregar URL del video
        .setThumbnail(res.tracks[0].thumbnail ?? '') // Carátula de la canción
        .setFooter({
          text: `Siguiente canción: Ninguna`,
        });
      return ctx.editMessage({ content: '', embeds: [embed] });
    }
  },
};
