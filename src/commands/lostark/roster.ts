import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { Command, Character } from "../../interfaces";

export const command: Command = {
  data: new SlashCommandBuilder()
    .setName("roster")
    .setDescription("Obtiene el roster de un personaje de Lost Ark (NAE)")
    .addStringOption((opt) =>
      opt
        .setName("personaje")
        .setDescription("Nombre del personaje en lost ark")
        .setRequired(true)
    ),
  async execute(client, ctx) {
    const messageOptstring = ctx.options.get("personaje", true)
      ?.value as string;
    const messageOption = toCamelCase(messageOptstring);
    const embedResponse = new EmbedBuilder()
      .setTitle("Roster Info")
      .setFooter({
        text: "Generando respuesta",
        iconURL:
          "https://raw.githubusercontent.com/Codelessly/FlutterLoadingGIFs/master/packages/cupertino_activity_indicator_large.gif",
      })
      .setColor("Aqua");
    ctx.sendMessage({ embeds: [embedResponse], ephemeral: false });
    try {
      // Validar que el mensaje no contenga espacios
      const url = `https://uwuowo.mathi.moe/api/roster/NAE/${messageOption}`;
      const opts: RequestInit = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      };
      const api = await fetch(url, opts);
      const data = (await api.json()) as Character[];
      // const resp =

      if (data.length === 0) {
        embedResponse.setDescription("No se encontró el personaje").setFooter({
          text: "Respuesta generada",
          iconURL: "https://cdn3.emoji.gg/emojis/1779_check.png",
        });
        ctx.editMessage({ embeds: [embedResponse] });
        return;
      }
      // mapear datos
      data.forEach((character) => {
        embedResponse.addFields(
          {
            name: "Name",
            value: character.name,
            inline: true,
          },
          {
            name: "ILVL / Class",
            value: `${character.ilvl} / ${character.class}`,
            inline: true,
          },
          {
            name: "Last Update",
            value: `<t:${Math.floor(
              new Date(character.lastUpdate).getTime() / 1000
            )}:R>`,
            inline: true,
          }
        );
      });
      embedResponse.setDescription(" ").setFooter({
        text: "Respuesta generada",
        iconURL: "https://cdn3.emoji.gg/emojis/1779_check.png",
      });
      ctx.editMessage({ embeds: [embedResponse] });
    } catch (error) {
      // console.log(error);
      //TODO: Winston
      return ctx.sendMessage({
        content: `Error connecting to AI API `,
        ephemeral: true,
      });
    }
  },
};

const toCamelCase = (str: string) => {
  return str.toLowerCase().replace(/^./, (chr) => chr.toUpperCase());
};
