import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  Message,
} from "discord.js";
import { GlobClient } from "../interfaces";
import Context from "./context";

export const chunk = (arr: any[], size: number) => {
  const chunked_arr: any[][] = [];

  for (let index = 0; index < arr.length; index += size) {
    chunked_arr.push(arr.slice(index, size + index));
  }
  return chunked_arr;
};

export const paginated = async (
  client: GlobClient,
  ctx: Context,
  embed: EmbedBuilder[]
): Promise<Message | undefined> => {
  if (!embed.length) return;

  if (embed.length < 2) {
    return await ctx.sendMessage({ embeds: [embed[0]] });
  }

  let page = 0;

  const getButton = (page: number) => {
    const firstEmbed = page === 0;
    const lastEmbed = page === embed.length - 1;

    return {
      embeds: [embed[page]],
      components: [
        new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder()
            .setCustomId("first")
            .setLabel("⏮️")
            .setStyle(ButtonStyle.Primary)
            .setDisabled(firstEmbed),
          new ButtonBuilder()
            .setCustomId("back")
            .setLabel("◀️")
            .setStyle(ButtonStyle.Primary)
            .setDisabled(firstEmbed),
          new ButtonBuilder()
            .setCustomId("next")
            .setLabel("▶️")
            .setStyle(ButtonStyle.Primary)
            .setDisabled(lastEmbed),
          new ButtonBuilder()
            .setCustomId("last")
            .setLabel("⏭️")
            .setStyle(ButtonStyle.Primary)
            .setDisabled(lastEmbed),
          new ButtonBuilder()
            .setCustomId("stop")
            .setLabel("⏹️")
            .setStyle(ButtonStyle.Danger)
        ),
      ],
    };
  };

  try {
    const msg = await ctx.sendMessage({
      ...getButton(0),
      fetchReply: true,
    });

    const collector = msg.createMessageComponentCollector({
      filter: (i) => i.user.id === ctx.author?.id,
      time: 40000,
    });

    collector.on("collect", async (interaction) => {
      await interaction.deferUpdate().catch(() => {});

      switch (interaction.customId) {
        case "first":
          page = 0;
          break;
        case "back":
          page = Math.max(0, page - 1);
          break;
        case "next":
          page = Math.min(embed.length - 1, page + 1);
          break;
        case "last":
          page = embed.length - 1;
          break;
        case "stop":
          collector.stop();
          return;
      }

      await interaction.editReply(getButton(page)).catch(() => {});
    });

    collector.on("end", async () => {
      if (msg.editable) {
        await msg
          .edit({
            embeds: [embed[page]],
            components: [],
          })
          .catch(() => {});
      }
    });

    return msg;
  } catch (error) {
    console.error("Error in pagination:", error);
    await ctx
      .sendMessage({
        content: "Ocurrió un error al mostrar las páginas.",
        ephemeral: true,
      })
      .catch(() => {});
  }
};
