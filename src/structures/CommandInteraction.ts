import type {
    APIChatInputApplicationCommandInteractionDataResolved,
    APIChatInputApplicationCommandInteraction,
    APIApplicationCommandInteractionDataOption
} from 'discord-api-types';
import { BaseCommandInteraction } from '.';
import { FastifyReply } from 'fastify';
import { Server } from '../Server';

export class CommandInteraction extends BaseCommandInteraction {
    public options: APIApplicationCommandInteractionDataOption[];
    public resolved: APIChatInputApplicationCommandInteractionDataResolved;

    constructor(client: Server, data: APIChatInputApplicationCommandInteraction, reply: FastifyReply) {
        super(client, data, reply);

        this.options = data.data.options ?? [];
        this.resolved = data.data.resolved ?? {};
    }
}