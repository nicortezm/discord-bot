import { Button, GlobClient } from '../interfaces';
import { loadFiles } from '../lib';

export async function handleButtons(client: GlobClient) {

  client.buttons.clear();

  const files = await loadFiles('buttons');
  files.forEach((file) => {
    const { button } = require(file) as { button: Button };
    try {
      client.buttons.set(button.name, button);
    } catch (error) {
    }
  });

}
