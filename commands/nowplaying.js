module.exports = {
	name: 'nowplaying',
	description: 'Retorna a música tocando no momento.',
	execute(message) {
		const serverQueue = message.client.queue.get(message.guild.id);
		if (!serverQueue) return message.channel.send('Não há nada tocando no momento.');
		return message.channel.send(`Tocando agora: **${serverQueue.songs[0].title}**`);
	},
};