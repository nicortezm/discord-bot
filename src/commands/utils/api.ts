import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { Command, ApiResponse } from "../../interfaces";

export const command: Command = {
  data: new SlashCommandBuilder()
    .setName("api")
    .setDescription("Get API from a service")
    .addStringOption((opt) =>
      opt.setName("pokemon").setDescription("Pokemon name").setRequired(true)
    ),
  async execute(client, ctx) {
    const pokemon = ctx.options.get("pokemon", true)?.value as string;

    try {
      const api = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);
      const data = (await api.json()) as ApiResponse;
      const embedResponse = new EmbedBuilder()
        .setTitle(`Pokemon info: **${pokemon}**`)
        .setFields(
          { name: "Height", value: data.height.toString(), inline: true },
          { name: "Weight", value: data.weight.toString(), inline: true },
          {
            name: "Type",
            value: data.types.map((obj) => obj.type.name).join(", "),
            inline: true,
          },
          {
            name: "Abilities",
            value: data.abilities.map((obj) => obj.ability.name).join(", "),
            inline: true,
          }
        )
        .setColor("Random")
        .setThumbnail(data.sprites.other["official-artwork"].front_default);

      return ctx.sendMessage({ embeds: [embedResponse], ephemeral: true });
    } catch (error) {
      console.log(error); //TODO: Winston
      return ctx.sendMessage({
        content: `Can't get pokemon information: ${pokemon} `,
        ephemeral: true,
      });
    }
  },
};
