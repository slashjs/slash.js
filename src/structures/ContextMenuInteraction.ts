import {
    APIUserApplicationCommandInteractionDataResolved,
    APIMessageApplicationCommandInteractionDataResolved,
    APIMessageApplicationCommandInteraction,
    APIUserApplicationCommandInteraction,
    APIMessageApplicationCommandInteractionData,
    APIUserApplicationCommandInteractionData,
    APIUser, APIMessage, ApplicationCommandType
} from 'discord-api-types';
import type { FastifyReply } from 'fastify';
import { BaseCommandInteraction } from '.';
import type { Server } from '../Server';

export class ContextMenuInteraction extends BaseCommandInteraction {
    public readonly resolved: APIUserApplicationCommandInteractionDataResolved | APIMessageApplicationCommandInteractionDataResolved;
    public readonly data!: APIMessageApplicationCommandInteractionData | APIUserApplicationCommandInteractionData;
    public readonly target: APIUser | APIMessage;

    constructor(client: Server, data: APIMessageApplicationCommandInteraction | APIUserApplicationCommandInteraction, reply: FastifyReply) {
        super(client, data, reply);

        this.resolved = (data.data.resolved ?? {}) as typeof this['resolved'];
        this.target = ('users' in this.resolved
            ? this.resolved.users[data.data.target_id]
            : this.resolved.messages[data.data.target_id]) as typeof this['target'];
    }

    public isUserContext(): this is UserContextInteraction {
        return this.data.type === ApplicationCommandType.User;
    }

    public isMessageContext(): this is MessageContextInteraction {
        return this.data.type === ApplicationCommandType.Message;
    }
}

export type UserContextInteraction = ContextMenuInteraction & {
    readonly target: APIUser;
};

export type MessageContextInteraction = ContextMenuInteraction & {
    readonly target: APIMessage;
};