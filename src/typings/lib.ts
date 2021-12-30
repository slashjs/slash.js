import type { FastifyInstance, FastifyServerOptions } from 'fastify';
import type { RawInteraction } from '.';

export interface ServerOptions {
    app?: FastifyInstance;
    fastifyOptions?: FastifyServerOptions;
    port: number;
    host: string;
    autoStart?: boolean;

    publicKey: string;
    token: string;
    path: string;
}

export interface ServerEvents {
    ready(): unknown;
    error(error: unknown): unknown;
    raw(data: RawInteraction): unknown;
    ping(): unknown;
}