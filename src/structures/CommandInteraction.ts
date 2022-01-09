import type {
    APIChatInputApplicationCommandInteractionDataResolved,
    APIChatInputApplicationCommandInteraction,
    APIApplicationCommandInteractionDataOption,
    APIApplicationCommandInteractionData
} from 'discord-api-types';
import { CommandOptions, BaseCommandInteraction } from '.';
import type { FastifyReply } from 'fastify';
import type { Server } from '../Server';

export class CommandInteraction extends BaseCommandInteraction {
    public rawOptions: APIApplicationCommandInteractionDataOption[];
    public resolved: APIChatInputApplicationCommandInteractionDataResolved;
    public readonly data!: APIApplicationCommandInteractionData;
    public options: CommandOptions;

    constructor(client: Server, data: APIChatInputApplicationCommandInteraction, reply: FastifyReply) {
        super(client, data, reply);

        this.rawOptions = data.data.options ?? [];
        this.resolved = data.data.resolved ?? {};

        this.options = new CommandOptions(this.rawOptions, this.resolved);
    }
}