import {
    APIMessageButtonInteractionData,
    APIMessageComponentInteraction
} from 'discord-api-types';
import type { FastifyReply } from 'fastify';
import { ComponentInteraction } from '.';
import type { Server } from '../Server';

export class ButtonInteraction extends ComponentInteraction {
    public readonly data!: APIMessageButtonInteractionData;

    constructor(client: Server, data: APIMessageComponentInteraction, reply: FastifyReply) {
        super(client, data, reply);
    }
}