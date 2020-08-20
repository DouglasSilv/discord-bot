module.exports = {
	name: 'remove',
	description: 'Remove uma música da fila',
	execute(message, args) {
		const serverQueue = message.client.queue.get(message.guild.id);
		if (!message.member.voice.channel) return message.channel.send('Você precisa estar em um canal de voz para remover uma música!');
    if (!serverQueue) return message.channel.send('Não há musica para remover na fila :disappointed_relieved:');

    const remove = Number(message.content.split(" ")[1]);

    if (serverQueue.songs.length < remove || remove < 1) {
      return message.channel.send(`Não há nenhuma música na posição ${remove}`);
    }

    message.react("❌");
    
    if (remove === 1) {
      serverQueue.connection.dispatcher.end();
    } else {
      serverQueue.songs.splice((remove - 1), 1);
    }

	},
};