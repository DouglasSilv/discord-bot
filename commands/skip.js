module.exports = {
	name: 'skip',
	description: 'Pula uma música',
	execute(message) {
		const serverQueue = message.client.queue.get(message.guild.id);
		if (!message.member.voice.channel) return message.channel.send('Você precisa estar em um canal de voz para pular uma música!');
		if (!serverQueue) return message.channel.send('Não há musicas na fila para pular :disappointed_relieved:');
		serverQueue.connection.dispatcher.end();
		message.react('⏭');
	},
};