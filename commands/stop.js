module.exports = {
	name: 'stop',
	description: 'Para todas as músicas da fila',
	execute(message) {
		const serverQueue = message.client.queue.get(message.guild.id);
		if (!message.member.voice.channel) return message.channel.send('Você precisa estar em um canal de voz para parar a música!');
		serverQueue.songs = [];
		serverQueue.connection.dispatcher.end();
		message.react('⏹');
	},
};