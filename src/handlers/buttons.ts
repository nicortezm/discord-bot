import { Table } from 'tablifier';
import { Button, GlobClient } from '../interfaces';
import { loadFiles } from '../lib';

export async function handleButtons(client: GlobClient) {
  const table = new Table('Button Name', 'Status');

  client.buttons.clear();

  const files = await loadFiles('buttons');
  files.forEach((file) => {
    const { button } = require(file) as { button: Button };
    try {
      client.buttons.set(button.name, button);
      table.addRow(button.name, 'Done');
    } catch (error) {
      table.addRow(button.name, 'Error');
    }
  });

  console.log(table.toString());
}
