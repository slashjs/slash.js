import type {
    APIInteraction, APIInteractionResponseCallbackData,
    APIBaseInteraction, InteractionType
} from 'discord-api-types';
import type { AutocompleteInteraction, CommandInteraction } from '..';
import type { FastifyInstance, FastifyServerOptions } from 'fastify';

export interface ServerOptions {
    // fastify/server options
    app?: FastifyInstance;
    fastifyOptions?: FastifyServerOptions;
    autoStart?: boolean;
    port: number;
    host: string;

    // General slash.js options
    disableEveryone?: boolean;
    publicKey: string;
    token: string;
    path: string;
}

export interface ServerEvents {
    ready(): unknown;
    error(error: unknown): unknown;
    debug(message: string): unknown;
    raw(data: APIInteraction): unknown;
    ping(): unknown;
    command(command: CommandInteraction): unknown;
    autocomplete(interaction: AutocompleteInteraction): unknown;
}

export interface File {
    name: string;
    file: Buffer;
}

export type InteractionReplyData = APIInteractionResponseCallbackData & {
    thread_id?: string;
    files?: File[];
};

export type APIAutocompleteApplicationCommandInteraction = APIBaseInteraction<InteractionType.ApplicationCommandAutocomplete, Data> & Required<Pick<APIBaseInteraction<InteractionType.ApplicationCommandAutocomplete, Data>, 'data'>>;