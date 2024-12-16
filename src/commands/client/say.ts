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

  async execute(client, ctx): Promise<any> {
    const messageOption = ctx.options.get('mensaje')?.value as string;

    if (ctx.interaction?.channel?.isSendable()) {
      await ctx.interaction.channel.send({ content: messageOption });
    }

    return await ctx.sendMessage({
      content: 'Tu mensaje se ha enviado correctamente.',
      ephemeral: true,
    });
  },
};
