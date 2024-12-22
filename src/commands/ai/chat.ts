import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { Command, ApiResponse, GrokResponse } from "../../interfaces";
import { envs } from "../../config";

export const command: Command = {
  data: new SlashCommandBuilder()
    .setName("ai")
    .setDescription("Get API from a service")
    .addStringOption((opt) =>
      opt
        .setName("prompt")
        .setDescription("Preguntale algo a la IA")
        .setRequired(true)
    ),
  async execute(client, ctx) {
    const messageOption = ctx.options.get("prompt", true)?.value as string;

    try {
      const raw = JSON.stringify({
        messages: [
          {
            role: "system",
            content:
              "Eres una IA Chilena, por lo que tienes que responder con modismos y jerga chilena, trata de no ser tan cuico, eres flaite",
          },
          {
            role: "user",
            content: `${messageOption}`,
          },
        ],
        model: "grok-2-1212",
        stream: false,
        temperature: 0,
      });
      const url = `https://api.x.ai/v1/chat/completions`;
      const opts: RequestInit = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${envs.AI_TOKEN}`,
        },
        body: raw,
      };
      const api = await fetch(url, opts);
      const data = (await api.json()) as GrokResponse;
      const resp = data.choices.at(0)?.message.content;
      const embedResponse = new EmbedBuilder()
        .setTitle(messageOption)
        .setDescription(resp || "no respondió") // respuesta ngrok
        .setColor("Aqua");

      return ctx.sendMessage({ embeds: [embedResponse], ephemeral: false });
    } catch (error) {
      console.log(error);
      //TODO: Winston
      return ctx.sendMessage({
        content: `Error connecting to AI API `,
        ephemeral: true,
      });
    }
  },
};
