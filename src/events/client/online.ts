import { Event } from '../../interfaces';
import { handleCommands } from '../../handlers';

export const event: Event<'ready'> = {
  name: 'ready',
  once: true,
  execute(client) {
    console.log(`[CLIENT] ${client.user.username} is online`);

    handleCommands(client);
  },
};
