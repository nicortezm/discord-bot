import {
  type APIInteractionGuildMember,
  ChatInputCommandInteraction,
  type CommandInteraction,
  type Guild,
  type GuildMember,
  type GuildMemberResolvable,
  type InteractionEditReplyOptions,
  type InteractionReplyOptions,
  Message,
  type MessageCreateOptions,
  type MessageEditOptions,
  type MessagePayload,
  type TextBasedChannel,
  type TextChannel,
  type User,
} from "discord.js";
import { GlobClient } from "../interfaces";

export default class Context {
  public ctx: CommandInteraction | Message;
  public interaction: CommandInteraction | null;
  public message: Message | null;
  public id: string;
  public channelId: string;
  public client: GlobClient;
  public author: User | null;
  public channel: TextBasedChannel;
  public guild: Guild;
  public createdAt: Date;
  public createdTimestamp: number;
  public member:
    | GuildMemberResolvable
    | GuildMember
    | APIInteractionGuildMember
    | null;
  public args: any[];
  public msg: any;

  constructor(ctx: CommandInteraction | Message, args: any[]) {
    this.ctx = ctx;
    this.interaction = ctx instanceof ChatInputCommandInteraction ? ctx : null;
    this.message = ctx instanceof Message ? ctx : null;
    this.channel = ctx.channel!;
    this.id = ctx.id;
    this.channelId = ctx.channelId;
    this.client = ctx.client as GlobClient;
    this.author = ctx instanceof Message ? ctx.author : ctx.user;
    this.guild = ctx.guild!;
    this.createdAt = ctx.createdAt;
    this.createdTimestamp = ctx.createdTimestamp;
    this.member = ctx.member;
    this.args = args;
    this.setArgs(args);
  }

  public get isInteraction(): boolean {
    return this.ctx instanceof ChatInputCommandInteraction;
  }

  public setArgs(args: any[]): void {
    this.args = this.isInteraction
      ? args.map((arg: { value: any }) => arg.value)
      : args;
  }

  public async sendMessage(
    content:
      | string
      | MessagePayload
      | MessageCreateOptions
      | InteractionReplyOptions
  ): Promise<Message> {
    if (this.isInteraction) {
      if (typeof content === "string" || isInteractionReplyOptions(content)) {
        this.msg = await this.interaction?.reply(content);
        return this.msg;
      }
    } else if (typeof content === "string" || isMessagePayload(content)) {
      this.msg = await (this.message?.channel as TextChannel).send(content);
      return this.msg;
    }
    return this.msg;
  }

  public async editMessage(
    content:
      | string
      | MessagePayload
      | InteractionEditReplyOptions
      | MessageEditOptions
  ): Promise<Message> {
    if (this.isInteraction && this.msg) {
      this.msg = await this.interaction?.editReply(content);
      return this.msg;
    }
    if (this.msg) {
      this.msg = await this.msg.edit(content);
      return this.msg;
    }
    return this.msg;
  }

  public async sendDeferMessage(
    content: string | MessagePayload | MessageCreateOptions
  ): Promise<Message> {
    if (this.isInteraction) {
      this.msg = await this.interaction?.deferReply({ fetchReply: true });
      return this.msg;
    }

    this.msg = await (this.message?.channel as TextChannel).send(content);
    return this.msg;
  }

  public get deferred(): boolean | undefined {
    return this.isInteraction ? this.interaction?.deferred : !!this.msg;
  }

  options = {
    getRole: (name: string, required = true) => {
      return this.interaction?.options.get(name, required)?.role;
    },
    getMember: (name: string, required = true) => {
      return this.interaction?.options.get(name, required)?.member;
    },
    get: (name: string, required = true) => {
      return this.interaction?.options.get(name, required);
    },
    getChannel: (name: string, required = true) => {
      return this.interaction?.options.get(name, required)?.channel;
    },
    getSubCommand: () => {
      return this.interaction?.options.data[0].name;
    },
  };
}

function isInteractionReplyOptions(
  content: any
): content is InteractionReplyOptions {
  return content instanceof Object;
}

function isMessagePayload(content: any): content is MessagePayload {
  return content instanceof Object;
}
