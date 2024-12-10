import { ChatInputCommandInteraction, SharedSlashCommand } from 'discord.js';
import { GlobClient } from './globClient';

export interface Command {
  data: SharedSlashCommand;
  developer?: boolean; // Permite saber si el comando es exclusivo del desarrollador o para todo el mundo
  execute: (
    client: GlobClient,
    interaction: ChatInputCommandInteraction
  ) => void;
}
