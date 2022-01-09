import {
    APIMessageComponentInteraction,
    APIMessageSelectMenuInteractionData
} from 'discord-api-types';
import type { FastifyReply } from 'fastify';
import { ComponentInteraction } from '.';
import type { Server } from '../Server';

export class SelectMenuInteraction extends ComponentInteraction {
    public readonly data!: APIMessageSelectMenuInteractionData;
    public readonly values: string[];

    constructor(client: Server, data: APIMessageComponentInteraction, reply: FastifyReply) {
        super(client, data, reply);

        this.values = this.data.values;
    }
}