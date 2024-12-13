import { Client, Collection } from 'discord.js';
import { Devs, envs } from './config';
import { GlobClient } from './interfaces';
import { handleEvents } from './handlers';
import { Connectors } from 'shoukaku';
import { Kazagumo, Plugins } from 'kazagumo';
const client = new Client({
  intents: [
    'Guilds',
    'GuildMembers',
    'GuildMessages',
    'MessageContent',
    'GuildVoiceStates',
  ],
}) as GlobClient;

client.config = Devs;
client.events = new Collection();
client.commands = new Collection();
client.buttons = new Collection();
handleEvents(client);

client.login(envs.DISCORD_TOKEN);

const Nodes = [
  {
    name: 'main',
    url: `${envs.LAVALINK_IP}:${envs.LAVALINK_PORT}`,
    auth: envs.LAVALINK_PASSWORD,
    secure: envs.LAVALINK_SECURE,
  },
];

client.manager = new Kazagumo(
  {
    defaultSearchEngine: 'youtube',
    send: (guildId, payload) => {
      const guild = client.guilds.cache.get(guildId);
      if (guild) guild.shard.send(payload);
    },
  },
  new Connectors.DiscordJS(client),
  Nodes
);
