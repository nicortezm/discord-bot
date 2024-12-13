import {
  EmbedBuilder,
  InteractionContextType,
  SlashCommandBuilder,
} from 'discord.js';
import { Command } from '../../interfaces';
import { envs } from '../../config';
import { AzureService } from '../../services';

const ALLOWED_CHANNEL_ID = envs.ALLOWED_CHANNEL_ID;
const ALLOWED_ROLE_ID = envs.ALLOWED_ROLE_ID;

export const command: Command = {
  data: new SlashCommandBuilder()
    .setName('start')
    .setContexts(InteractionContextType.Guild)
    .setDescription('Iniciar servidor de minecraft'),

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
    if (!vmStatus) {
      description +=
        '⚙️ La máquina virtual está offline.\n🚀 Encendiendo máquina virtual.\n';
      await interaction.editReply({
        embeds: [embed.setDescription(description).setColor('Aqua')],
      });
      const startVM = await AzureService.startVM();
      if (!startVM) {
        description += '❌ La máquina virtual no se ha podido iniciar\n';
        await interaction.editReply({
          embeds: [embed.setDescription(description).setColor('Red')],
        });
        return;
      }
    }

    // Si la VM está online, mostramos el estado de la máquina virtual
    description += '🖥️ Maquina Virtual Online ✅\n';
    embed.setDescription(description);
    embed.setColor('Green');

    await interaction.editReply({
      embeds: [embed],
    });

    // Paso 3: Comprobar el estado del servidor de Minecraft
    const minecraftStatus = await AzureService.getMinecraftStatus();

    if (!minecraftStatus) {
      await interaction.editReply({
        embeds: [
          embed
            .setDescription(
              '❌ El servidor de Minecraft está offline. No se puede continuar.\n'
            )
            .setColor('Red'),
        ],
      });
      return;
    }

    // Si el servidor de Minecraft está online, mostramos el estado del servidor
    description += '🎮 Servidor de Minecraft Online ✅\n';
    embed.setDescription(description);

    await interaction.editReply({
      embeds: [embed],
    });

    embed.setFooter({
      text: 'Proceso completado',
      iconURL: 'https://cdn3.emoji.gg/emojis/1779_check.png',
    });
    // Actualizamos el mensaje final con todos los datos
    await interaction.editReply({
      embeds: [embed],
    });
  },
};
