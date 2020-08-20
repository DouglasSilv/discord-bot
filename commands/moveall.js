var stringSimilarity = require('string-similarity');

module.exports = {
	name: 'moveall',
	description: 'Move todos os membros do canal atual para outro canal de voz.',
	execute(message) {
    if (!message.member.voice.channel) return message.reply('você precisa estar em um canal de voz para mover os membros!');

    const criteria = message.content.substring(message.content.indexOf('move') + 5, message.content.length).toUpperCase();

    const categories = message.guild.channels.cache
          .filter(c => c.type == 'category')
          .map(c => { return { ...c, name: c.name.toUpperCase() } });

    const bestMatch = categories.reduce((prev, current) => {
      return (stringSimilarity.compareTwoStrings(prev.name, criteria) > 
                  stringSimilarity.compareTwoStrings(current.name, criteria)) ? 
                    prev : current;
    });

    const voiceChannels = message.guild.channels.cache.filter(c => c.type == 'voice');

    const voiceChannel = voiceChannels.find(c => c.parentID === bestMatch.id);

    if (voiceChannel) {
      message.member.voice.channel.members.forEach(member => {
        member.voice.setChannel(voiceChannel);
      });
      message.channel.send(`Apertem os cintos! Rumo ao canal **${bestMatch.name}** - **${voiceChannel.name}**`);
      message.react('🚀')
    } else {
      message.reply(`a categoria **${bestMatch.name}** não possui nenhum canal de voz`);
    }
    
	},
};