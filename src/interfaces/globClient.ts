import type { Client, ClientEvents, Collection } from 'discord.js';
import { Command } from './command';
import { Devs } from '../config';
import { Button } from './components';

export type GlobClient = Client<true> & Extraclient;

interface Extraclient {
  config: typeof Devs;
  events: Collection<keyof ClientEvents, () => void>;
  commands: Collection<string, Command>;
  buttons: Collection<string, Button>;
}

export interface Event<T extends keyof ClientEvents> {
  name: T;
  rest?: boolean;
  once?: boolean;
  execute: (client: GlobClient, ...args: ClientEvents[T]) => void;
}
