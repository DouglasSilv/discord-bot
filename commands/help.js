const fs = require('fs');

module.exports = {
	name: 'help',
	description: 'Lista todos os comandos disponiveis.',
	execute(message) {
    const { PREFIX } = process.env;
    
    let str = '';
		const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

		for (const file of commandFiles) {
      const command = require(`./${file}`);
      if (command.name) {
        str += `**Comando:** ${PREFIX}${command.name}, **Descrição:** ${command.description} \n`;
      }
		}

		message.channel.send(str)
	},
};