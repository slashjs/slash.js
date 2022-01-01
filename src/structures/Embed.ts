import { APIEmbed, APIEmbedAuthor, APIEmbedField } from 'discord-api-types';
import { resolveColor } from '../util/util';

// eslint-disable-next-line  @typescript-eslint/no-empty-interface
export interface Embed extends APIEmbed { }

export class Embed {
    constructor(data: APIEmbed = {}) {
        this.title = data.title;
        this.description = data.description;
        this.url = data.url;
        this.color = ('color' in data) ? resolveColor((data.color as number)) : undefined;
        this.timestamp = ('timestamp' in data) ? data.timestamp : undefined;

        this.footer = data.footer ? {
            text: data.footer.text,
            icon_url: data.footer.icon_url,
            proxy_icon_url: data.footer.proxy_icon_url
        } : undefined;

        this.image = data.image ?
            {
                url: data.image.url,
                proxy_url: data.image.proxy_url,
                height: data.image.height,
                width: data.image.width,
            } : undefined;

        this.thumbnail = data.thumbnail ?
            {
                url: data.thumbnail.url,
                proxy_url: data.thumbnail.proxy_url,
                height: data.thumbnail.height,
                width: data.thumbnail.width,
            } : undefined;

        this.video = data.video ?
            {
                url: data.video.url,
                height: data.video.height,
                width: data.video.width
            } : undefined;

        this.provider = data.provider ?
            {
                name: data.provider.name,
                url: data.provider.url ?? data.provider.name
            } : undefined;

        this.author = data.author ?
            {
                name: data.author.name,
                url: data.author.url,
                icon_url: data.author.icon_url,
                proxy_icon_url: data.author.proxy_icon_url
            } : undefined;

        this.fields = data.fields;
    }

    get createdAt(): Date | null {
        return this.timestamp ? new Date(this.timestamp) : null;
    }

    addField(name: string, value: string, inline: boolean): this {
        return this.addFields({ name, value, inline });
    }

    addFields(...fields: APIEmbedField[]): this {
        this.fields?.push(...fields);
        return this;
    }

    setAuthor(options: APIEmbedAuthor): this {
        this.author = options;
        return this;
    }

    setColor(color: string | number): this {
        this.color = resolveColor(color);
        return this;
    }

    setDescription(description: string): this {
        this.description = description;
        return this;
    }

    setFooter(text: string, icon_url: string): this {
        this.footer = {
            text: text,
            icon_url: icon_url
        };
        return this;
    }

    setImage(url: string): this {
        this.image = { url };
        return this;
    }

    setThumbnail(url: string): this {
        this.thumbnail = { url };
        return this;
    }

    setTimestamp(timestamp: Date | number = Date.now()): this {
        if (timestamp instanceof Date) timestamp = timestamp.getTime();
        this.timestamp = String(timestamp);
        return this;
    }

    setTitle(title: string): this {
        this.title = title;
        return this;
    }

    setUrl(url: string): this {
        this.url = url;
        return this;
    }

    toJSON(): APIEmbed {
        return {
            title: this.title,
            description: this.description,
            url: this.url,
            timestamp: this.timestamp,
            color: this.color,
            fields: this.fields,
            thumbnail: this.thumbnail,
            image: this.image,
            author: this.author && {
                name: this.author.name,
                url: this.author.url,
                icon_url: this.author.icon_url,
            },
            footer: this.footer && {
                text: this.footer.text,
                icon_url: this.footer.icon_url,
            },
        };
    }

}