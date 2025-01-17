import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { Command, Character } from "../../interfaces";
import { classesMap } from "../../lib/lostark/classes";

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
    await ctx.sendDeferMessage({});
    const embedResponse = new EmbedBuilder()
      .setTitle("Roster Info")
      .setFooter({
        text: "Respuesta generada",
        iconURL: "https://cdn3.emoji.gg/emojis/1779_check.png",
      })
      .setColor("Aqua");
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

      if (data.length === 0) {
        embedResponse.setDescription("No se encontró el personaje");
        await ctx.editMessage({ embeds: [embedResponse] });
        return;
      }

      // Constantes para tabla
      const maxFieldsPerEmbed = 15; // Límite de fields por embed
      const embeds: EmbedBuilder[] = [];

      // mapear datos

      const enhancedRoster = data.map((character) => {
        return {
          name: character.name,
          lastUpdate: `<t:${Math.floor(
            new Date(character.lastUpdate).getTime() / 1000
          )}:R>`,
          class: classesMap[character.class],
          ilvl: Math.round(character.ilvl * 100) / 100,
        };
      });

      for (let i = 0; i < enhancedRoster.length; i += maxFieldsPerEmbed) {
        const chunk = enhancedRoster.slice(i, i + maxFieldsPerEmbed);

        const embed = new EmbedBuilder()
          .setTitle(`Roster Info - ${Math.floor(i / maxFieldsPerEmbed) + 1}`)
          .setColor(0x1f8b4c)
          .setTimestamp();

        chunk.forEach((char) => {
          embed.addFields([
            {
              name: char.name,
              value: `**ILVL:** ${char.ilvl.toFixed(2)}\n**Class:** ${
                char.class
              }\n**Last Update:** ${char.lastUpdate}`,
              inline: true,
            },
          ]);
        });

        embeds.push(embed);
      }

      // Crear un embed

      await ctx.editMessage({ embeds: embeds });
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
