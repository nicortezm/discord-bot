import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  type EmojiIdentifierResolvable,
} from "discord.js";
import type { KazagumoPlayer } from "kazagumo";
import { GlobClient } from "../interfaces";

function getButtons(
  player: KazagumoPlayer,
  client: GlobClient
): ActionRowBuilder<ButtonBuilder>[] {
  const buttons = [
    {
      customId: "PREV_BUT",
      emoji: "⏮️",
      style: ButtonStyle.Secondary,
    },
    {
      customId: "REWIND_BUT",
      emoji: "⏪",
      style: ButtonStyle.Secondary,
    },
    {
      customId: "PAUSE_BUT",
      emoji: player.paused ? "▶️" : "⏸️",
      style: player.paused ? ButtonStyle.Success : ButtonStyle.Secondary,
    },
    {
      customId: "FORWARD_BUT",
      emoji: "⏩",
      style: ButtonStyle.Secondary,
    },
    {
      customId: "SKIP_BUT",
      emoji: "⏭️",
      style: ButtonStyle.Secondary,
    },
    {
      customId: "NEXT_BUT",
      emoji: "⏭️",
      style: ButtonStyle.Secondary,
    },
    {
      customId: "STOP_BUT",
      emoji: "⏹️",
      style: ButtonStyle.Danger,
    },
  ];

  return buttons.reduce((rows, { customId, emoji, style }, index) => {
    if (index % 5 === 0) rows.push(new ActionRowBuilder<ButtonBuilder>());

    let emojiFormat: EmojiIdentifierResolvable;
    if (typeof emoji === "string" && emoji.startsWith("<:")) {
      const match = emoji.match(/^<:\w+:(\d+)>$/);
      emojiFormat = match ? match[1] : emoji;
    } else {
      emojiFormat = emoji;
    }

    const button = new ButtonBuilder()
      .setCustomId(customId)
      .setEmoji(emojiFormat)
      .setStyle(style);
    rows[rows.length - 1].addComponents(button);
    return rows;
  }, [] as ActionRowBuilder<ButtonBuilder>[]);
}

export { getButtons };