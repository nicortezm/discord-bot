import { DefaultAzureCredential } from '@azure/identity';
import { ComputeManagementClient } from '@azure/arm-compute';
import { Client, ClientChannel } from 'ssh2';
import { envs } from '../config';
import { join } from 'path';
import { readFileSync } from 'fs';
// Constantes
const resourceGroup = envs.RESOURCE_GROUP;
const vmName = envs.VM_NAME;
const credential = new DefaultAzureCredential();
const computeClient = new ComputeManagementClient(
  credential,
  envs.AZURE_SUBSCRIPTION_ID || ''
);

const sshUser = process.env.SSH_USER || '';
const sshHost = process.env.SSH_HOST || '';
const privateKeyPath = join(__dirname, '../../keys/minecraft-server_key.pem'); // Ruta al archivo .pem

export class AzureService {
  public static async getStatusVM(): Promise<boolean> {
    const instanceView = await computeClient.virtualMachines.instanceView(
      resourceGroup,
      vmName
    );
    const statuses = instanceView.statuses || [];
    const powerState = statuses.find((status) =>
      status.code?.startsWith('PowerState/')
    )?.displayStatus;

    if (powerState === 'VM running') {
      return true;
    }
    return false;
  }

  // Método para obtener el estado del servidor de Minecraft
  public static async getMinecraftStatus(): Promise<boolean> {
    // Todo: Falta implementar, de momento al iniciar la maquina se inicia también el servicio de minecraft
    return new Promise((resolve) => {
      setTimeout(() => {
        const isOnline = true;
        resolve(isOnline);
      }, 2000);
    });
  }

  // Método para obtener la cantidad de jugadores conectados (número aleatorio entre 0 y 15)
  public static async getCurrentPlayers(): Promise<number> {
    // TODO: Ver posibilidad de hacerlo con RCON (?)
    return new Promise((resolve) => {
      setTimeout(() => {
        const randomPlayers = Math.floor(Math.random() * 16); // Número aleatorio entre 0 y 15
        resolve(randomPlayers);
      }, 2000); // Simulamos un retraso de 2 segundos
    });
  }

  public static async startVM(): Promise<boolean> {
    //
    try {
      await computeClient.virtualMachines.beginStartAndWait(
        resourceGroup,
        vmName
      );
      return true;
    } catch (error) {
      return false;
    }
  }

  public static async stopMinecraftServer(): Promise<boolean> {
    try {
      const privateKey = readFileSync(privateKeyPath, 'utf8'); // Cargar el archivo .pem
      await new Promise<void>((resolve, reject) => {
        const conn = new Client();

        conn
          .on('ready', () => {
            console.log('Conexión SSH establecida.');
            conn.exec(
              'sudo systemctl stop minecraft-server.service',
              (err, stream: ClientChannel) => {
                if (err) {
                  reject(err);
                  return;
                }

                stream
                  .on('close', (code: number, signal: string | null) => {
                    console.log(
                      `Comando ejecutado, código: ${code}, señal: ${signal}`
                    );
                    conn.end();
                    resolve();
                  })
                  .on('data', (data: Buffer) => {
                    console.log(`Salida: ${data.toString()}`);
                  })
                  .stderr.on('data', (data: Buffer) => {
                    console.error(`Error: ${data.toString()}`);
                  });
              }
            );
          })
          .on('error', (err: Error) => {
            reject(err);
          })
          .connect({
            host: sshHost,
            username: sshUser,
            privateKey,
          });
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  public static async shutdownVM(): Promise<boolean> {
    try {
      await computeClient.virtualMachines.beginDeallocateAndWait(
        resourceGroup,
        vmName
      );
      return true;
    } catch (error) {
      return false;
    }
  }
}
