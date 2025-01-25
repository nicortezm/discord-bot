import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { Command } from "../../interfaces";
import { LostArkAPI } from "../../lib/lostark/apisLA";

export const command: Command = {
  data: new SlashCommandBuilder()
    .setName("character")
    .setDescription(
      "Obtiene detalles de un personaje en lost ark (engravings,arkpassive,etc)"
    )
    .addStringOption((opt) =>
      opt
        .setName("nombre")
        .setDescription("Nombre del personaje en lost ark")
        .setRequired(true)
    ),
  async execute(client, ctx) {
    const messageOptstring = ctx.options.get("nombre", true)?.value as string;
    const messageOption = toCamelCase(messageOptstring);
    await ctx.sendDeferMessage({});
    //DI?
    const lostArkApi = new LostArkAPI();
    const embedResponse = new EmbedBuilder()
      .setTitle("Character Details")
      .setFooter({
        text: "Respuesta generada",
        iconURL: "https://cdn3.emoji.gg/emojis/1779_check.png",
      })
      .setColor("Aqua");
    try {
      //
      const character = await lostArkApi.character(messageOption);
      // mapear datos
      if (character === undefined) {
        embedResponse.setDescription("No se encontró el personaje");
        await ctx.editMessage({ embeds: [embedResponse] });
        return;
      }
      if (character.engravings.length === 0) {
        embedResponse.setDescription(
          "El personaje tiene mas de 5 engravings. Actualmente no se pueden mostrar"
        );
        await ctx.editMessage({ embeds: [embedResponse] });
        return;
      }
      // Crear un embed
      embedResponse.addFields({
        name: "Engravings",
        value: character.engravings.map((eng) => `${eng}`).join("\n"),
      });
      if (character.arkPassiveEnabled) {
        embedResponse.addFields(
          {
            name: "Ark Passive",
            value:
              "**[Enlightenment]**\n" +
              character.arkpassive.enlightenment
                .map((ap) => `${ap.name} Lv. ${ap.level}`)
                .join("\n"),
            inline: true,
          },
          {
            name: "--",
            value:
              "**[Evolution]**\n" +
              character.arkpassive.evolution
                .map((ap) => `${ap.name} Lv. ${ap.level}`)
                .join("\n"),
            inline: true,
          },
          {
            name: "--",
            value:
              "**[Leap]**\n" +
              character.arkpassive.leap
                .map((ap) => `${ap.name} Lv. ${ap.level}`)
                .join("\n"),
            inline: true,
          }
        );
      }
      await ctx.editMessage({ embeds: [embedResponse] });
    } catch (error) {
      console.log(error);
      //TODO: Winston
      // return ctx.sendMessage({
      //   content: `Error connecting to AI API `,
      //   ephemeral: true,
      // });
    }
  },
};

const toCamelCase = (str: string) => {
  return str.toLowerCase().replace(/^./, (chr) => chr.toUpperCase());
};
