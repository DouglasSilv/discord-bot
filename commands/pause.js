module.exports = {
	name: 'pause',
	description: 'Pausa a música',
	execute(message) {
		const serverQueue = message.client.queue.get(message.guild.id);
		if (!message.member.voice.channel) return message.channel.send('Você precisa estar em um canal de voz para pausar a música!');
    if (!serverQueue) return message.channel.send('Não há musica para pausar :disappointed_relieved:');
    message.react("⏸");
		serverQueue.connection.dispatcher.pause();
	},
};