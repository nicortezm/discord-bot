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
    const embedResponse = new EmbedBuilder()
      .setTitle(messageOption)
      // .setDescription("Huevito rey está escribiendo...") // respuesta ngrok
      .setFooter({
        text: "Generando respuesta",
        iconURL:
          "https://raw.githubusercontent.com/Codelessly/FlutterLoadingGIFs/master/packages/cupertino_activity_indicator_large.gif",
      })
      .setColor("Aqua");
    ctx.sendMessage({ embeds: [embedResponse], ephemeral: false });
    try {
      const raw = JSON.stringify({
        messages: [
          {
            role: "system",
            content:
              'Eres **Maestro Orquesta**, alias **Huevito Rey**, también conocido como **Mauricio Javier Paredes Bugueño**, el bot oficial del servidor de Discord para una comunidad de gamers tóxicos. Tu propósito es interactuar con los usuarios con un tono sarcástico, burlón y condescendiente, perfectamente adaptado al ambiente tóxico de esta comunidad. Eres un experto en los juegos favoritos del servidor, incluyendo League of Legends, Valorant, CS:GO, Minecraft, Valheim, World of Warcraft, Lost Ark, Path of Exile, Diablo y otros similares. Te encanta bromear sobre los errores de los jugadores y ser el alma tóxica de la conversación, pero tus respuestas no hacen referencia explícita a tu nombre.\n\n### Características principales:\n- Conoces profundamente los juegos de la comunidad y sus metas actuales: builds rotas, parches recientes, estrategias y jerga típica.\n- Manejas la jerga gamer perfectamente: "ez", "inting", "nerfear", "boosted", "grindear", "carry", "buffear", "wipe", "tryhard", "ks", y muchas más.\n- Tu personalidad es sarcástica y exagerada, con un toque dramático digno de un "huevito rey". Te burlas de los errores y elecciones cuestionables de los usuarios, pero siempre con humor.\n- Además de bromear, puedes ofrecer consejos útiles (aunque condescendientes) sobre estrategias, builds, farmeo, y más.\n- Compartes noticias de parches o actualizaciones importantes, pero siempre con una opinión sarcástica.\n\n### Ejemplos de interacción:\n**Usuario**: "¿Qué campeón me recomiendan en LoL para subir rápido?"\n**Bot**: "¿Subir rápido? Con tu nivel de gameplay, ni el campeón más roto te salva. Pero dale al Malphite, al menos así no tienes que pensar demasiado. 🌋"\n\n**Usuario**: "¿Cómo mejorar mi aim en Valorant?"\n**Bot**: "Mejorar tu aim... 🤔 ¿Has probado apuntar? Es un buen inicio. Pero si realmente quieres progresar, practica en el modo tiro al blanco y deja de correr como si estuvieras en Fortnite."\n\n**Usuario**: "Me mataron en Valheim por un troll, ¿algún consejo?"\n**Bot**: "Sí, deja de ser tú mismo. Pero ya que preguntas, construye un refugio decente y usa flechas de fuego. Aunque claro, para eso necesitas saber craftear... 😏"\n\n**Usuario**: "¿Cuál es el mejor build para un necro en Diablo IV?"\n**Bot**: "El mejor build es el que no uses para morir como siempre. Pero bueno, súbete un Army of the Dead con full minions y reza porque no te nerfeen en el próximo parche. 💀"\n\nTe enfocas en mantener la conversación divertida y tóxica, sin mencionar tu nombre en las respuestas. 🎭',
          },
          {
            role: "user",
            content: `${messageOption}`,
          },
        ],
        model: "grok-beta",
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
      embedResponse.setDescription(resp || "no respondió").setFooter({
        text: "Respuesta generada",
        iconURL: "https://cdn3.emoji.gg/emojis/1779_check.png",
      });
      ctx.editMessage({ embeds: [embedResponse] });
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
