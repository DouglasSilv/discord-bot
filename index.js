require('dotenv').config();

const puppeteer = require('puppeteer');

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


  if (isValidHttpUrl(msg)) {
    const VIEWPORT = { width: 1920, height: 1080}
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.setViewport(VIEWPORT);
    await page.goto(String(msg));
    const screenshot = await page.screenshot({
      waitUntil: 'domcontentloaded',
    });
    await page.close();
    await browser.close();
    msg.channel.send(`Poupei o seu trabalho e montei um preview do site para você ${msg.author} ( ͡° ͜ʖ ͡°)`, 
      {
        files: [screenshot]
      }
    );
  }

});

const isValidHttpUrl = (string) => {
  let url;

  try {
    url = new URL(string);
  } catch (_) {
    return false;  
  }

  return url.protocol === "http:" || url.protocol === "https:";
}