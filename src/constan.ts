import type { ServerOptions } from './typings';

export const DefaultOptions: ServerOptions = {
    app: undefined,
    fastifyOptions: {},
    port: 3000,
    host: '0.0.0.0',
    autoStart: true,

    publicKey: '',
    token: '',
    path: '/'
};

export const DiscordEpoch = 1_420_070_400_000n;