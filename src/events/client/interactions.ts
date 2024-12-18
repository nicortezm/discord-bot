import { Event } from '../../interfaces';
import Context from '../../lib/context';

export const event: Event<'interactionCreate'> = {
  name: 'interactionCreate',
  async execute(client, interaction) {
    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (!command) return;

      if (
        command.developer &&
        !client.config.developers.includes(interaction.user.id)
      )
        return await interaction.reply({
          content: 'This command is only available for devs',
        });

      const ctx = new Context(interaction, [])

      command.execute(client, ctx);
    } else if (interaction.isButton()) {
      const buttonInfo = interaction.customId.split('_');
      const button = client.buttons.get(buttonInfo[0]);
      if (!button) return;
      button.execute(client, interaction, ...buttonInfo.slice(1));
    }
  },
};
