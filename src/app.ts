import { Client, Collection } from 'discord.js';
import { Devs, envs } from './config';
import { GlobClient } from './interfaces';
import { handleEvents } from './handlers';

const client = new Client({
  intents: ['Guilds', 'GuildMembers', 'GuildMessages', 'MessageContent'],
}) as GlobClient;

client.config = Devs;
client.events = new Collection();
client.commands = new Collection();
client.buttons = new Collection();
handleEvents(client);

client.login(envs.DISCORD_TOKEN);
