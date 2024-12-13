import {
  EmbedBuilder,
  InteractionContextType,
  PermissionsBitField,
  SlashCommandBuilder,
} from 'discord.js';
import { Command } from '../../interfaces';

export const command: Command = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Play a song from a supported source')
    .setContexts(InteractionContextType.Guild)
    .addStringOption((option) =>
      option
        .setName('search')
        .setDescription('The song to play')
        .setRequired(true)
    ),

  async execute(client, interaction) {
    if (!interaction.inCachedGuild()) return; // solo se puede usar en un server
    if (!interaction.guild.members.me) return; // no se puede ejecutar este comando en este sv
    const search = interaction.options.getString('search') ?? '';
    const { channel } = interaction.member.voice;
    if (!channel) {
      return interaction.reply({
        content: 'you need to be in a voice channel',
        ephemeral: true,
      });
    }
    if (!interaction.guild) return;
    if (!interaction.channel) return;
    if (
      !channel
        .permissionsFor(interaction.guild.members.me)
        .has(PermissionsBitField.Flags.Connect)
    ) {
      return interaction.reply({
        content: "I don't have permission to join your voice chanel!",
        ephemeral: true,
      });
    }

    await interaction.reply({ content: 'Searching...' });

    const player = await client.manager?.createPlayer({
      guildId: interaction.guild.id,
      voiceId: channel.id,
      textId: interaction.channel.id,
      volume: 100,
      deaf: true,
    });

    const res = await player?.search(search, { requester: interaction.user });

    if (!res?.tracks.length) {
      return interaction.editReply('No result found');
    }
    if (res.type === 'PLAYLIST') {
      for (let track of res.tracks) {
        player?.queue.add(track);
      }
      if (!player?.playing && !player?.paused) {
        player?.play();
      }
      const embed = new EmbedBuilder()
        .setColor('Random')
        .setTitle('Playlist Added')
        .setDescription(
          `**[${res.playlistName}](${search})** \n\n**Tracks
        Queued:** \`${res.tracks.length}\``
        )
        .setFooter({ text: 'Enjoy your music!' });
      return interaction.editReply({ content: '', embeds: [embed] });
    } else {
      player?.queue.add(res.tracks[0]);
      if (!player?.playing && !player?.paused) {
        player?.play();
      }
      const embed = new EmbedBuilder()
        .setColor('Random')
        .setTitle('Playlist Added')
        .setDescription(`[${res.tracks[0].title}](${res.tracks[0].uri})`)
        .setFooter({ text: 'Playing now' });
      return interaction.editReply({ content: '', embeds: [embed] });
    }

    // const delay = Date.now() - interaction.createdAt.getTime();

    // const embedResponse = new EmbedBuilder()
    //   .setTitle('Pong!')
    //   .setDescription(`Bot delay is \`${delay}ms\`.`)
    //   .setColor('Aqua');
    // await interaction.reply({ embeds: [embedResponse], ephemeral: true });
  },
};
