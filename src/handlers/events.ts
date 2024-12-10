import { Table } from 'tablifier';
import { Event, GlobClient } from '../interfaces';
import { loadFiles } from '../lib';

export async function handleEvents(client: GlobClient): Promise<void> {
  const table = new Table('Event Name', 'Status');

  client.events.clear();

  const files = await loadFiles('events');
  files.forEach((file) => {
    const { event } = require(file) as { event: Event<any> };
    try {
      const execute = (...args: any[]) => event.execute(client, ...args);
      client.events.set(event.name, execute);
      if (event.rest) {
        if (event.once) client.rest.once(event.name, execute);
        else client.rest.on(event.name, execute);
      } else {
        if (event.once) client.once(event.name, execute);
        else client.on(event.name, execute);
      }
      table.addRow(event.name, 'Done');
    } catch (error) {
      table.addRow(event.name, 'Error');
    }
  });
  console.log(table.toString());
}
