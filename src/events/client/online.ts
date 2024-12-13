import { Event } from '../../interfaces';
import { handleButtons, handleCommands } from '../../handlers';
import { ActivityType, PresenceData } from 'discord.js';
export const event: Event<'ready'> = {
  name: 'ready',
  once: true,
  execute(client) {
    console.log(`[CLIENT] ${client.user.username} is online`);

    client.user.setPresence({
      activities: [
        {
          name: 'sida',
          type: ActivityType.Streaming,
          url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          
        },
      ],
    });
    handleCommands(client);
    handleButtons(client);
  },
};
