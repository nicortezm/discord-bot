import 'dotenv/config';
import { get } from 'env-var';

export const envs = {
  // Configuración de Discord
  DISCORD_TOKEN: get('DISCORD_TOKEN').required().asString(),
  DISCORD_CLIENT_ID: get('DISCORD_CLIENT_ID').required().asString(),
};
