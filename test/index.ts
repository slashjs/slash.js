import dotenv from 'dotenv';
dotenv.config();

import { Server } from '../src';

const server = new Server({
    path: '/',
    publicKey: process.env.PUBLIC_KEY as string,
    token: process.env.BOT_TOKEN as string,
    autoStart: false
});

server
    .once('ready', () => console.log('Server ready!'))
    .on('raw', console.log);

server.start();