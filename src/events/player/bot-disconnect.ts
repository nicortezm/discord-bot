import { GlobClient, Event } from '../../interfaces';
import { Events, VoiceState } from 'discord.js';

export const event: Event<Events.VoiceStateUpdate> = {
  name: Events.VoiceStateUpdate,
  execute(client: GlobClient, oldState: VoiceState, newState: VoiceState) {
    const manager = client.manager;

    // Asegurarnos de que el evento se refiera al bot
    if (oldState.member?.id !== client.user?.id) return;

    // Verificar si el bot fue desconectado de un canal de voz
    if (oldState.channelId && !newState.channelId) {
      const player = manager?.players.get(oldState.guild.id);

      if (player) {
        console.log(
          `El bot fue desconectado en el servidor ${oldState.guild.id}. Limpiando player...`
        );

        try {
          // Limpiar la cola y destruir el player
          player.queue.clear();
          if (player.voiceId) {
            // Verifica si el player sigue conectado a un canal
            player.destroy(); // Destruye el player si está conectado
          }

          // Remover explícitamente el player del manager
          manager?.players.delete(oldState.guild.id);

          console.log(
            `Player para el servidor ${oldState.guild.id} ha sido destruido.`
          );
        } catch (error) {
          console.error(
            `Error al limpiar el player para el servidor ${oldState.guild.id}:`,
            error
          );
        }
      }
    }
  },
};
