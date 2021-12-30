export type Snowflake = string;

// https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object-interaction-structure
export interface RawInteraction {
    id: Snowflake;
    application_id: Snowflake;
    type: InteractionTypes;
    data?: unknown; //
    guild_id?: Snowflake;
    channel_id?: Snowflake;
    member?: unknown;
    user?: unknown; //
    token: string;
    version: number;
    message?: unknown; //
}

export enum InteractionCallbackTypes {
    PONG = 1,
    CHANNEL_MESSAGE_WITH_SOURCE = 4,
    DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
    DEFERRED_UPDATE_MESSAGE,
    UPDATE_MESSAGE,
    APPLICATION_COMMAND_AUTOCOMPLETE_RESULT
}

export enum InteractionTypes {
    PING = 1,
    APPLICATION_COMMAND,
    MESSAGE_COMPONENT,
    APPLICATION_COMMAND_AUTOCOMPLETE
}