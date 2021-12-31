import type { APIApplicationCommandInteractionData, APIGuildMember, APIInteraction, APIMessageComponentInteractionData, APIUser, Snowflake } from 'discord-api-types';
import { FastifyReply } from 'fastify';
import { Server } from '../../Server';

export class BaseInteraction {
    public readonly res: FastifyReply;
    public readonly id: Snowflake;
    public readonly applicationId: Snowflake;
    public readonly type: string;
    public readonly data?: APIApplicationCommandInteractionData | APIMessageComponentInteractionData;
    public readonly guildId?: Snowflake;
    public readonly channelId?: Snowflake;
    public readonly member?: APIGuildMember;
    public readonly user: APIUser;
    public readonly token: string;
    public readonly version: number;
    public deferred = false;

    constructor(public readonly client: Server, data: APIInteraction, reply: FastifyReply) {
        this.client = client;

        this.id = data.id;
        this.applicationId = data.application_id;
        this.type = data.type.toString();
        this.data = data.data;
        this.guildId = data.guild_id;
        this.channelId = data.channel_id;
        this.user = (data.member ? data.member.user : data.user) as APIUser;
        this.member = data.member;
        this.token = data.token;
        this.version = data.version;

        this.res = reply;
    }
}