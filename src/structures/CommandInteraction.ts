import type {
    APIChatInputApplicationCommandInteractionDataResolved,
    APIChatInputApplicationCommandInteraction,
    APIApplicationCommandInteractionDataOption,
    APIApplicationCommandInteractionData
} from 'discord-api-types';
import { CommandOptions, BaseCommandInteraction } from '.';
import { FastifyReply } from 'fastify';
import { Server } from '../Server';

export class CommandInteraction extends BaseCommandInteraction {
    public rawOptions: APIApplicationCommandInteractionDataOption[];
    public resolved: APIChatInputApplicationCommandInteractionDataResolved;
    public options: CommandOptions;
    public readonly data?: APIApplicationCommandInteractionData;


    constructor(client: Server, data: APIChatInputApplicationCommandInteraction, reply: FastifyReply) {
        super(client, data, reply);

        this.rawOptions = data.data.options ?? [];
        this.resolved = data.data.resolved ?? {};

        this.options = new CommandOptions(this.rawOptions, this.resolved);
    }
}