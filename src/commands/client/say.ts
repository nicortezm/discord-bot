import { InteractionContextType, SlashCommandBuilder } from 'discord.js';
import { Command } from '../../interfaces';

export const command: Command = {
  data: new SlashCommandBuilder()
    .setName('say')
    .setDescription('El bot envía un mensaje por ti.')
    .setContexts(InteractionContextType.Guild)
    .addStringOption((opt) =>
      opt
        .setName('mensaje')
        .setDescription('El mensaje que se enviará.')
        .setRequired(true)
    ),

  async execute(client, interaction) {
    const messageOption = interaction.options.getString('mensaje', true);

    if (interaction.channel?.isSendable()) {
      await interaction.channel.send(messageOption);
    }
    await interaction.reply({
      content: 'Tu mensaje se ha enviado correctamente.',
      ephemeral: true,
    });
  },
};
