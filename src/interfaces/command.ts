import { ChatInputCommandInteraction, SharedSlashCommand } from "discord.js";
import { GlobClient } from "./globClient";
import Context from "../lib/context";

export interface Command {
  data: SharedSlashCommand;
  developer?: boolean; // Permite saber si el comando es exclusivo del desarrollador o para todo el mundo
  execute: (client: GlobClient, ctx: Context) => Promise<any>;
}
