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
  .on('error', console.error)
  // .on('raw', console.log)
  .on('command', async (command) => {
    switch (command.name) {
      case 'test':
        await command.reply({
          content: 'slash.js ufff'
        });
        setTimeout(() => command.editReply({
          content: 'edited with slash.js'
        }), 3000);
        break;
      case 'pick':
        await command.defer();
        setTimeout(async () => {
          await command.editReply({
            content: `you picked: ${command.rawOptions[0].type === ApplicationCommandOptionType.String && command.rawOptions[0].value}`
          });

          setTimeout(() => command.deleteReply(), 3000);
        }, 3000);
        break;
      case 'info':
        switch (command.options.getSubcommand()) {
          case 'user': {
            const user = command.options.getUser('user')!;
            await command.reply({
              embeds: [{
                color: 0xFFFF99,
                title: `${user.username}#${user.discriminator}'s information`,
                description: `ID: ${user.id}\nAvatar: <${'https://cdn.discordapp.com/avatars/' + user.id + '/' + user.avatar + '.png'}>\nBot: ${user.bot}`,
                image: {
                  url: 'https://cdn.discordapp.com/avatars/' + user.id + '/' + user.avatar + '.png'
                }
              }]
            });
            break;
          }
          case 'channel': {
            const channel = command.options.getChannel('channel')!;
            console.log(channel);
            if (channel.type !== 0) return;
            await command.reply({
              embeds: [{
                color: 0xFFFF99,
                title: `Channel #${channel.name}'s information`,
                description: `ID: ${channel.id}\nType: ${channel.type}`
              }]
            });
            break;
          }
        }
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