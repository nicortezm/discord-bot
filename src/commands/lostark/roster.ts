import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { Command } from "../../interfaces";
import { LostArkAPI } from "../../lib/lostark/apisLA";

export const command: Command = {
  data: new SlashCommandBuilder()
    .setName("roster")
    .setDescription(
      "Obtiene el roster de un personaje de Lost Ark (default NAE)"
    )
    .addStringOption((opt) =>
      opt
        .setName("personaje")
        .setDescription("Nombre del personaje en lost ark")
        .setRequired(true)
    )
    .addStringOption((opt) =>
      opt
        .setName("region")
        .setDescription("región del personaje")
        .setRequired(true)
        .setChoices([
          { name: "NAE", value: "NAE" },
          { name: "NAW", value: "NAW" },
          { name: "CE", value: "CE" },
        ])
    ),
  async execute(client, ctx) {
    const messageOptstring = ctx.options.get("personaje", true)
      ?.value as string;
    const regionOptstring = ctx.options.get("region", true)?.value as string;
    const messageOption = toCamelCase(messageOptstring);
    const regionOption = regionOptstring;
    await ctx.sendDeferMessage({});
    const lostArkApi = new LostArkAPI();
    const embedResponse = new EmbedBuilder()
      .setTitle("Roster Info")
      .setFooter({
        text: "Respuesta Generada",
        iconURL: "https://cdn3.emoji.gg/emojis/1779_check.png",
      })
      .setColor("Random");
    try {
      const data = await lostArkApi.roster(messageOption, regionOption);

      if (!data) {
        embedResponse.setDescription("No se encontró el personaje");
        await ctx.editMessage({ embeds: [embedResponse] });
        return;
      }
      const roster = data.roster;

      // Constantes para tabla
      const maxFieldsPerEmbed = 15; // Límite de fields por embed
      const embeds: EmbedBuilder[] = [];
      const totalPages = Math.ceil(roster.length / maxFieldsPerEmbed);
      // mapear datos

      for (let i = 0; i < roster.length; i += maxFieldsPerEmbed) {
        const chunk = roster.slice(i, i + maxFieldsPerEmbed);
        const currentPage = Math.floor(i / maxFieldsPerEmbed) + 1; // Página actual
        const embed = new EmbedBuilder()
          .setTitle(`Roster Info: ${messageOption}`)
          .setColor(0x1f8b4c)
          .setFooter({
            text: `Page ${currentPage}/${totalPages}`,
            iconURL: "https://cdn3.emoji.gg/emojis/1779_check.png",
          });
        if (currentPage == 1) {
          embed.setDescription(
            `**Server:** ${data.header.world} \n**Stronghold:** ${data.header.stronghold} \n**Roster Lvl:** ${data.header.rosterLevel}\n\n**—**`
          );
        }

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
