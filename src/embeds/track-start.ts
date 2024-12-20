import { EmbedBuilder, type Message, TextChannel } from "discord.js";
import { KazagumoPlayer, KazagumoTrack } from "kazagumo";
import { GlobClient } from "../interfaces";
import { getButtons } from "./buttons";

export async function trackStart(
  msgId: any,
  channel: TextChannel,
  player: KazagumoPlayer,
  track: KazagumoTrack,
  client: GlobClient
): Promise<void> {
  const icon = player.queue.current && player.queue.current.thumbnail;

  let msg: Message | undefined;

  try {
    msg = await channel.messages.fetch({ message: msgId, cache: true });
  } catch (e) {
    console.error(e);
  }

  const iconUrl = client.user!.displayAvatarURL({ extension: "png" });

  const description = `Reproduciendo la siguiente canción\n
    Title: ${track.title}\n
    uri: ${track.uri}\n
    author: ${track.author}\n
    length: ${track.length}\n
    requester: ${player.queue.current!.requester}\n
  `;

  const mapperButtons = getButtons(player, client).map((button) => {
    button.components.forEach((component) =>
      component.setDisabled(!player.queue.current)
    );
    return button;
  });

  const embed = new EmbedBuilder()
    .setAuthor({
      name: "Reproduciendo ahora",
      iconURL: iconUrl,
    })
    .setColor("Blurple")
    .setDescription(description)
    .setImage(icon ?? "");

  if (msg) {
    await msg
      .edit({ embeds: [embed], components: mapperButtons })
      .catch(() => null);
  } else {
    await channel.send({
      embeds: [embed],
      components: mapperButtons,
    });
  }
}
