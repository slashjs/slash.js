import { APIAutocompleteApplicationCommandInteraction } from '../typings';
import {
    APIApplicationCommandInteractionDataOption,
    APIApplicationCommandOptionChoice,
    APIChatInputApplicationCommandInteractionDataResolved,
    InteractionResponseType
} from 'discord-api-types';
import { BaseInteraction, CommandOptions } from '.';
import { FastifyReply } from 'fastify';
import { Server } from '../Server';

export class AutocompleteInteraction extends BaseInteraction {
    public commandId: string;
    public commandName: string;
    public rawOptions: APIApplicationCommandInteractionDataOption[];
    public resolved: APIChatInputApplicationCommandInteractionDataResolved;
    public options: CommandOptions;

    constructor(client: Server, data: APIAutocompleteApplicationCommandInteraction, reply: FastifyReply) {
        super(client, data, reply);

        this.commandId = data.data.id;
        this.commandName = data.data.name;
        this.rawOptions = data.data.options ?? [];
        this.resolved = data.data.resolved ?? {};

        this.options = new CommandOptions(this.rawOptions, this.resolved);
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