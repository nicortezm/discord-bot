import {
  PermissionFlagsBits,
  type TextChannel,
} from "discord.js";
import type { KazagumoPlayer, KazagumoTrack } from "kazagumo";
import { Event } from "../../interfaces";
import { trackStart } from "../../embeds/track-start";
import { GlobClient } from "../../interfaces";
import Context from '../../lib/context'

export const event: Event<any> = {
  name: "trackStart",
  execute(client: GlobClient, ctx: Context) {
    client.manager?.on(
      "playerStart",
      async (player: KazagumoPlayer, track: KazagumoTrack) => {
        try {
          const channel = client.channels.cache.get(
            player.textId!
          ) as TextChannel;
          if (!channel) return;

          if (
            !channel.viewable ||
            !channel
              .permissionsFor(client.user!)
              ?.has([
                PermissionFlagsBits.SendMessages,
                PermissionFlagsBits.ViewChannel,
              ])
          )
            return;

          const msgId = ctx?.message?.id;
          console.log(ctx?.message?.id);

          await trackStart(msgId, channel, player, track, client);
        } catch (e) {
          console.error(e);
        }
      }
    );
  },
};
