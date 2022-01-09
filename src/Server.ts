import {
    APIChatInputApplicationCommandInteraction, APIInteraction,
    APIMessageApplicationCommandInteraction, InteractionType,
    APIMessageComponentInteraction, InteractionResponseType,
    APIUserApplicationCommandInteraction, ComponentType,
    ApplicationCommandType
} from 'discord-api-types';
import {
    AutocompleteInteraction, ButtonInteraction,
    ContextMenuInteraction, SelectMenuInteraction,
    CommandInteraction
} from './structures';
import fastify, { FastifyInstance, FastifyReply, FastifyRequest, HookHandlerDoneFunction } from 'fastify';
import type { APIAutocompleteApplicationCommandInteraction, ServerEvents, ServerOptions } from './typings';
import { EventEmitter2, ListenerFn } from 'eventemitter2';
import { SnowTransfer } from '@slash.js/rest';
import { DefaultOptions } from './constan';
import nacl from 'tweetnacl';

interface InternalOptions extends ServerOptions {
    port: number;
    host: string;
}

export interface Server {
    on<E extends keyof ServerEvents>(event: E, listener: ServerEvents[E]): this;
    on(event: string, listener: ListenerFn, options?: boolean): this;
    once<E extends keyof ServerEvents>(event: E, listener: ServerEvents[E]): this;
    once(event: string, listener: ListenerFn, options?: boolean): this;
}

export class Server extends EventEmitter2 {
    private options: InternalOptions;
    public app: FastifyInstance;
    public rest: SnowTransfer;
    public ready = false;

    constructor(options: ServerOptions) {
        super();

        this.options = Object.assign({}, DefaultOptions, options) as InternalOptions;

        this.rest = new SnowTransfer(this.options.token, {
            disableEveryone: this.options.disableEveryone
        });

        if (this.options.app instanceof fastify) {
            this.app = this.options.app;
            delete this.options.app;
        } else {
            this.app = fastify(this.options.fastifyOptions);
        }

        this.registerRoutes();

        if (!this.app.server.listening && this.options.autoStart)
            this.start();
    }

    private registerRoutes() {
        if (!this.app) return;

        this.app.route({
            method: 'POST',
            url: this.options.path,
            preHandler: this.isVerified.bind(this),
            handler: this.handle.bind(this)
        });

        this.app.addHook('onError', (req, _, err, done) => {
            if (req.url === this.options.path)
                this.emit('error', err);

            done();
        });

        this.emit('debug', 'Registered routes and error hook.');
    }

    private isVerified(req: FastifyRequest, reply: FastifyReply, done: HookHandlerDoneFunction): void {
        if (nacl.sign.detached.verify(
            Buffer.from(req.headers['x-signature-timestamp'] + JSON.stringify(req.body)),
            Buffer.from(req.headers['x-signature-ed25519'] as string, 'hex'),
            Buffer.from(this.options.publicKey, 'hex')
        )) return done();

        reply.code(401).send('Unauthorized');
    }

    private handle(req: FastifyRequest<{ Body: APIInteraction; }>, reply: FastifyReply) {
        this.emit('raw', req.body, reply);
        this.emit('debug', 'Handling interaction with type ' + req.body.type);

        switch (req.body.type) {
            case InteractionType.Ping:
                this.emit('ping');
                reply.send({
                    type: InteractionResponseType.Pong
                });
                break;
            case InteractionType.ApplicationCommand:
                switch (req.body.data.type) {
                    case ApplicationCommandType.ChatInput:
                        this.emit('command', new CommandInteraction(this, req.body as APIChatInputApplicationCommandInteraction, reply));
                        break;
                    case ApplicationCommandType.Message:
                    case ApplicationCommandType.User:
                        this.emit('contextMenu', new ContextMenuInteraction(this, req.body as APIMessageApplicationCommandInteraction | APIUserApplicationCommandInteraction, reply));
                        break;
                    default:
                        this.emit('debug', `Received unknown or unsupported command interaction with data.type ${(req.body.data as { type: number; }).type}`);
                        break;
                }
                break;
            case InteractionType.MessageComponent:
                switch (req.body.data.component_type) {
                    case ComponentType.Button:
                        this.emit('button', new ButtonInteraction(this, req.body as APIMessageComponentInteraction, reply));
                        break;
                    case ComponentType.SelectMenu:
                        this.emit('selectMenu', new SelectMenuInteraction(this, req.body as APIMessageComponentInteraction, reply));
                        break;
                    default:
                        this.emit('debug', `Received unknown or unsupported message component interaction with data.component_type ${(req.body.data as { component_type: number; }).component_type}`);
                        break;
                }
                break;
            case InteractionType.ApplicationCommandAutocomplete:
                this.emit('autocomplete', new AutocompleteInteraction(this, req.body as APIAutocompleteApplicationCommandInteraction, reply));
                break;
            default:
                this.emit('debug', `Received unknown or unsupported interaction with type ${(req.body as { type: number; }).type}`);
                break;
        }
    }

    public async start() {
        this.emit('debug', `Trying to start server on host ${this.options.host} and port ${this.options.port}...`);
        try {
            await this.app.listen(this.options.port, this.options.host);
            this.ready = true;
            this.emit('ready');
            this.emit('debug', 'Server started.');
        } catch (e) {
            this.emit('error', e);
            return Promise.reject(e);
        }
    }
}