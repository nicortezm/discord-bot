import 'dotenv/config';
import { get } from 'env-var';

export const envs = {
  // Configuración de Discord
  DISCORD_TOKEN: get('DISCORD_TOKEN').required().asString(),
  DISCORD_CLIENT_ID: get('DISCORD_CLIENT_ID').required().asString(),
  LAVALINK_IP: get('LAVALINK_IP').required().asString(),
  LAVALINK_PORT: get('LAVALINK_PORT').required().asPortNumber(),
  LAVALINK_PASSWORD: get('LAVALINK_PASSWORD').required().asString(),
  LAVALINK_SECURE: get('LAVALINK_SECURE').required().asBool(),
  ALLOWED_CHANNEL_ID: get('ALLOWED_CHANNEL_ID').required().asString(),
  ALLOWED_ROLE_ID: get('ALLOWED_ROLE_ID').required().asString(),

  // Configuración de Azure
  AZURE_SUBSCRIPTION_ID: get('AZURE_SUBSCRIPTION_ID').required().asString(),
  AZURE_TENANT_ID: get('AZURE_TENANT_ID').required().asString(),
  AZURE_CLIENT_ID: get('AZURE_CLIENT_ID').required().asString(),
  AZURE_CLIENT_SECRET: get('AZURE_CLIENT_SECRET').required().asString(),

  // Detalles de la Máquina Virtual de Azure
  RESOURCE_GROUP: get('RESOURCE_GROUP').required().asString(),
  VM_NAME: get('VM_NAME').required().asString(),

  // Configuración de SSH
  SSH_USER: get('SSH_USER').required().asString(),
  SSH_HOST: get('SSH_HOST').required().asString(),

  // Configuración del Servidor de Minecraft
  MINECRAFT_SERVICE_NAME: get('MINECRAFT_SERVICE_NAME').required().asString(),
  MINECRAFT_SCREEN_NAME: get('MINECRAFT_SCREEN_NAME').required().asString(),
};
