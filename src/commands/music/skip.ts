import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { Command } from '../../interfaces';

export const command: Command = {
  data: new SlashCommandBuilder()
    .setName('skip')
    .setDescription('Skipea la canción actual'),

  async execute(client, interaction) {
    if (!interaction.inCachedGuild()) return;

    const { channel } = interaction.member.voice;

    if (!channel) {
      return interaction.reply({
        content:
          'Necesitas estar en un Chat de voz para ejecutar este comando.',
        ephemeral: true,
      });
    }

    const player = client.manager?.players.get(interaction.guild.id);

    if (!player) {
      return interaction.reply({
        content: 'No hay música reproduciendose.',
        ephemeral: true,
      });
    }

    const currentTrack = player.queue.current;

    if (!currentTrack) {
      return interaction.reply({
        content: 'No hay música reproduciendose.',
        ephemeral: true,
      });
    }

    // Obtener URL y thumbnail de la canción
    const trackUrl = currentTrack.uri || ''; // URL del video
    const trackThumbnail = currentTrack.thumbnail || ''; // Thumbnail de la canción, si no existe, poner un predeterminado

    // Verificar si hay más canciones en la cola
    const hasNextTrack = player.queue.size > 0;

    // Realizar el skip
    player.skip();

    // Crear el embed con el thumbnail
    const embed = new EmbedBuilder()
      .setColor('Random')
      .setTitle('Canción skipeada')
      .setDescription(`⏭️ Skipped **${currentTrack.title}**`)
      .setURL(trackUrl) // Agregar URL del video
      .setThumbnail(trackThumbnail) // Carátula de la canción
      .setFooter({
        text: `Reproduciendo ahora: ${
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
