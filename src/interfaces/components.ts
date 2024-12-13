import { ButtonInteraction } from 'discord.js';
import { GlobClient } from './globClient';

interface Component {
  name: string;
}

export interface Button extends Component {
  execute: (
    client: GlobClient,
    interaction: ButtonInteraction,
    ...args: string[]
  ) => void;
}
