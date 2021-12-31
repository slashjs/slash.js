import type {
    Snowflake, APIApplicationCommandInteraction,
    APIChatInputApplicationCommandInteractionDataResolved,
    APIMessageApplicationCommandInteractionDataResolved,
    APIUserApplicationCommandInteractionDataResolved,
} from 'discord-api-types';
import { FastifyReply } from 'fastify';
import { Server } from '../../Server';
import { Interaction } from '..';

export class BaseCommandInteraction extends Interaction {
    public commandId: Snowflake;
    public name: string;
    public resolved: APIChatInputApplicationCommandInteractionDataResolved | APIUserApplicationCommandInteractionDataResolved | APIMessageApplicationCommandInteractionDataResolved;

    constructor(client: Server, data: APIApplicationCommandInteraction, reply: FastifyReply) {
        super(client, data, reply);

        this.commandId = data.data.id;
        this.name = data.data.name;
        this.resolved = data.data.resolved ?? {};
    }
}