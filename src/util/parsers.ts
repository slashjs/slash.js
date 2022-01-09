import type { APIInteractionResponseCallbackData } from 'discord-api-types';
import type { InteractionReplyData } from '../typings';
import { Embed } from '..';

export function parseMessage(data: InteractionReplyData): APIInteractionResponseCallbackData {
    return {
        ...data,
        embeds: data.embeds?.map((e) => e instanceof Embed ? e.toJSON() : e),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        components: data.components?.map((c) => 'toJSON' in c ? (c as unknown as { toJSON(): any; }).toJSON() : c)
    };
}