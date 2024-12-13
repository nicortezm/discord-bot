import { Button } from '../../interfaces';

export const button: Button = {
  name: 'add-role-v2',
  async execute(client, interaction, rolId) {
    if (!interaction.inCachedGuild()) return;
    await interaction.member?.roles.add(rolId); //TODO: detectar como saber el id del rol

    await interaction.reply({ content: 'Role added', ephemeral: true });
  },
};
