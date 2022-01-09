import { APIMessage, APIMessageComponentInteraction, APIMessageComponentInteractionData, APIMessageSelectMenuInteractionData, ComponentType } from 'discord-api-types';
import { FastifyReply } from 'fastify';
import { Server } from '../Server';
import { Interaction } from './Interaction';

export class ComponentInteraction extends Interaction {
    public readonly message: APIMessage;
    public readonly data!: APIMessageComponentInteractionData | APIMessageSelectMenuInteractionData;
    public readonly customId: string;
    constructor(client: Server, data: APIMessageComponentInteraction, reply: FastifyReply) {
        super(client, data, reply);
        this.message = data.message;
        this.customId = this.data.custom_id;
    }

    get componentType() {
        return this.data.component_type.toString();
    }

    public isComponentButton() {
        return this.data.component_type == ComponentType.Button;
    }

    public isComponentSelectMenu() {
        return this.data.component_type == ComponentType.SelectMenu;
    }

}