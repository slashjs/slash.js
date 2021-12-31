import { APIAutocompleteApplicationCommandInteraction } from '../typings';
import {
    APIApplicationCommandInteractionDataOption,
    APIApplicationCommandOptionChoice,
    APIChatInputApplicationCommandInteractionDataResolved,
    InteractionResponseType
} from 'discord-api-types';
import { FastifyReply } from 'fastify';
import { BaseInteraction } from '.';
import { Server } from '../Server';

export class AutocompleteInteraction extends BaseInteraction {
    public commandId: string;
    public commandName: string;
    public options: APIApplicationCommandInteractionDataOption[];
    public resolved: APIChatInputApplicationCommandInteractionDataResolved;

    constructor(client: Server, data: APIAutocompleteApplicationCommandInteraction, reply: FastifyReply) {
        super(client, data, reply);

        this.commandId = data.data.id;
        this.commandName = data.data.name;
        this.options = data.data.options ?? [];
        this.resolved = data.data.resolved ?? {};
    }

    public async send(choices: APIApplicationCommandOptionChoice[]): Promise<void> {
        return await this.res
            .header('Content-Type', 'application/json')
            .send({
                type: InteractionResponseType.ApplicationCommandAutocompleteResult,
                data: { choices }
            });
    }
}