import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { Command } from '../../interfaces';

export const command: Command = {
  data: new SlashCommandBuilder()
    .setName('skip')
    .setDescription('Skip the current song'),

  async execute(client, interaction) {
    if (!interaction.inCachedGuild()) return;

    const { channel } = interaction.member.voice;

    if (!channel) {
      return interaction.reply({
        content: 'You need to be in a voice channel to use this command.',
        ephemeral: true,
      });
    }

    const player = client.manager?.players.get(interaction.guild.id);

    if (!player) {
      return interaction.reply({
        content: 'There is no music playing.',
        ephemeral: true,
      });
    }

    const currentTrack = player.queue.current;

    if (!currentTrack) {
      return interaction.reply({
        content: 'There is no song currently playing.',
        ephemeral: true,
      });
    }

    // Obtener URL y thumbnail de la canción
    const trackUrl = currentTrack.uri || ''; // URL del video
    const trackThumbnail =
      currentTrack.thumbnail || 'https://default-thumbnail.jpg'; // Thumbnail de la canción, si no existe, poner un predeterminado

    // Verificar si hay más canciones en la cola
    const hasNextTrack = player.queue.size > 0;

    // Realizar el skip
    player.skip();

    // Crear el embed con el thumbnail
    const embed = new EmbedBuilder()
      .setColor('Random')
      .setTitle('Song Skipped')
      .setDescription(`⏭️ Skipped **${currentTrack.title}**`)
      .setURL(trackUrl) // Agregar URL del video
      .setThumbnail(trackThumbnail) // Carátula de la canción
      .setFooter({
        text: `Now playing: ${
          hasNextTrack ? player.queue.at(0)?.title : 'No more tracks'
        }`,
      });

    await interaction.reply({ embeds: [embed] });

    // Si no hay más canciones, puedes realizar acciones adicionales
    if (!hasNextTrack) {
      setTimeout(() => {
        // Limpiar la cola y destruir el player
        player.queue.clear();
        player.destroy();
        client.manager?.players.delete(interaction.guild.id);
      }, 5000);
    }
  },
};
