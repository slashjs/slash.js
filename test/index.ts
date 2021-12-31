import dotenv from 'dotenv';
dotenv.config();

import { ApplicationCommandOptionType } from 'discord-api-types';
import { Server } from '../src';

const server = new Server({
    path: '/',
    publicKey: process.env.PUBLIC_KEY as string,
    token: process.env.BOT_TOKEN as string,
    autoStart: false
});

server
    .once('ready', () => console.log('Server ready!'))
    .on('raw', console.log)
    .on('command', async (command) => {
        switch (command.commandName) {
            case 'test':
                await command.reply({
                    content: 'slash.js ufff'
                });
                setTimeout(() => command.editReply({
                    content: 'edited with slash.js'
                }), 3000);
                break;
            case 'autocomplete':
                await command.defer();
                setTimeout(async () => {
                    await command.editReply({
                        content: `option: ${command.options[0].type === ApplicationCommandOptionType.String && command.options[0].value}`
                    });

                    setTimeout(() => command.deleteReply(), 3000);
                }, 3000);
                break;
        }
    })
    .on('autocomplete', (interaction) => {
        interaction.send([{
            value: 'yes',
            name: 'This is a yes option'
        }, {
            value: 'no',
            name: 'This is a no option'
        }]);
    });

server.start();