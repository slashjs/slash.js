import {
    APIMessage, APIMessageComponentInteraction,
    APIMessageSelectMenuInteractionData,
    APIMessageButtonInteractionData,
    InteractionResponseType, ComponentType
} from 'discord-api-types';
import type { SelectMenuInteraction, ButtonInteraction } from '.';
import type { InteractionReplyData } from '../typings';
import { parseMessage } from '../util/parsers';
import type { FastifyReply } from 'fastify';
import { Interaction } from './Interaction';
import type { Server } from '../Server';

export class ComponentInteraction extends Interaction {
    public readonly customId: string;
    public readonly componentType: ComponentType;
    public readonly message: APIMessage;
    public readonly data!: APIMessageButtonInteractionData | APIMessageSelectMenuInteractionData;

    constructor(client: Server, data: APIMessageComponentInteraction, reply: FastifyReply) {
        super(client, data, reply);

        this.customId = this.data.custom_id;
        this.componentType = this.data.component_type;
        this.message = data.message;
    }

    public deferUpdate(): Promise<void> {
        if (this.deferred) throw new Error('Interaction already deferred.');
        this.deferred = true;
        return this.rawReply({
            type: InteractionResponseType.DeferredMessageUpdate
        });
    }

    public update(data: InteractionReplyData): Promise<void> {
        if (!data || Array.isArray(data) || typeof data !== 'object') throw new TypeError('data must be an object');
        if (!this.res) throw new Error('Reply called on an interaction that has no response.');
        if (this.res.sent) throw new Error('Interaction already replied.');
        return this.rawReply({
            data: parseMessage(data),
            type: InteractionResponseType.UpdateMessage
        });
    }

    public isButton(): this is ButtonInteraction {
        return this.data.component_type === ComponentType.Button;
    }

    public isSelectMenu(): this is SelectMenuInteraction {
        return this.data.component_type === ComponentType.SelectMenu;
    }
}