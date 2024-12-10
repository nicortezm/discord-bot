import { Table } from 'tablifier';
import type { GlobClient } from '../interfaces';
import { RESTPostAPIApplicationCommandsJSONBody } from 'discord.js';
import { loadFiles } from '../lib';
import { Command } from '../interfaces';

export async function handleCommands(client: GlobClient): Promise<void> {
  const table = new Table('Command Name', 'Status');

  client.commands.clear();

  const commands: RESTPostAPIApplicationCommandsJSONBody[] = [];

  const files = await loadFiles('commands');
  files.forEach((file) => {
    const { command } = require(file) as { command: Command };
    try {
      client.commands.set(command.data.name, command);
      commands.push(command.data.toJSON());
      table.addRow(command.data.name, 'Done');
    } catch (error) {
      table.addRow(command.data.name, 'Error');
    }
  });

  client.application.commands.set(commands);
  console.log(table.toString());
}
