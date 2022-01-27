import { APIMessage, InteractionResponseType, APIInteractionResponse } from 'discord-api-types';
import type { InteractionReplyData } from '../typings';
import { parseMessage } from '../util/parsers';
import { BaseInteraction, Embed } from '.';
import FormData from 'form-data';
import { FastifyReply } from 'fastify';

export class Interaction extends BaseInteraction {
    sending?: FastifyReply;

    public async rawReply(data: APIInteractionResponse, files: { filename: string; value: Buffer; }[] = []): Promise<void> {
        if (!data || Array.isArray(data) || typeof data !== 'object') throw new TypeError('data must be an object');
        if (!this.res) throw new Error('Reply called on an interaction that has no response.');
        if (this.res.sent || this.sending) throw new Error('Reply already sent.');
        let body, headers: { ['Content-Type']?: string; } = {};
        if (Array.isArray(files) && files.length > 0) {
            body = new FormData();
            for (const key in files) {
                const file = files[key];
                body.append(key, file.value, file);
            }
            if (typeof data !== 'undefined') {
                body.append('payload_json', JSON.stringify(data));
            }
            headers = Object.assign(headers, body.getHeaders());
        } else {
            body = data;
            headers['Content-Type'] = 'application/json';
        }

        this.sending = this.res
            .headers(headers)
            .send(body);

        return this.sending.then(() => {
            delete this.sending;
        }, (err) => {
            delete this.sending;
            throw err;
        });

    }

    public reply(data: InteractionReplyData): Promise<void> {
        if (!data || Array.isArray(data) || typeof data !== 'object') throw new TypeError('data must be an object');
        if (!this.res) throw new Error('Reply called on an interaction that has no response.');
        if (this.res.sent) throw new Error('Interaction already replied.');
        let files: { filename: string; value: Buffer; }[] = [];
        if (data.files) {
            files = data.files.map((f) => ({
                filename: f.name,
                value: f.file,
            }));
            delete data.files;
        }
        return this.rawReply({
            data: parseMessage(data),
            type: InteractionResponseType.ChannelMessageWithSource
        }, files);
    }

    public async editReply(data: InteractionReplyData): Promise<APIMessage> {
        if (this.sending) await this.sending;
        if (!this.res.sent) throw new Error('Interaction can not be edited.');
        return this.client.rest.interaction.editOriginalInteractionResponse(this.applicationId, this.token, {
            ...data,
            embeds: data.embeds?.map((e) => e instanceof Embed ? e.toJSON() : e)
        });
    }

    public async editOrReply(data: InteractionReplyData): Promise<void | APIMessage> {
        if (this.sending) await this.sending;
        if (this.res.sent) return this.editReply(data);
        return this.reply(data);
    }

    public async deleteReply(): Promise<void> {
        if (this.sending) await this.sending;
        if (!this.res.sent) throw new Error('Interaction can not be deleted.');
        return this.client.rest.interaction.deleteOriginalInteractionResponse(this.applicationId, this.token);
    }

    public async fetchReply(): Promise<APIMessage> {
        if (this.sending) await this.sending;
        if (!this.res.sent) throw new Error('Interaction can not be fetched.');
        return this.client.rest.interaction.getOriginalInteractionResponse(this.applicationId, this.token);
    }

    public async defer(): Promise<void> {
        if (this.sending) await this.sending;
        if (this.deferred) throw new Error('Interaction already deferred.');
        this.deferred = true;
        return this.rawReply({
            type: InteractionResponseType.DeferredChannelMessageWithSource
        });
    }
}