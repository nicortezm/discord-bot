import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { Command } from '../../interfaces';
import { envs } from '../../config';
import { AzureService } from '../../services';

const ALLOWED_CHANNEL_ID = envs.ALLOWED_CHANNEL_ID;
const ALLOWED_ROLE_ID = envs.ALLOWED_ROLE_ID;

export const command: Command = {
  data: new SlashCommandBuilder()
    .setName('stop')
    .setDescription('Apagar servidor de minecraft'),

  async execute(client, interaction) {
    if (!interaction.inCachedGuild()) return;
    // validar chanel.id y member.roles.cache.has(ALLOWED_ROLE_ID)
    if (!interaction.member) return;
    if (interaction.channelId !== ALLOWED_CHANNEL_ID) {
      await interaction.reply({
        content: 'Este comando solo se puede ejecutar en un canal específico.',
        ephemeral: true, // Solo visible para el usuario que ejecuta el comando
      });
      return;
    }

    // Validación de rol
    if (!interaction.member?.roles.cache.has(ALLOWED_ROLE_ID)) {
      await interaction.reply({
        content:
          'No tienes los permisos necesarios para ejecutar este comando.',
        ephemeral: true,
      });
      return;
    }
    // Crear un embed que vamos a ir reutilizando
    let description = '⏳ Verificando estado de la máquina virtual.\n';
    const embed = new EmbedBuilder()
      .setTitle('🌐 ** Minecraft Server** 🌐')
      .setColor('Blurple')
      .setThumbnail(interaction.guild?.iconURL() || '')
      .setDescription(description)
      .setFooter({
        text: 'Validando',
        iconURL:
          'https://raw.githubusercontent.com/Codelessly/FlutterLoadingGIFs/master/packages/cupertino_activity_indicator_large.gif',
      });

    await interaction.reply({
      embeds: [embed],
    });

    // Paso 2: Comprobar el estado de la VM (Azure)
    const vmStatus = await AzureService.getStatusVM();
    console.log(vmStatus);
    if (!vmStatus) {
      description += '✅ La máquina virtual está offline.\n';
      await interaction.editReply({
        embeds: [embed.setDescription(description).setColor('Red')],
      });
      return;
    }

    description += '🔌 Apagando el servidor de minecraft.\n';
    await interaction.editReply({
      embeds: [embed.setDescription(description).setColor('Red')],
    });

    const stopMcServer = await AzureService.stopMinecraftServer();
    if (!stopMcServer) {
      description += '❌ No fue posible apagar el servidor.';
      await interaction.editReply({
        embeds: [embed.setDescription(description).setColor('Red')],
      });
      return;
    }

    description += '⏳ Apagando máquina virtual.\n';
    await interaction.editReply({
      embeds: [embed.setDescription(description).setColor('Red')],
    });

    const shutdownVM = await AzureService.shutdownVM();
    if (!shutdownVM) {
      description += '❌ Error al apagar máquina virtual.';
      await interaction.editReply({
        embeds: [
          embed.setDescription(description).setColor('Red').setFooter({
            text: '❌ Proceso Fallido',
          }),
        ],
      });
      return;
    }

    description += '✅ Máquina virtual apagada.';
    await interaction.editReply({
      embeds: [
        embed.setDescription(description).setColor('Green').setFooter({
          text: 'Proceso completado',
          iconURL: 'https://cdn3.emoji.gg/emojis/1779_check.png',
        }),
      ],
    });
  },
};
