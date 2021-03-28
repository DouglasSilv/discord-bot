require('dotenv').config();

const Client = require('./client/Client');

const bot = new Client();
const { TOKEN, PREFIX } = process.env;

const botCommands = require('./commands');


Object.keys(botCommands).map((key) => {
  bot.commands.set(`${PREFIX}${botCommands[key].name}`, botCommands[key]);
});

bot.login(TOKEN);

bot.on('ready', () => {
  console.info(`Bot Flying Turtledove iniciado ${bot.user.tag}!`);
  bot.user.setActivity(`${PREFIX}help`);
});

bot.on('message', async (msg) => {
  if (msg.author.bot) return;

  try {
    if (msg.content.startsWith(PREFIX)) {
      const args = msg.content.split(/ +/);
      const command = args.shift().toLowerCase();
      console.info(`Called command: ${command}`);

      if (!bot.commands.has(command)) return;

      bot.commands.get(command).execute(msg, args);
    }
  } catch (error) {
    console.error(error);
    msg.reply('Erro executando o comando ;-;');
  }

});