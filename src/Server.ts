import fastify, { FastifyInstance, FastifyReply, FastifyRequest, HookHandlerDoneFunction } from 'fastify';
import { InteractionCallbackTypes, InteractionTypes, RawInteraction, ServerEvents, ServerOptions } from './typings';
import { EventEmitter2, ListenerFn } from 'eventemitter2';
import { DefaultOptions } from './constan';
import nacl from 'tweetnacl';

export interface Server {
    on<E extends keyof ServerEvents>(event: E, listener: ServerEvents[E]): this;
    on(event: string, listener: ListenerFn, options?: boolean): this;
    once<E extends keyof ServerEvents>(event: E, listener: ServerEvents[E]): this;
    once(event: string, listener: ListenerFn, options?: boolean): this;
}

export class Server extends EventEmitter2 {
    private options: ServerOptions;
    app: FastifyInstance;
    ready = false;

    constructor(options: Omit<ServerOptions, 'port' | 'host'>) {
        super();

        this.options = Object.assign({}, DefaultOptions, options);

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
    }

    private isVerified(req: FastifyRequest, reply: FastifyReply, done: HookHandlerDoneFunction): void {
        if (nacl.sign.detached.verify(
            Buffer.from(req.headers['x-signature-timestamp'] + JSON.stringify(req.body)),
            Buffer.from(req.headers['x-signature-ed25519'] as string, 'hex'),
            Buffer.from(this.options.publicKey, 'hex')
        )) return done();

        reply.code(401).send('Unauthorized');
    }

    private handle(req: FastifyRequest<{ Body: RawInteraction; }>, reply: FastifyReply) {
        this.emit('raw', req.body);

        switch (req.body.type) {
            case InteractionTypes.PING:
                this.emit('ping');
                reply.send({
                    type: InteractionCallbackTypes.PONG
                });
                break;
        }
    }

    async start() {
        try {
            await this.app.listen(this.options.port, this.options.host);
            this.ready = true;
            this.emit('ready');
        } catch (e) {
            this.emit('error', e);
            return Promise.reject(e);
        }
    }
}