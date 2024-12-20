import type { Client, ClientEvents, Collection } from 'discord.js';
import { Command } from './command';
import { Devs } from '../config';
import { Button } from './components';
import { Kazagumo } from 'kazagumo';

export type GlobClient = Client<true> & Extraclient;

interface Extraclient {
  config: typeof Devs;
  events: Collection<keyof ClientEvents, () => void>;
  commands: Collection<string, Command>;
  buttons: Collection<string, Button>;
  manager?: Kazagumo;
}


export interface Event<T extends keyof ClientEvents> {
  name: T;
  rest?: boolean;
  once?: boolean;
  execute: (..._args: any) => void;
}
