module.exports = {
	name: 'queue',
	description: 'Exibe as músicas na fila',
	execute(message) {
		const serverQueue = message.client.queue.get(message.guild.id);
		if (!message.member.voice.channel) return message.channel.send('Você precisa estar em um canal de voz para acessar a fila!');
    if (!serverQueue) return message.channel.send('Não há musicas na fila  :disappointed_relieved:');
    
    let str = '';

    serverQueue.songs.forEach((song, index) => {
      str+= `**Posição:** ${index + 1}, **Música:** ${song.title} \n`;
    });
		message.channel.send(str);
	},
};