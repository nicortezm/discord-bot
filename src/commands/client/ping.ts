import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { Command } from "../../interfaces";
import Context from "../../lib/context";

export const command: Command = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Verificar la conexión con el Bot"),

  async execute(client, ctx: Context): Promise<any> {
    const deferMsg = await ctx.sendDeferMessage("Enviando ping...");

    const botLatency = deferMsg.createdTimestamp - ctx.createdTimestamp;
    const apiLatency = Math.round(ctx.client.ws.ping);

    const botLatencySign = botLatency < 600 ? "+" : "-";
    const apiLatencySign = apiLatency < 500 ? "+" : "-";

    const embedResponse = new EmbedBuilder()
      .setTitle("Pong!")
      .setAuthor({
        name: "Pong!",
      })
      .addFields([
        {
          name: "Latencia del Bot",
          value: `\`\`\`diff\n${botLatencySign} ${botLatency}ms\n\`\`\``,
          inline: true,
        },
        {
          name: "Latencia de la API",
          value: `\`\`\`diff\n${apiLatencySign} ${apiLatency}ms\n\`\`\``,
          inline: true,
        },
      ])
      .setColor("Aqua")
      .setFooter({
        text: `Solicitado por ${ctx.interaction?.user.tag}`,
      })
      .setTimestamp();
    return await ctx.editMessage({ content: "", embeds: [embedResponse] });
  },
};
