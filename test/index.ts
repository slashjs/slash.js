import dotenv from 'dotenv';
dotenv.config();

import { ApplicationCommandOptionType } from 'discord-api-types';
import { Server } from '../src';
import { Embed } from '../src/structures/Embed';

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
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const user = command.options.getUser('user')!;
            await command.reply({
              embeds: [
                new Embed()
                  .setColor(0xFFFF99)
                  .setTitle(`${user.username}#${user.discriminator}'s information`)
                  .setDescription(`ID: ${user.id}\nAvatar: <${'https://cdn.discordapp.com/avatars/' + user.id + '/' + user.avatar + '.png'}>\nBot: ${user.bot ?? 'false'}`)
                  .setImage(`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`)
              ]
            });
            break;
          }
          case 'channel': {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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
  })
  .on('contextMenu', interaction => {
    if (interaction.isUserContext()) {
      interaction.reply({
        content: interaction.target.username
      });
    } else if (interaction.isMessageContext()) {
      interaction.reply({
        content: interaction.target.content || 'no-content'
      });
    }
  });

server.rest.interaction.bulkOverwriteGuildApplicationCommand('829828127399870504', '901244976770465842', [{
  type: 2,
  name: 'test',
}, {
  type: 3,
  name: 'test message',
}])
  .then(() => {
    console.log('Bulk overwritten!');
  })
  .catch(console.error);

server.start();