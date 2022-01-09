import {
    APIUserApplicationCommandInteractionDataResolved,
    APIMessageApplicationCommandInteractionDataResolved,
    APIMessageApplicationCommandInteraction,
    APIUserApplicationCommandInteraction,
    APIMessageApplicationCommandInteractionData,
    APIUserApplicationCommandInteractionData,
    APIUser,
    APIMessage,
    ApplicationCommandType
} from 'discord-api-types';
import { BaseCommandInteraction } from '.';
import { FastifyReply } from 'fastify';
import { Server } from '../Server';

export class ContextMenuInteraction<T extends 'user' | 'message' = 'user'> extends BaseCommandInteraction {
    public readonly resolved: APIUserApplicationCommandInteractionDataResolved | APIMessageApplicationCommandInteractionDataResolved;
    public readonly data!: APIMessageApplicationCommandInteractionData | APIUserApplicationCommandInteractionData;
    public readonly target: T extends 'user' ? APIUser : APIMessage;

    constructor(client: Server, data: APIMessageApplicationCommandInteraction | APIUserApplicationCommandInteraction, reply: FastifyReply) {
        super(client, data, reply);

        this.resolved = (data.data.resolved ?? {}) as typeof this['resolved'];
        this.target = ('users' in this.resolved
            ? this.resolved.users[data.data.target_id]
            : this.resolved.messages[data.data.target_id]) as typeof this['target'];
    }

    public isUserContext(): this is ContextMenuInteraction<'user'> {
        return this.data.type === ApplicationCommandType.User;
    }

    public isMessageContext(): this is ContextMenuInteraction<'message'> {
        return this.data.type === ApplicationCommandType.Message;
    }
}